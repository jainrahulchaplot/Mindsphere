const express = require('express');
const multer = require('multer');
const OpenAI = require('openai');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const router = express.Router();

// Rate limiting store (in production, use Redis)
const rateLimitStore = new Map();

// Rate limiting middleware
const rateLimit = (req, res, next) => {
  const ip = req.ip || req.connection.remoteAddress;
  const userId = req.body.user_id || 'anonymous';
  const key = `${ip}:${userId}`;
  
  const now = Date.now();
  const windowMs = 60 * 1000; // 1 minute
  const maxRequests = 3;
  
  if (!rateLimitStore.has(key)) {
    rateLimitStore.set(key, []);
  }
  
  const requests = rateLimitStore.get(key);
  const validRequests = requests.filter(time => now - time < windowMs);
  
  if (validRequests.length >= maxRequests) {
    const retryAfter = Math.ceil((validRequests[0] + windowMs - now) / 1000);
    return res.status(429).json({
      code: 'rate_limited',
      message: 'Too many requests. Please try again later.',
      retry_after: retryAfter
    }).set('Retry-After', retryAfter);
  }
  
  validRequests.push(now);
  rateLimitStore.set(key, validRequests);
  next();
};

// Configure multer for audio uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedMimes = [
      'audio/webm',
      'audio/ogg', 
      'audio/mp4',
      'audio/mpeg',
      'audio/wav'
    ];
    
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid audio format'), false);
    }
  }
});

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// STT endpoint
router.post('/stt', rateLimit, upload.single('audio'), async (req, res) => {
  const requestId = `stt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  const startTime = Date.now();
  
  try {
    // Validate request
    if (!req.file) {
      return res.status(400).json({
        code: 'bad_audio',
        message: 'No audio file provided'
      });
    }

    const { user_id, session_id } = req.body;
    const fileSize = req.file.size;
    const mimeType = req.file.mimetype;
    
    console.log(`[${requestId}] STT request: ${mimeType}, ${fileSize} bytes, user: ${user_id || 'anonymous'}`);
    
    // Validate file size
    if (fileSize > 10 * 1024 * 1024) {
      return res.status(400).json({
        code: 'bad_audio',
        message: 'Audio file too large. Maximum size is 10MB.'
      });
    }

    // Call OpenAI Whisper
    const transcription = await openai.audio.transcriptions.create({
      file: new File([req.file.buffer], 'audio.webm', { type: 'audio/webm' }),
      model: 'whisper-1',
      response_format: 'text'
    });

    const duration = Math.ceil(fileSize / 16000); // Rough estimate: 16kbps
    const latency = Date.now() - startTime;
    
    console.log(`[${requestId}] STT success: ${latency}ms, ${transcription.length} chars`);
    
    res.json({
      text: transcription,
      duration_sec: duration
    });

  } catch (error) {
    const latency = Date.now() - startTime;
    console.error(`[${requestId}] STT error:`, error.message, `(${latency}ms)`);
    
    if (error.code === 'file_too_large') {
      return res.status(400).json({
        code: 'bad_audio',
        message: 'Audio file too large'
      });
    }
    
    res.status(500).json({
      code: 'transcription_failed',
      message: 'Transcription failed. Please try again.'
    });
  }
});

module.exports = router;
