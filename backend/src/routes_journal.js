require('dotenv').config();
const { Router } = require('express');
const { createClient } = require('@supabase/supabase-js');
const { generateSummary } = require('./summarizer');

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = (SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY)
  ? createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)
  : null;

const router = Router();

// GET /api/v1/journal?limit=50&offset=0
router.get('/api/v1/journal', async (req, res) => {
  try {
    const user_id = req.user?.id;
    const { limit = 50, offset = 0 } = req.query;
    if (!user_id) return res.status(401).json({ error: 'User not authenticated' });
    if (!supabase) return res.json({ entries: [], note: 'Supabase not configured' });

    const { data, error } = await supabase
      .from('journals')
      .select('id, created_at, summary, emotions')
      .eq('user_id', user_id)
      .order('created_at', { ascending: false })
      .range(Number(offset), Number(offset) + Number(limit) - 1);

    if (error) return res.status(500).json({ error: 'db_error', detail: error.message });

    return res.json({ entries: data || [] });
  } catch (e) {
    console.error('journal/list error', e);
    return res.status(500).json({ error: 'journal_failed', detail: e?.message || String(e) });
  }
});

// POST /api/v1/journal/submit -> { text, session_id? }
router.post('/api/v1/journal/submit', async (req, res) => {
  try {
    const user_id = req.user?.id;
    const { text, session_id = null } = req.body || {};
    if (!text || typeof text !== 'string')
      return res.status(400).json({ error: 'invalid_input', message: 'body.text required' });
    if (!process.env.OPENAI_API_KEY)
      return res.status(400).json({ error: 'openai_key_missing', message: 'OPENAI_API_KEY missing in backend/.env' });

    const { summary = '', emotions = [] } = await generateSummary(text);

    if (!supabase) return res.json({ summary, emotions, stored: false, note: 'Supabase not configured' });

    const { error: dbErr } = await supabase
      .from('journals')
      .insert([{ user_id, session_id, text, summary, created_at: new Date().toISOString() }]);

    if (dbErr) return res.status(500).json({ error: 'db_error', detail: dbErr.message });

    return res.json({ summary, emotions, stored: true });
  } catch (e) {
    console.error('journal/submit error', e);
    return res.status(500).json({ error: 'journal_failed', detail: e?.message || String(e) });
  }
});

module.exports = router;