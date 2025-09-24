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

// Simple in-memory rate limiting
const rateLimit = new Map();

// POST /api/v1/coach/chat
router.post('/api/v1/coach/chat', async (req, res) => {
  try {
    const user_id = req.user?.id || req.body?.user_id; // token-first; demo fallback
    const { message, lookback_days = 30 } = req.body || {};
    if (!user_id || !message) {
      return res.status(400).json({ error: 'user_id and message required' });
    }

    // Rate limiting (1 request per 3 seconds per user)
    const now = Date.now();
    const userKey = `${user_id}_${req.ip}`;
    const lastRequest = rateLimit.get(userKey);
    
    if (lastRequest && (now - lastRequest) < 3000) {
      return res.status(429).json({ error: 'rate_limited', message: 'Please wait 3 seconds between messages' });
    }
    
    rateLimit.set(userKey, now);

    if (!process.env.OPENAI_API_KEY) {
      return res.status(400).json({ error: 'openai_key_missing' });
    }

    // Get recent context
    let context = '';
    if (supabase) {
      // Get recent journals
      const { data: journals } = await supabase
        .from('journals')
        .select('summary, created_at')
        .eq('user_id', user_id)
        .gte('created_at', new Date(Date.now() - lookback_days * 24 * 60 * 60 * 1000).toISOString())
        .order('created_at', { ascending: false })
        .limit(5);

      // Get current streak
      const { data: streak } = await supabase
        .from('streaks')
        .select('current_streak, best_streak')
        .eq('user_id', user_id)
        .single();

      if (journals && journals.length > 0) {
        context += `Recent journal entries: ${journals.map(j => j.summary).join('; ')}\n`;
      }
      
      if (streak) {
        context += `Current meditation streak: ${streak.current_streak} days (best: ${streak.best_streak} days)\n`;
      }
    }

    // Generate response
    const prompt = `You are a calm, supportive meditation coach. Respond to the user's message in a helpful, specific way.

${context ? `User's recent context:\n${context}` : ''}

User message: ${message}

Guidelines:
- Keep response under 120 words
- Be calm, supportive, and specific
- Reference their meditation practice when relevant
- Avoid medical advice
- Focus on mindfulness and meditation techniques`;

    const response = await client.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 150,
      temperature: 0.5
    });

    const reply = response.choices?.[0]?.message?.content || 'I\'m here to support your meditation practice. How can I help you today?';

    return res.json({ reply });
  } catch (e) {
    console.error('coach/chat error', e);
    return res.status(500).json({ error: 'chat_failed', detail: e?.message || String(e) });
  }
});

module.exports = router;
