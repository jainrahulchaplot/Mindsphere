require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const logger = require('./logger');
const { attachUser } = require('./auth_middleware.js');
// TTS router removed - using Google Cloud TTS directly
const journalRouter = require('./routes_journal');
const streaksRouter = require('./routes_streaks');
const musicRouter = require('./routes_music');
const musicUploadRouter = require('./routes_music_upload');
// const nudgesRouter = require('./routes_nudges'); // ARCHIVED - unused feature
const voiceRouter = require('./routes_voice');
const voiceTokenRouter = require('./routes_voice_token');
// const coachRouter = require('./routes_coach'); // ARCHIVED - unused feature
const sttRouter = require('./routes_stt');
const sessionRouter = require('./routes_session');
const sessionFeedbackRouter = require('./routes_session_feedback');
const notesRouter = require('./routes_notes');
const migrationRouter = require('./routes_migration');
const debugRouter = require('./routes_debug');
const usageRouter = require('./routes_usage');
const libraryRouter = require('./routes_library');
const meRouter = require('./routes_me');
const profileBasicRouter = require('./routes_profile_basic');
const quotesRouter = require('./routes_quotes');
const memoriesRouter = require('./routes_memories');
const snippetsRouter = require('./routes_snippets');
// Gemini TTS removed - using Google Cloud TTS directly
const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = (SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY)
  ? createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)
  : null;

const app = express();
const PORT = process.env.PORT || 8000;
const ORIGIN = process.env.FRONTEND_ORIGIN || '*';

// Enhanced CORS configuration for production
let CORS_ORIGINS = ['*']; // Default fallback

if (process.env.CORS_ALLOWED_ORIGINS) {
  CORS_ORIGINS = process.env.CORS_ALLOWED_ORIGINS.split(',').map(origin => origin.trim());
} else if (process.env.FRONTEND_ORIGIN && process.env.FRONTEND_ORIGIN !== '*') {
  CORS_ORIGINS = [process.env.FRONTEND_ORIGIN];
} else {
  // Fallback for common deployment platforms
  CORS_ORIGINS = [
    'https://mindsphere-theta.vercel.app',
    'https://mindsphere-production-fc81.up.railway.app',
    'http://localhost:5173',
    'http://localhost:5174'
  ];
}

logger.info('🌍 CORS Origins:', CORS_ORIGINS);
logger.info('🌍 Environment:', process.env.NODE_ENV || 'development');

app.use(express.json({ limit: '1mb' }));
app.use(cors({ 
  origin: CORS_ORIGINS,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'X-Idempotency-Key']
}));

// Add request logging middleware
app.use(logger.logRequest);

// Health check endpoint (no auth required)
app.get('/health', (_req, res) => res.json({ status: 'ok', ts: new Date().toISOString() }));

// CORS debugging endpoint (no auth required)
app.get('/cors-info', (req, res) => {
  res.json({
    cors_origins: CORS_ORIGINS,
    environment: process.env.NODE_ENV || 'development',
    frontend_origin: process.env.FRONTEND_ORIGIN,
    cors_allowed_origins: process.env.CORS_ALLOWED_ORIGINS,
    request_origin: req.headers.origin,
    timestamp: new Date().toISOString()
  });
});

// Voice token service (no authentication required)
app.use('/api/voice', voiceTokenRouter);

// Authentication middleware - attaches req.user.id from JWT or demo mode
app.use(attachUser);

// Static file serving for local audio files
app.use('/audio', express.static(path.join(__dirname, '..', 'public', 'audio')));

app.get('/', (_req, res) => res.json({ name: 'MindSphere API', version: 'mvp-1', routes: ['/health','POST /api/v1/session/start','GET /api/v1/session/:id','POST /api/v1/session/:id/feedback','GET /api/v1/journal','POST /api/v1/journal/submit','GET /api/v1/streaks/:user_id','POST /api/v1/streaks/:user_id','GET /api/v1/music_tracks','POST /api/v1/nudges/preview','POST /api/v1/journal/stt','POST /api/v1/coach/chat','GET /api/v1/notes','POST /api/v1/notes','GET /api/v1/notes/:id','PUT /api/v1/notes/:id','DELETE /api/v1/notes/:id','POST /api/v1/notes/similarity','POST /api/v1/notes/:id/embedding','GET /api/v1/usage/daily','GET /api/v1/library','POST /api/v1/me/sync','GET /api/v1/profile/basic','PUT /api/v1/profile/basic','POST /api/voice/token','GET /api/voice/health','GET /api/voice/test'] }));

// Mount session router
app.use('/api/v1/session', sessionRouter);

// 2) TTS upload → audio URLs (removed - using Google Cloud TTS directly)

// 3) Journaling endpoint
app.use(journalRouter);

// 4) Streaks endpoint
app.use(streaksRouter);

// 5) Music tracks endpoint
app.use('/api/v1', musicRouter);

// 5.1) Music upload endpoint
app.use('/api/v1/music', musicUploadRouter);

// 6) Nudges endpoint
// app.use(nudgesRouter); // ARCHIVED - unused feature

// 7) Voice journaling endpoint
app.use(voiceRouter);

// 8) Coach chat endpoint
// app.use(coachRouter); // ARCHIVED - unused feature

// 9) STT endpoint
app.use(sttRouter);

// 10) Session endpoint
app.use('/api/v1/session', sessionRouter);

// 11) Session feedback endpoint
app.use('/api/v1/session', sessionFeedbackRouter);

// 12) Notes endpoint
app.use('/api/v1/notes', notesRouter);

// 13) Migration endpoint
app.use('/api/v1/migrate', migrationRouter);

// 14) Debug endpoint
app.use('/api/v1/debug', debugRouter);

// 15) Usage analytics endpoint
app.use('/api/v1/usage', usageRouter);

// 16) Library endpoint
app.use('/api/v1/library', libraryRouter);

// 17) Me endpoint (user sync)
app.use('/api/v1/me', meRouter);

// 18) Profile basic endpoint
app.use('/api/v1/profile', profileBasicRouter);

// 19) Quotes endpoint
app.use('/api/v1/quotes', quotesRouter);

// 20) Memories endpoint
app.use('/api/v1/memories', memoriesRouter);

// 21) Snippets endpoint
app.use('/api/v1/snippets', snippetsRouter);

// Enhanced startup with error handling
app.listen(PORT, '0.0.0.0', () => {
  logger.info('🚀 MindSphere backend running on port:', PORT);
  logger.info('🌍 Environment:', process.env.NODE_ENV || 'development');
  logger.info('🔗 Health check: http://localhost:' + PORT + '/health');
  logger.info('📊 Supabase configured:', !!supabase);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('🛑 SIGTERM received, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  logger.info('🛑 SIGINT received, shutting down gracefully');
  process.exit(0);
});