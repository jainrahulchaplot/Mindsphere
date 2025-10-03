require('dotenv').config();
const OpenAI = require('openai');

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

async function generateMeditation({ mood = 'anxious', duration = 5, style = 'Breathwork' }) {
  const prompt = `Create a ${duration}-minute guided meditation script for someone feeling ${mood}. 
  Use the ${style} meditation style. Structure it with clear paragraphs for pacing. Keep it calming and supportive.`;

  const response = await client.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      { role: 'system', content: 'You are a meditation guide creating calming, supportive scripts.' },
      { role: 'user', content: prompt }
    ],
    max_tokens: 800,
    temperature: 0.7
  });

  const script = response.choices[0]?.message?.content || '';
  const paragraphs = script.split('\n\n').filter(p => p);

  return { script, paragraphs };
}

module.exports = { generateMeditation };