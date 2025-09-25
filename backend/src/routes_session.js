const express = require('express');
const { createClient } = require('@supabase/supabase-js');
const { v4: uuidv4 } = require('uuid');
const { TextToSpeechClient } = require('@google-cloud/text-to-speech');
const { getGoogleCredentials } = require('./google-credentials');
// No sanitization - use raw AI output directly
require('dotenv').config();

// No sanitization or validation - use raw AI output directly

const router = express.Router();

// Initialize Google Cloud TTS
let ttsClient = null;
const credentialsPath = getGoogleCredentials();

if (credentialsPath) {
  try {
    ttsClient = new TextToSpeechClient({
      keyFilename: credentialsPath
    });
    console.log('✅ Google Cloud TTS initialized in session routes');
  } catch (error) {
    console.log('⚠️ Google Cloud TTS not available in session routes:', error.message);
  }
} else {
  console.log('⚠️ Google Cloud TTS credentials not provided in session routes');
}

// Initialize Supabase
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = (SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY)
  ? createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)
  : null;

// Idempotency store (in production, use Redis)
const idempotencyStore = new Map();

// Note: Enhanced prompts are now handled in openai-content-generator.js
// This file now focuses on session management and TTS integration

// TTS generation is now handled by tts-generator.js

// Upload audio to Supabase Storage
async function uploadAudioToStorage(audioBuffer, sessionId) {
  if (!supabase) {
    throw new Error('Supabase not configured');
  }

  const filePath = `sessions/${sessionId}.mp3`;
  
  const { data, error } = await supabase.storage
    .from('sessions')
    .upload(filePath, audioBuffer, {
      contentType: 'audio/mpeg',
      upsert: true,
    });

  if (error) {
    throw new Error(`Storage upload failed: ${error.message}`);
  }

  // Get public URL
  const { data: urlData } = supabase.storage
    .from('sessions')
    .getPublicUrl(filePath);

  return urlData.publicUrl;
}

// Store session in database
async function storeSession(sessionData) {
  if (!supabase) {
    throw new Error('Supabase not configured');
  }

  const { data, error } = await supabase
    .from('sessions')
    .insert([sessionData])
    .select()
    .single();

  if (error) {
    throw new Error(`Database insert failed: ${error.message}`);
  }

  return data;
}

