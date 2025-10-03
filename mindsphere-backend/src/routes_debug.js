const express = require('express');
const { createClient } = require('@supabase/supabase-js');

require('dotenv').config();

const router = express.Router();

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = (SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY)
  ? createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)
  : null;

// GET /api/v1/debug/sessions - List all sessions
router.get('/sessions', async (req, res) => {
  try {
    if (!supabase) {
      return res.status(500).json({ error: 'Supabase not configured' });
    }

    const { data, error } = await supabase
      .from('sessions')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(10);

    if (error) {
      console.error('Error fetching sessions:', error);
      return res.status(500).json({ error: 'Database error', details: error.message });
    }

    res.json({
      count: data.length,
      sessions: data
    });

  } catch (e) {
    console.error('Error getting sessions:', e);
    res.status(500).json({ error: 'Internal server error', details: e.message });
  }
});

module.exports = router;
