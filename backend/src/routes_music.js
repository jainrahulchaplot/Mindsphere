require('dotenv').config();
const { Router } = require('express');
const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = (SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY)
  ? createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)
  : null;

const router = Router();

// GET /music_tracks
router.get('/music_tracks', async (req, res) => {
  try {
    if (!supabase) {
      return res.json({ tracks: [], note: 'Supabase not configured' });
    }

    const { data, error } = await supabase
      .from('music_tracks')
      .select('id, title, url, sort_order, created_at')
      .order('sort_order', { ascending: true });

    if (error) {
      return res.status(500).json({ error: 'db_error', detail: error.message });
    }

    return res.json({ tracks: data || [] });
  } catch (e) {
    console.error('music_tracks error', e);
    return res.status(500).json({ error: 'music_failed', detail: e?.message || String(e) });
  }
});

module.exports = router;
