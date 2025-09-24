require('dotenv').config();
const OpenAI = require('openai');

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Validate audio file
function validateAudioFile(file) {
  const allowedMimeTypes = [
    'audio/webm',
    'audio/ogg', 
    'audio/mp4',
    'audio/mpeg',
    'audio/wav'
  ];
  
  const maxSize = 10 * 1024 * 1024; // 10MB
  
  if (!allowedMimeTypes.includes(file.mimetype)) {
    return {
      valid: false,
      error: `Unsupported file type: ${file.mimetype}. Allowed: ${allowedMimeTypes.join(', ')}`
    };
  }
  
  if (file.size > maxSize) {
    return {
      valid: false,
      error: `File too large: ${file.size} bytes. Maximum: ${maxSize} bytes`
    };
  }
  
  return { valid: true };
}

// Transcribe audio using Whisper
async function transcribeAudio(audioBuffer, retryCount = 0) {
  try {
    if (!process.env.OPENAI_API_KEY) {
      throw new Error('OPENAI_API_KEY not configured');
    }

    // Create a temporary file-like object for Whisper
    const audioFile = new File([audioBuffer], 'audio.webm', { type: 'audio/webm' });
    
    const transcription = await client.audio.transcriptions.create({
      file: audioFile,
      model: 'whisper-1',
      language: 'en',
      response_format: 'text'
    });

    return {
      success: true,
      text: transcription,
      duration_sec: Math.max(1, audioBuffer.length / 16000) // Rough estimate
    };
  } catch (error) {
    console.error(`Whisper transcription failed (attempt ${retryCount + 1}):`, error.message);
    
    if (retryCount < 2) {
      // Exponential backoff retry
      const delay = Math.pow(2, retryCount) * 1000;
      await new Promise(resolve => setTimeout(resolve, delay));
      return transcribeAudio(audioBuffer, retryCount + 1);
    }
    
    return {
      success: false,
      error: error.message
    };
  }
}

module.exports = {
  validateAudioFile,
  transcribeAudio
};
