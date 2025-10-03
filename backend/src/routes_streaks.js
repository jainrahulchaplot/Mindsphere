require('dotenv').config();
const { Router } = require('express');
const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = (SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY)
  ? createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)
  : null;

const router = Router();

// GET /api/v1/streaks
router.get('/api/v1/streaks', async (req,res) => {
  const user_id = req.user?.id;
  
  if (!user_id) {
    return res.status(401).json({ error: 'User not authenticated' });
  }
  if (!supabase) return res.json({ current_streak: 0, best_streak: 0, note: 'Supabase not configured' });
  
  try {
    // Get sessions for both meditation and sleep_story
    const { data: sessions, error: sessionsError } = await supabase
      .from('sessions')
      .select('created_at, kind')
      .eq('user_id', user_id)
      .order('created_at', { ascending: true });

    if (sessionsError) {
      return res.status(500).json({ error: 'db_error', detail: sessionsError.message });
    }

    if (!sessions || sessions.length === 0) {
      return res.json({ current_streak: 0, best_streak: 0 });
    }

    // Calculate streaks for both types
    const meditationStreaks = calculateStreaks(sessions.filter(s => s.kind === 'meditation'));
    const sleepStoryStreaks = calculateStreaks(sessions.filter(s => s.kind === 'sleep_story'));

    // Get the best streak from both types
    const bestCurrentStreak = Math.max(meditationStreaks.current, sleepStoryStreaks.current);
    const bestOverallStreak = Math.max(meditationStreaks.best, sleepStoryStreaks.best);

    return res.json({ 
      current_streak: bestCurrentStreak, 
      best_streak: bestOverallStreak,
      meditation_streak: meditationStreaks,
      sleep_story_streak: sleepStoryStreaks
    });

  } catch (error) {
    console.error('Streak calculation error:', error);
    return res.status(500).json({ error: 'calculation_error', detail: error.message });
  }
});

// Helper function to calculate streaks from sessions
function calculateStreaks(sessions) {
  if (!sessions || sessions.length === 0) {
    return { current: 0, best: 0 };
  }

  // Group sessions by date (using local timezone)
  const sessionsByDate = {};
  sessions.forEach(session => {
    // Convert to local date instead of UTC
    const sessionDate = new Date(session.created_at);
    const localDate = new Date(sessionDate.getTime() - (sessionDate.getTimezoneOffset() * 60000));
    const date = localDate.toISOString().split('T')[0];
    if (!sessionsByDate[date]) {
      sessionsByDate[date] = [];
    }
    sessionsByDate[date].push(session);
  });

  const dates = Object.keys(sessionsByDate).sort();
  let currentStreak = 0;
  let bestStreak = 0;
  let tempStreak = 0;
  let lastDate = null;

  for (const date of dates) {
    const currentDate = new Date(date);
    
    if (lastDate) {
      const daysDiff = Math.floor((currentDate - lastDate) / (1000 * 60 * 60 * 24));
      
      if (daysDiff === 1) {
        // Consecutive day
        tempStreak++;
      } else if (daysDiff === 0) {
        // Same day, don't change streak
        continue;
      } else {
        // Gap in days, reset streak
        bestStreak = Math.max(bestStreak, tempStreak);
        tempStreak = 1;
      }
    } else {
      // First day
      tempStreak = 1;
    }
    
    lastDate = currentDate;
  }

  // Update final values
  bestStreak = Math.max(bestStreak, tempStreak);
  currentStreak = tempStreak;

  // Check if current streak is still active (last session was today or yesterday)
  // Use local timezone for today/yesterday calculation
  const now = new Date();
  const localNow = new Date(now.getTime() - (now.getTimezoneOffset() * 60000));
  const today = localNow.toISOString().split('T')[0];
  const yesterday = new Date(localNow.getTime() - 24 * 60 * 60 * 1000).toISOString().split('T')[0];
  const lastSessionDate = dates[dates.length - 1];
  
  if (lastSessionDate !== today && lastSessionDate !== yesterday) {
    currentStreak = 0;
  }

  return { current: currentStreak, best: bestStreak };
}

// POST /api/v1/streaks/:user_id -> updates streak if new day
router.post('/api/v1/streaks', async (req,res) => {
  const user_id = req.user?.id;
  
  if (!user_id) {
    return res.status(401).json({ error: 'User not authenticated' });
  }
  if (!supabase) return res.json({ updated: false, note: 'Supabase not configured' });
  
  // Use local timezone for today calculation
  const now = new Date();
  const localNow = new Date(now.getTime() - (now.getTimezoneOffset() * 60000));
  const today = localNow.toISOString().slice(0,10);

  let { data: row, error } = await supabase.from('streaks').select('*').eq('user_id', user_id).single();
  if (error && error.code !== 'PGRST116') return res.status(500).json({ error: 'db_error', detail: error.message });

  if (!row) {
    row = { user_id, current_streak: 1, best_streak: 1, last_entry_date: today };
    const { error: insErr } = await supabase.from('streaks').insert([row]);
    if (insErr) return res.status(500).json({ error: 'db_insert_error', detail: insErr.message });
    return res.json({ current_streak: 1, best_streak: 1 });
  }

  let { current_streak, best_streak, last_entry_date } = row;
  if (last_entry_date === today) return res.json({ current_streak, best_streak });

  const yesterday = new Date(localNow.getTime() - 24 * 60 * 60 * 1000).toISOString().slice(0,10);
  if (last_entry_date === yesterday) {
    current_streak += 1;
  } else {
    current_streak = 1;
  }
  best_streak = Math.max(best_streak, current_streak);

  const { error: updErr } = await supabase
    .from('streaks')
    .update({ current_streak, best_streak, last_entry_date: today })
    .eq('user_id', user_id);
  if (updErr) return res.status(500).json({ error: 'db_update_error', detail: updErr.message });

  return res.json({ current_streak, best_streak });
});


module.exports = router;