// POST /api/v1/session/create - Create new session without audio (for sequential flow)
router.post('/create', async (req, res) => {
  const sessionId = `session-${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  
  try {
    console.log(`[${sessionId}] Creating session without audio...`);
    console.log(`[${sessionId}] Request body:`, req.body);
    
    const { kind, mood, duration, user_notes } = req.body;
    
    // Use duration as provided
    let validatedDuration = duration || 5;
    
    // Get user_id from authenticated user only
    const userId = req.user?.id;
    
    if (!userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }
    
    console.log(`[${sessionId}] User ID: ${userId}`);
    
    // Generate session name for the session
    const { generateSessionName } = require('./openai-content-generator');
    const sessionName = await generateSessionName(
      kind || 'meditation',
      mood || 'calm', 
      validatedDuration,
      user_notes || '',
      null, // user_name - will be fetched from profile if needed
      userId
    );
    console.log(`[${sessionId}] Generated session name: ${sessionName}`);

    // Create session data without audio (using existing schema)
    const sessionData = {
      user_id: userId,
      kind: kind || 'meditation',
      mood: mood || 'calm',
      duration: validatedDuration,
      script: '', // Empty script initially
      user_notes: user_notes || '',
      session_name: sessionName
    };

    // Insert session into database and get the generated ID
    console.log(`[${sessionId}] Attempting to insert session data:`, sessionData);
    
    const { data: insertedSession, error: insertError } = await supabase
      .from('sessions')
      .insert([sessionData])
      .select()
      .single();

    console.log(`[${sessionId}] Insert result:`, { data: insertedSession, error: insertError });

    if (insertError) {
      console.error(`[${sessionId}] Database insert failed:`, insertError);
      console.error(`[${sessionId}] Session data:`, sessionData);
      return res.status(500).json({ error: 'Failed to create session', details: insertError.message });
    }

    console.log(`[${sessionId}] Session created successfully without audio`);
    
    res.json({
      session_id: insertedSession.id,  // Use the actual generated ID
      status: 'created'
    });
    
  } catch (error) {
    console.error(`[${sessionId}] Session creation failed:`, error.message);
    console.error(`[${sessionId}] Error stack:`, error.stack);
    res.status(500).json({ error: 'Session creation failed', details: error.message });
  }
});

// POST /api/v1/session/:id/generate-script - Generate SSML script for session
router.post('/:id/generate-script', async (req, res) => {
  const sessionId = req.params.id;
  
  try {
    console.log(`[${sessionId}] Generating SSML script...`);
    
    // Get session data
    const { data: session, error: fetchError } = await supabase
      .from('sessions')
      .select('*')
      .eq('id', sessionId)
      .single();

    if (fetchError || !session) {
      console.error(`[${sessionId}] Session not found:`, fetchError);
      return res.status(404).json({ error: 'Session not found' });
    }

    if (session.script_generated) {
      console.log(`[${sessionId}] Script already generated`);
      return res.json({
        session_id: sessionId,
        status: 'script_generated',
        script_content: session.script_content
      });
    }

    // Generate session name and SSML script using OpenAI
    const { generateContentWithOpenAI, generateSessionName } = require('./openai-content-generator');
    
    // Generate session name
    const sessionName = await generateSessionName(
      session.kind,
      session.mood,
      session.duration,
      session.user_notes,
      session.user_name,
      session.user_id
    );
    
    console.log(`[${sessionId}] Calling generateContentWithOpenAI with userId: ${session.user_id}`);
    let scriptContent = await generateContentWithOpenAI(
      session.kind,
      session.mood,
      session.duration,
      session.user_notes,
      session.user_name,
      session.user_id
    );

    // Handle batched content
    if (typeof scriptContent === 'object' && scriptContent.isBatched) {
      console.log(`[${sessionId}] Using batched AI output with ${scriptContent.batches.length} batches...`);
      console.log(`[${sessionId}] First batch preview: ${scriptContent.content.substring(0, 200)}...`);
      // Store the first batch as the main content for display
      scriptContent = scriptContent.content;
    } else {
      // Use raw AI output directly
      console.log(`[${sessionId}] Using raw AI output...`);
      console.log(`[${sessionId}] Raw script content: ${scriptContent.substring(0, 200)}...`);
    }

    // Update session with script and session name
    const { error: updateError } = await supabase
      .from('sessions')
      .update({
        script: scriptContent,  // Use existing 'script' column instead of 'script_content'
        session_name: sessionName
      })
      .eq('id', sessionId);

    if (updateError) {
      console.error(`[${sessionId}] Failed to update session with script:`, updateError);
      return res.status(500).json({ error: 'Failed to save script' });
    }

    console.log(`[${sessionId}] Script generated successfully: ${scriptContent.length} chars`);
    console.log(`[${sessionId}] Final script content preview: ${scriptContent.substring(0, 200)}...`);
    
    res.json({
      session_id: sessionId,
      status: 'script_generated',
      script_content: scriptContent,
      session_name: sessionName
    });
    
  } catch (error) {
    console.error(`[${sessionId}] Script generation failed:`, error.message);
    res.status(500).json({ error: 'Script generation failed' });
  }
});

// No sanitization - using raw AI output directly

// POST /api/v1/session/:id/generate-audio - Generate TTS audio for session
router.post('/:id/generate-audio', async (req, res) => {
  const sessionId = req.params.id;
  
  try {
    console.log(`[${sessionId}] Generating TTS audio...`);
    
    // Get session data
    const { data: session, error: fetchError } = await supabase
      .from('sessions')
      .select('*')
      .eq('id', sessionId)
      .single();

    if (fetchError || !session) {
      console.error(`[${sessionId}] Session not found:`, fetchError);
      return res.status(404).json({ error: 'Session not found' });
    }

    if (!session.script) {
      console.error(`[${sessionId}] Script not generated yet`);
      return res.status(400).json({ error: 'Script must be generated first' });
    }

    if (session.audio_url) {
      console.log(`[${sessionId}] Audio already generated`);
      return res.json({
        session_id: sessionId,
        status: 'audio_generated',
        audio_url: session.audio_url,
        duration_sec: session.duration_sec
      });
    }

    // Generate TTS audio using Google Cloud TTS
    const { generateTTSAudio } = require('./tts-generator');
    
    // For batched content, we need to regenerate the full batched content for audio generation
    let audioContent = session.script;
    if (session.duration >= 5) { // Changed from > 10 to >= 5 to match batch processing trigger
      console.log(`[${sessionId}] Regenerating batched content for audio generation...`);
      const { generateContentWithOpenAI } = require('./openai-content-generator');
      const batchedContent = await generateContentWithOpenAI(
        session.kind,
        session.mood,
        session.duration,
        session.user_notes,
        session.user_name,
        session.user_id
      );
      
      if (typeof batchedContent === 'object' && batchedContent.isBatched) {
        audioContent = batchedContent;
        console.log(`[${sessionId}] Using ${batchedContent.batches.length} batches for audio generation`);
      }
    }
    
    const { audioBuffer, duration_sec } = await generateTTSAudio(
      audioContent,
      session.kind
    );

    // Upload audio to Supabase storage
    const audioFileName = `${sessionId}.mp3`;
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('sessions')
      .upload(audioFileName, audioBuffer, {
        contentType: 'audio/mpeg',
        upsert: true
      });

    if (uploadError) {
      console.error(`[${sessionId}] Audio upload failed:`, uploadError);
      return res.status(500).json({ error: 'Failed to upload audio' });
    }

    const audioUrl = `${process.env.SUPABASE_URL}/storage/v1/object/public/sessions/${audioFileName}`;

    // Update session with audio
    const { error: updateError } = await supabase
      .from('sessions')
      .update({
        audio_url: audioUrl,
        duration_sec: duration_sec
      })
      .eq('id', sessionId);

    if (updateError) {
      console.error(`[${sessionId}] Failed to update session with audio:`, updateError);
      return res.status(500).json({ error: 'Failed to save audio' });
    }

    console.log(`[${sessionId}] Audio generated successfully: ${audioBuffer.length} bytes, ~${duration_sec}s`);
    
    res.json({
      session_id: sessionId,
      status: 'audio_generated',
      audio_url: audioUrl,
      duration_sec: duration_sec
    });
    
  } catch (error) {
    console.error(`[${sessionId}] Audio generation failed:`, error.message);
    res.status(500).json({ error: 'Audio generation failed' });
  }
});

// Main session endpoint (legacy - creates session with audio)
router.post('/start', async (req, res) => {
  const requestId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  const startTime = Date.now();
  
  try {
    console.log(`[${requestId}] Request body:`, JSON.stringify(req.body));
    
    // Extract parameters with defaults
    const kind = req.body.kind || 'meditation';
    const mood = req.body.mood || 'calm';
    const duration = req.body.duration || 5;
    const user_notes = req.body.user_notes || '';
    const user_id = req.user?.id;
    
    if (!user_id) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    // Check idempotency
    const idempotencyKey = req.headers['x-idempotency-key'];
    if (idempotencyKey && idempotencyStore.has(idempotencyKey)) {
      const existing = idempotencyStore.get(idempotencyKey);
      console.log(`[${requestId}] Returning cached result for idempotency key: ${idempotencyKey}`);
      return res.json(existing);
    }

    console.log(`[${requestId}] Creating session: ${kind}, ${mood}, ${duration}m, user: ${user_id}`);

    // Generate session ID (numeric for database compatibility)
    const numericId = Date.now();
    const sessionId = `session_${numericId}_${Math.random().toString(36).substr(2, 9)}`;

    // Get user's name for personalization (optional)
    let user_name = null;
    try {
      const { data: profile } = await supabase
        .from('basic_profiles')
        .select('first_name')
        .eq('user_id', user_id)
        .single();
      
      if (profile?.first_name) {
        user_name = profile.first_name;
        console.log(`[${requestId}] Using personalized name: ${user_name}`);
      }
    } catch (error) {
      console.log(`[${requestId}] No user name found, using generic personalization`);
    }

    // Generate content with OpenAI using enhanced prompts
    const { generateContentWithOpenAI, generateSessionName } = require('./openai-content-generator');
    const userId = user_id;
    
    console.log(`[${requestId}] User ID: ${userId}`);
    
    // Generate session name first
    const sessionName = await generateSessionName(kind, mood, duration, user_notes, user_name, userId);
    console.log(`[${requestId}] Generated session name: ${sessionName}`);
    
    const content = await generateContentWithOpenAI(kind, mood, duration, user_notes, user_name, userId);
    console.log(`[${requestId}] Generated ${kind} content: ${content.length} characters`);

    // Generate TTS audio with timeout (5 minutes for long content)
    const { generateTTSAudio } = require('./tts-generator');
    const ttsPromise = generateTTSAudio(content, kind);
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('TTS timeout')), 600000) // 10 minutes
    );

    const { audioBuffer, duration_sec } = await Promise.race([ttsPromise, timeoutPromise]);

    // Upload to storage
    const audioUrl = await uploadAudioToStorage(audioBuffer, sessionId);
    console.log(`[${requestId}] Audio uploaded: ${audioUrl}`);

    // Store in database
    const sessionData = {
      id: numericId, // Use numeric ID for database
      user_id,
      kind,
      mood,
      duration: duration,
      user_notes: user_notes || null,
      duration_sec,
      audio_url: audioUrl,
      session_name: sessionName,
      created_at: new Date().toISOString()
    };

    await storeSession(sessionData);

    const result = {
      session_id: sessionId,
      audio_url: audioUrl,
      duration_sec
    };

    // Store for idempotency
    if (idempotencyKey) {
      idempotencyStore.set(idempotencyKey, result);
    }

    const latency = Date.now() - startTime;
    console.log(`[${requestId}] Session created successfully: ${latency}ms`);

    res.json(result);

  } catch (error) {
    const latency = Date.now() - startTime;
    console.error(`[${requestId}] Session creation failed:`, error.message, `(${latency}ms)`);
    console.error(`[${requestId}] Error stack:`, error.stack);

    if (error.message.includes('timeout')) {
      return res.status(504).json({
        code: 'tts_timeout',
        message: 'Audio generation timed out. Please try again.'
      });
    }

    if (error.message.includes('TTS generation failed')) {
      return res.status(503).json({
        code: 'tts_unavailable',
        message: 'Audio generation service unavailable. Please try again later.'
      });
    }

    if (error.message.includes('Storage upload failed') || error.message.includes('Database insert failed')) {
      return res.status(502).json({
        code: 'storage_error',
        message: 'Failed to save session. Please try again.'
      });
    }

    res.status(400).json({
      code: 'bad_request',
      message: error.message || 'Invalid request'
    });
  }
});

module.exports = router;
