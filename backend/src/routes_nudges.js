require('dotenv').config();
const { Router } = require('express');
const { createClient } = require('@supabase/supabase-js');
const OpenAI = require('openai');

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = (SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY)
  ? createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)
  : null;

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const router = Router();

// POST /api/v1/nudges/preview
router.post('/api/v1/nudges/preview', async (req, res) => {
  try {
    const { user_id, lookback_days = 14 } = req.body || {};
    if (!user_id) return res.status(400).json({ error: 'user_id required' });
    if (!process.env.OPENAI_API_KEY) return res.status(400).json({ error: 'openai_key_missing' });

    // Get recent journal entries
    const { data: journals } = await supabase
      .from('journals')
      .select('summary, emotions, created_at')
      .eq('user_id', user_id)
      .gte('created_at', new Date(Date.now() - lookback_days * 24 * 60 * 60 * 1000).toISOString())
      .order('created_at', { ascending: false })
      .limit(10);

    // Get current streak
    const { data: streak } = await supabase
      .from('streaks')
      .select('current_streak, best_streak')
      .eq('user_id', user_id)
      .single();

    // Generate nudge
    const journalSummary = journals?.map(j => `${j.summary} (${j.emotions?.join(', ')})`).join('\n') || 'No recent entries';
    const streakInfo = `Current streak: ${streak?.current_streak || 0} days, Best: ${streak?.best_streak || 0} days`;

    const prompt = `Based on this meditation journal data, provide a brief, actionable nudge (1-2 lines max):

Recent entries:
${journalSummary}

Streak info:
${streakInfo}

Guidelines:
- Keep tone calm and encouraging
- Be specific and time-bounded
- Focus on one actionable suggestion
- Use meditation/mindfulness language
- No generic advice`;

    const response = await client.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 100,
      temperature: 0.7
    });

    const nudge = response.choices?.[0]?.message?.content || 'Keep up your meditation practice!';

    return res.json({ nudge });
  } catch (e) {
    console.error('nudges/preview error', e);
    return res.status(500).json({ error: 'nudge_failed', detail: e?.message || String(e) });
  }
});

module.exports = router;
