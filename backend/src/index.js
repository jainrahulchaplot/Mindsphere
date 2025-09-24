require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const { attachUser } = require('./auth_middleware.js');
// TTS router removed - using Google Cloud TTS directly
const journalRouter = require('./routes_journal');
const streaksRouter = require('./routes_streaks');
const musicRouter = require('./routes_music');
const musicUploadRouter = require('./routes_music_upload');
const nudgesRouter = require('./routes_nudges');
const voiceRouter = require('./routes_voice');
const coachRouter = require('./routes_coach');
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

app.use(express.json({ limit: '1mb' }));
app.use(cors({ origin: ORIGIN }));

// Authentication middleware - attaches req.user.id from JWT or demo mode
app.use(attachUser);

// Static file serving for local audio files
app.use('/audio', express.static(path.join(__dirname, '..', 'public', 'audio')));

app.get('/health', (_req, res) => res.json({ status: 'ok', ts: new Date().toISOString() }));

app.get('/', (_req, res) => res.json({ name: 'MindSphere API', version: 'mvp-1', routes: ['/health','POST /api/v1/session/start','GET /api/v1/session/:id','POST /api/v1/session/:id/feedback','GET /api/v1/journal','POST /api/v1/journal/submit','GET /api/v1/streaks/:user_id','POST /api/v1/streaks/:user_id','GET /api/v1/music_tracks','POST /api/v1/nudges/preview','POST /api/v1/journal/stt','POST /api/v1/coach/chat','GET /api/v1/notes','POST /api/v1/notes','GET /api/v1/notes/:id','PUT /api/v1/notes/:id','DELETE /api/v1/notes/:id','POST /api/v1/notes/similarity','POST /api/v1/notes/:id/embedding','GET /api/v1/usage/daily','GET /api/v1/library','POST /api/v1/me/sync','GET /api/v1/profile/basic','PUT /api/v1/profile/basic'] }));

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
app.use(nudgesRouter);

// 7) Voice journaling endpoint
app.use(voiceRouter);

// 8) Coach chat endpoint
app.use(coachRouter);

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

app.listen(PORT, () => console.log('MindSphere backend running on:' + PORT));