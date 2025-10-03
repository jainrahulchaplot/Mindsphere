require('dotenv').config();
const OpenAI = require('openai');
const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

/**
 * Summarize a journal entry and extract 2–3 emotions.
 * Always returns { summary: string, emotions: string[] }
 */
async function generateSummary(text){
  const messages = [
    { role: 'system', content: 'You summarize journal entries. Output STRICT JSON only.' },
    { role: 'user', content: `Given this entry, return JSON with keys summary (2-3 sentences) and emotions (2-3 single-word feelings). ENTRY: ${text}` }
  ];
  const r = await client.chat.completions.create({
    model: 'gpt-4o-mini',
    temperature: 0.4,
    messages,
    max_tokens: 300
  });
  const raw = r.choices?.[0]?.message?.content || '{}';
  try { return JSON.parse(raw); } catch { return { summary: raw, emotions: [] }; }
}

module.exports = { generateSummary };