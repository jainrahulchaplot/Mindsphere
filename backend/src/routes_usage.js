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

// GET /api/v1/usage/daily - Get daily usage data
router.get('/daily', async (req, res) => {
  try {
    const user_id = req.user?.id || req.query.user_id; // token-first; demo fallback
    const { from, to, kind } = req.query;
    
    console.log('🔍 Usage route: user_id =', user_id, 'from =', from, 'to =', to, 'kind =', kind);
    
    if (!user_id) {
      return res.status(400).json({ error: 'user_id is required' });
    }
    
    if (!from || !to) {
      return res.status(400).json({ error: 'from and to dates are required' });
    }

    // Get all sessions for the user in the date range
    // Convert dates to include time range for proper filtering
    const fromDateTime = `${from}T00:00:00.000Z`;
    const toDateTime = `${to}T23:59:59.999Z`;
    
    // Build query with optional kind filter
    let query = supabase
      .from('sessions')
      .select('created_at, duration_sec, kind')
      .eq('user_id', user_id)
      .gte('created_at', fromDateTime)
      .lte('created_at', toDateTime)
      .order('created_at', { ascending: true });
    
    // Add kind filter if specified
    if (kind && (kind === 'meditation' || kind === 'sleep_story')) {
      query = query.eq('kind', kind);
    }
    
    const { data: sessions, error } = await query;

    if (error) {
      console.error('Error fetching sessions:', error);
      return res.status(500).json({ error: 'Database error', details: error.message });
    }

    console.log('🔍 Usage route: Found', sessions?.length || 0, 'sessions for user_id:', user_id);

    // Find first use date
    const { data: firstSession } = await supabase
      .from('sessions')
      .select('created_at')
      .eq('user_id', user_id)
      .order('created_at', { ascending: true })
      .limit(1)
      .single();

    const first_use_date = firstSession ? firstSession.created_at.split('T')[0] : null;

    // Group sessions by date
    const dailyData = new Map();
    
    // Initialize all dates in range with 0 sessions
    const startDate = new Date(from);
    const endDate = new Date(to);
    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
      const dateStr = d.toISOString().split('T')[0];
      dailyData.set(dateStr, { sessions: 0, minutes: 0 });
    }

    // Add actual session data
    sessions.forEach(session => {
      // Convert UTC timestamp to local date for consistent timezone handling
      const sessionDate = new Date(session.created_at);
      const dateStr = sessionDate.getFullYear() + '-' + 
        String(sessionDate.getMonth() + 1).padStart(2, '0') + '-' + 
        String(sessionDate.getDate()).padStart(2, '0');
      
      const existing = dailyData.get(dateStr) || { sessions: 0, minutes: 0 };
      dailyData.set(dateStr, {
        sessions: existing.sessions + 1,
        minutes: existing.minutes + Math.round(session.duration_sec / 60)
      });
    });

    // Convert to array
    const days = Array.from(dailyData.entries()).map(([date, data]) => ({
      date,
      sessions: data.sessions,
      minutes: data.minutes
    }));

    // Calculate streaks
    const streaks = calculateStreaks(days, first_use_date);

    // Calculate analytics
    const analytics = calculateAnalytics(days, first_use_date, kind);

    res.json({
      first_use_date,
      days,
      streaks,
      analytics
    });

  } catch (e) {
    console.error('Error in daily usage:', e);
    res.status(500).json({ error: 'Internal server error', details: e.message });
  }
});

// Helper function to calculate streaks
function calculateStreaks(days, first_use_date) {
  if (!first_use_date) {
    return { current: 0, best: 0 };
  }

  // Sort days by date
  const sortedDays = [...days].sort((a, b) => new Date(a.date) - new Date(b.date));
  
  let currentStreak = 0;
  let bestStreak = 0;
  let tempStreak = 0;
  
  // Use actual current date
  const now = new Date();
  const today = now.getFullYear() + '-' + String(now.getMonth() + 1).padStart(2, '0') + '-' + String(now.getDate()).padStart(2, '0');
  console.log('Backend today calculation:', { 
    today, 
    now: now.toString(),
    localDate: now.getDate(),
    localMonth: now.getMonth() + 1,
    localYear: now.getFullYear(),
    utcDate: now.getUTCDate(),
    utcMonth: now.getUTCMonth() + 1,
    utcYear: now.getUTCFullYear()
  });
  
  // Calculate current streak (from today backwards)
  // First, find the first day with sessions
  const firstSessionDate = sortedDays.find(day => day.sessions > 0)?.date;
  console.log('Backend streak calculation:', { firstSessionDate, today, sortedDays: sortedDays.map(d => ({ date: d.date, sessions: d.sessions })) });
  
  if (firstSessionDate) {
    // Only count days from first session onwards
    for (let i = sortedDays.length - 1; i >= 0; i--) {
      const day = sortedDays[i];
      if (day.date > today || day.date < firstSessionDate) continue; // Skip future dates and days before first session
      
      if (day.sessions > 0) {
        currentStreak++;
        console.log('Streak day:', day.date, 'sessions:', day.sessions, 'currentStreak:', currentStreak);
      } else {
        console.log('Streak broken on:', day.date, 'sessions:', day.sessions);
        break; // Streak broken
      }
    }
  }
  
  console.log('Final current streak:', currentStreak);
  
  // Calculate best streak
  if (firstSessionDate) {
    for (const day of sortedDays) {
      if (day.date < firstSessionDate) continue; // Skip days before first session
      
      if (day.sessions > 0) {
        tempStreak++;
        bestStreak = Math.max(bestStreak, tempStreak);
      } else {
        tempStreak = 0;
      }
    }
  }
  
  return {
    current: currentStreak,
    best: bestStreak
  };
}

// Helper function to calculate analytics
function calculateAnalytics(days, first_use_date, kind = null) {
  // Use actual current date
  const now = new Date();
  const today = now.getFullYear() + '-' + String(now.getMonth() + 1).padStart(2, '0') + '-' + String(now.getDate()).padStart(2, '0');
  
  // Filter days up to today only
  const upToToday = days.filter(day => day.date <= today);
  
  // Calculate total sessions and minutes
  const totalSessions = upToToday.reduce((sum, day) => sum + day.sessions, 0);
  const totalMinutes = upToToday.reduce((sum, day) => sum + day.minutes, 0);
  
  // Calculate completion rate (percentage of days with sessions)
  const daysWithSessions = upToToday.filter(day => day.sessions > 0).length;
  const completionRate = upToToday.length > 0 ? Math.round((daysWithSessions / upToToday.length) * 100) : 0;
  
  // Calculate average session duration
  const avgSessionDuration = totalSessions > 0 ? Math.round(totalMinutes / totalSessions) : 0;
  
  // Calculate longest break (consecutive days without sessions after first session)
  let longestBreak = 0;
  if (first_use_date) {
    const firstSessionDate = upToToday.find(day => day.sessions > 0)?.date;
    if (firstSessionDate) {
      let currentBreak = 0;
      let hasHadSessions = false;
      
      for (const day of upToToday) {
        if (day.date < firstSessionDate) continue; // Skip days before first session
        
        if (day.sessions > 0) {
          hasHadSessions = true;
          currentBreak = 0;
        } else if (hasHadSessions) {
          currentBreak++;
          longestBreak = Math.max(longestBreak, currentBreak);
        }
      }
    }
  }
  
  return {
    totalSessions,
    totalMinutes,
    completionRate,
    avgSessionDuration,
    longestBreak,
    kind: kind || 'all'
  };
}

module.exports = router;
