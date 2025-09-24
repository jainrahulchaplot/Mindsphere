const { TextToSpeechClient } = require('@google-cloud/text-to-speech');

// Initialize Google Cloud TTS client (optional)
let ttsClient = null;
if (process.env.GOOGLE_APPLICATION_CREDENTIALS && process.env.GOOGLE_APPLICATION_CREDENTIALS !== './mindsphere-472512-653692846d5f.json') {
  try {
    ttsClient = new TextToSpeechClient({
      keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS
    });
    console.log('✅ Google Cloud TTS initialized');
  } catch (error) {
    console.log('⚠️ Google Cloud TTS not available:', error.message);
  }
} else {
  console.log('⚠️ Google Cloud TTS credentials not provided or using placeholder');
}

// Generate TTS audio for a single batch
async function generateTTSBatch(text, kind, batchNum = 1) {
  try {
    // Check if TTS client is available
    if (!ttsClient) {
      console.log('⚠️ Google Cloud TTS not available, skipping audio generation');
      return { success: false, error: 'TTS not configured' };
    }
    
    console.log(`🎤 Generating batch ${batchNum} ${kind} audio with Google Cloud TTS Studio-O...`);
    console.log(`📝 Text length: ${text.length} characters`);
    
    // Studio-O voice configuration
    const voiceConfig = {
      languageCode: 'en-US',
      name: 'en-US-Studio-O'
    };

    // Audio configuration - let SSML handle all pacing
    const audioConfig = {
      audioEncoding: 'MP3',
      volumeGainDb: 0.0,
      speakingRate: 1.0, // Let SSML handle pacing
      effectsProfileId: kind === 'sleep_story' ? ['telephony-class-application'] : ['headphone-class-device']
    };

    // Check if the text is SSML
    const isSSML = text.startsWith('<speak>');
    console.log(`   Batch ${batchNum} - Input type: ${isSSML ? 'SSML' : 'Plain text'}`);
    console.log(`📝 Raw content: ${text.substring(0, 200)}...`);

    const request = {
      input: isSSML ? { ssml: text } : { text: text },
      voice: voiceConfig,
      audioConfig: audioConfig
    };

    console.log(`🎵 Sending batch ${batchNum} request to Google Cloud TTS...`);
    
    // Generate audio - no fallback, throw error if it fails
    const [response] = await ttsClient.synthesizeSpeech(request);
    
    const audioBuffer = Buffer.from(response.audioContent);
    
    // Estimate duration based on text length
    const wordsPerMinute = kind === 'sleep_story' ? 125 : 100;
    const estimatedDuration = Math.max(30, Math.floor((text.split(' ').length / wordsPerMinute) * 60));
    
    console.log(`✅ Generated batch ${batchNum} audio: ${audioBuffer.length} bytes, ~${estimatedDuration}s`);
    console.log(`🎵 Voice: en-US-Studio-O`);
    
    return { 
      audioBuffer, 
      duration_sec: estimatedDuration 
    };
    
  } catch (error) {
    console.error(`❌ Google Cloud TTS generation failed for batch ${batchNum}:`, error.message);
    console.error('❌ Error details:', error);
    throw new Error(`TTS generation failed for batch ${batchNum}: ${error.message}`);
  }
}

// Stitch multiple audio buffers together
function stitchAudioBuffers(audioBuffers) {
  console.log(`🔗 Stitching ${audioBuffers.length} audio buffers together...`);
  
  // For MP3 files, we can simply concatenate the buffers
  // This is a simple approach - for production, you might want to use a proper audio library
  const totalLength = audioBuffers.reduce((sum, buffer) => sum + buffer.length, 0);
  const stitchedBuffer = Buffer.concat(audioBuffers, totalLength);
  
  console.log(`✅ Stitched audio: ${stitchedBuffer.length} bytes total`);
  return stitchedBuffer;
}

// Generate TTS audio with batch processing support
async function generateTTSAudio(text, kind = 'meditation') {
  // Check if this is batched content
  if (typeof text === 'object' && text.isBatched && text.batches) {
    console.log(`🎵 Processing ${text.batches.length} batches for ${kind}...`);
    
    const audioBuffers = [];
    let totalDuration = 0;
    
    // Generate audio for each batch
    for (let i = 0; i < text.batches.length; i++) {
      console.log(`🎵 Generating audio for batch ${i + 1}/${text.batches.length}...`);
      
      const batchResult = await generateTTSBatch(text.batches[i], kind, i + 1);
      audioBuffers.push(batchResult.audioBuffer);
      totalDuration += batchResult.duration_sec;
      
      // Add a small delay between batches to avoid rate limiting
      if (i < text.batches.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
    
    // Stitch all audio buffers together
    const finalAudioBuffer = stitchAudioBuffers(audioBuffers);
    
    console.log(`✅ Generated complete ${kind} audio: ${finalAudioBuffer.length} bytes, ~${totalDuration}s`);
    return { audioBuffer: finalAudioBuffer, duration_sec: totalDuration };
  }
  
  // Regular single-batch processing
  return await generateTTSBatch(text, kind);
}

module.exports = {
  generateTTSAudio,
  generateTTSBatch,
  stitchAudioBuffers
};