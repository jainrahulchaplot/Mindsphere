require('dotenv').config();
const { Router } = require('express');
const multer = require('multer');
const OpenAI = require('openai');
const fs = require('fs');
const path = require('path');

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Configure multer for audio uploads
const upload = multer({
  dest: 'uploads/',
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedMimes = ['audio/webm', 'audio/ogg', 'audio/m4a', 'audio/mp3', 'audio/mpeg', 'audio/wav', 'audio/mp4', 'application/octet-stream'];
    console.log('Received file with MIME type:', file.mimetype);
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      console.error('Invalid MIME type:', file.mimetype, 'Allowed:', allowedMimes);
      cb(new Error(`Invalid file type: ${file.mimetype}. Only webm, ogg, m4a, mp3, wav, mp4 allowed.`), false);
    }
  }
});

const router = Router();

// POST /api/v1/journal/stt
router.post('/api/v1/journal/stt', upload.single('audio'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'no_audio_file', message: 'Audio file required' });
    }

    if (!process.env.OPENAI_API_KEY) {
      return res.status(400).json({ error: 'openai_key_missing', message: 'OPENAI_API_KEY missing' });
    }

    // Transcribe audio using Whisper
    console.log('Calling Whisper API with file:', req.file.path, 'MIME:', req.file.mimetype, 'Size:', req.file.size);
    
    // Ensure the file has the correct extension for Whisper
    const fileExtension = req.file.mimetype === 'audio/webm' ? '.webm' : 
                         req.file.mimetype === 'audio/ogg' ? '.ogg' :
                         req.file.mimetype === 'audio/mp4' ? '.mp4' : '.webm';
    
    const tempPath = req.file.path + fileExtension;
    fs.renameSync(req.file.path, tempPath);
    
    const transcription = await client.audio.transcriptions.create({
      file: fs.createReadStream(tempPath),
      model: 'whisper-1',
      language: 'en'
    });
    
    // Clean up the renamed file
    fs.unlinkSync(tempPath);

    const text = transcription.text;
    const duration_sec = req.body.duration_sec ? parseFloat(req.body.duration_sec) : 0;

    return res.json({ 
      text, 
      duration_sec,
      user_id: req.user?.id || null,
      session_id: req.body.session_id || null
    });
  } catch (error) {
    // Clean up files on error
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    
    // Clean up renamed file if it exists
    const fileExtension = req.file?.mimetype === 'audio/webm' ? '.webm' : 
                         req.file?.mimetype === 'audio/ogg' ? '.ogg' :
                         req.file?.mimetype === 'audio/mp4' ? '.mp4' : '.webm';
    const tempPath = req.file?.path + fileExtension;
    if (fs.existsSync(tempPath)) {
      fs.unlinkSync(tempPath);
    }
    
    console.error('STT error:', error);
    return res.status(500).json({ 
      error: 'transcription_failed', 
      detail: error.message || 'Failed to transcribe audio' 
    });
  }
});

module.exports = router;
