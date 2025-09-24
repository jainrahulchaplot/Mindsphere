const express = require('express');
const { createClient } = require('@supabase/supabase-js');

require('dotenv').config();

const router = express.Router();

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = (SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY)
  ? createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)
  : null;

// Middleware to check Supabase connection
router.use((req, res, next) => {
  if (!supabase) {
    return res.status(500).json({ error: 'Supabase not configured' });
  }
  next();
});

// GET /api/v1/library - Get user's sessions library
router.get('/', async (req, res) => {
  try {
    const user_id = req.user?.id || req.query.user_id; // token-first; demo fallback
    const { kind, from, to, page = 1, limit = 20, q } = req.query;
    
    if (!user_id) {
      return res.status(400).json({ error: 'user_id is required' });
    }

    let query = supabase
      .from('sessions')
      .select('id, created_at, kind, mood, session_name, duration_sec, audio_url, user_notes, completed_at, post_rating')
      .eq('user_id', user_id)
      .order('created_at', { ascending: false });

    // Apply filters
    if (kind && kind !== 'all') {
      query = query.eq('kind', kind);
    }

    if (from) {
      query = query.gte('created_at', from);
    }

    if (to) {
      query = query.lte('created_at', to);
    }

    // Apply pagination
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const offset = (pageNum - 1) * limitNum;
    
    query = query.range(offset, offset + limitNum - 1);

    const { data: sessions, error } = await query;

    if (error) {
      console.error('Error fetching sessions:', error);
      return res.status(500).json({ error: 'Database error', details: error.message });
    }

    // Apply search filter if provided
    let filteredSessions = sessions || [];
    if (q) {
      const searchTerm = q.toLowerCase();
      filteredSessions = sessions.filter(session => 
        (session.mood && session.mood.toLowerCase().includes(searchTerm)) ||
        (session.session_name && session.session_name.toLowerCase().includes(searchTerm))
      );
    }

    // Get total count for stats (without pagination)
    let totalCountQuery = supabase
      .from('sessions')
      .select('id', { count: 'exact' })
      .eq('user_id', user_id);

    // Apply same filters for total count
    if (kind && kind !== 'all') {
      totalCountQuery = totalCountQuery.eq('kind', kind);
    }
    if (from) {
      totalCountQuery = totalCountQuery.gte('created_at', from);
    }
    if (to) {
      totalCountQuery = totalCountQuery.lte('created_at', to);
    }

    const { count: totalCount, error: countError } = await totalCountQuery;

    if (countError) {
      console.error('Error fetching total count:', countError);
      // Continue without total count if there's an error
    }

    // Get total time and completion stats for all sessions (without pagination)
    let statsQuery = supabase
      .from('sessions')
      .select('duration_sec, post_rating')
      .eq('user_id', user_id);

    // Apply same filters for stats
    if (kind && kind !== 'all') {
      statsQuery = statsQuery.eq('kind', kind);
    }
    if (from) {
      statsQuery = statsQuery.gte('created_at', from);
    }
    if (to) {
      statsQuery = statsQuery.lte('created_at', to);
    }

    const { data: allSessionsForStats, error: statsError } = await statsQuery;

    if (statsError) {
      console.error('Error fetching stats:', statsError);
    }

    // Calculate stats from all sessions (not just current page)
    let totalTime = 0;
    let completedSessions = 0;
    if (allSessionsForStats) {
      totalTime = allSessionsForStats.reduce((sum, session) => sum + (session.duration_sec || 0), 0);
      completedSessions = allSessionsForStats.filter(session => session.post_rating).length;
    }

    const totalSessions = totalCount || 0;
    const completionRate = totalSessions > 0 ? Math.round((completedSessions / totalSessions) * 100) : 0;

    res.json({
      sessions: filteredSessions,
      stats: {
        totalSessions,
        totalTime,
        completionRate
      }
    });

  } catch (e) {
    console.error('Error in library:', e);
    res.status(500).json({ error: 'Internal server error', details: e.message });
  }
});

module.exports = router;
