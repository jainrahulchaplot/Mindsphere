# MindSphere AI Prompts Reference

This document contains all AI prompts used in the MindSphere application, organized by functionality with clickable references to the source code.

## Table of Contents
- [Meditation & Sleep Story Generation](#meditation--sleep-story-generation)
- [AI Coach Chat](#ai-coach-chat)
- [Journal Analysis & Summarization](#journal-analysis--summarization)
- [Personalized Nudges](#personalized-nudges)
- [Voice Transcription](#voice-transcription)
- [Content Generation Parameters](#content-generation-parameters)

---

## Meditation & Sleep Story Generation

### Primary Content Generation
**Location:** [`backend/src/openai-content-generator.js`](backend/src/openai-content-generator.js#L17-L81)

This is the main content generation function that creates both meditation scripts and sleep stories using OpenAI's GPT-4o-mini model with **super-enhanced, ultra-personalized prompts**.

**Key Features:**
- **Dynamic Duration Structure**: Adapts to any user-selected duration (1-60+ minutes)
- **Name Personalization**: Addresses users by their first name for intimate, one-on-one experience
- **Mood-Aware Content**: Acknowledges and works with user's current emotional state
- **SSML Generation**: ASCII-only Google-safe SSML with proper tags and timing
- **TTS-Optimized**: Perfectly crafted for Google Cloud TTS with natural speech patterns
- **Fallback Support**: Automatic fallback to plain text when SSML generation fails

#### Sleep Story System Prompt (SSML-Enhanced, Humanized)
```javascript
// Lines 17-45 in openai-content-generator.js
const systemPrompt = kind === 'sleep_story' 
  ? `You are a master of composing SSML bedtime stories for Google Cloud Text-to-Speech Studio-O voice.

RETURN ONLY one valid SSML block with a single <speak> root. No prose, no markdown, no comments, nothing outside <speak>.

HARD RULES (GOOGLE SAFE)
- Allowed tags: <speak>, <p>, <s>, <break time="Xs|Xms">, <prosody rate="x-slow|slow|medium|fast|x-fast" pitch="+/-Nst" volume="silent|x-soft|soft|medium|loud|x-loud">, <emphasis level="reduced|moderate|strong">, <say-as>.
- Disallow: <voice>, <audio>, <mark>, <desc>, custom attributes.
- All attributes must use straight ASCII quotes: ".
- Only ASCII characters (no smart quotes, en/em dashes, or non-breaking spaces). Use "-" hyphen, normal spaces.
- For <break>, time MUST be like "1.5s" or "1500ms".
- For prosody pitch, always add "st" (e.g., pitch="-2st").

STYLE & ATMOSPHERE
- Target duration ≈ ${duration} minutes; create a slow, immersive pace using <break>.
- Use <prosody rate="slow" pitch="-2st">…</prosody> to soften narration.
- Short sentences (<s>) grouped into paragraphs (<p>) for a natural, story-like rhythm.
- Content arc: gentle welcome → sensory imagery journey → gradual softening → quiet invitation to rest.
- Keep tone warm, cozy, and reassuring. Absolutely no suspense, tasks, or cliffhangers.
- Use sensory details (light, breeze, textures, sounds) to create immersion.

PERSONALIZATION (weave naturally, never leave placeholders)
- Mood: ${mood}
- Style: ${style}
- Notes: ${user_notes}
- Name: ${user_name} (address softly 2–3 times, then taper off)

OUTPUT CONTRACT
- Return exactly one <speak>…</speak> block, ASCII only, with allowed tags and valid attributes.`
```

#### Meditation System Prompt (SSML-Human Enhanced, Very Slow + Emphasized)
```javascript
// Lines 46-77 in openai-content-generator.js
: `You compose SSML for Google Cloud Text-to-Speech Studio-O voice.

RETURN ONLY one valid SSML block with a single <speak> root. No prose, no markdown, no comments, nothing outside <speak>.

HARD RULES (GOOGLE SAFE)
- Allowed tags: <speak>, <p>, <s>, <break time="Xs|Xms">, <prosody rate="x-slow|slow|medium|fast|x-fast" pitch="+/-Nst" volume="silent|x-soft|soft|medium|loud|x-loud">, <emphasis level="reduced|moderate|strong">, <say-as>.
- Disallow: <voice>, <audio>, <mark>, <desc>, custom attributes.
- All attributes use straight ASCII quotes: ".
- Only ASCII characters (no smart quotes, en/em dashes, or non-breaking spaces). Use "-" hyphen, normal spaces.
- For <break>, time MUST be like "1.5s" or "1500ms".
- For prosody pitch, always add "st" (e.g., pitch="-2st").

VOICE STYLE
- Ultra slow narration with frequent long pauses.
- Wrap major sections in <prosody rate="x-slow" pitch="-2st" volume="soft">.
- Use <emphasis level="strong"> for key words like "inhale", "exhale", "calm", "release".
- Insert <break time="3s"/> to <break time="6s"/> between breath cycles, paragraphs, or affirmations.

SESSION FLOW
- Opening: Grounding, welcoming, slow entry into present moment.
- Main Practice: Very deliberate breath guidance and gentle affirmations.
- Integration: Long silences with sparse words.
- Closing: Soft invitation to carry the calmness forward.

PERSONALIZATION (weave naturally, never leave placeholders)
- Mood: ${mood}
- Style: ${style}
- Notes: ${user_notes}
- Name: ${user_name} (use sparingly, softly, as if whispered into pauses).

OUTPUT CONTRACT
- Return exactly one <speak>…</speak> block, ASCII only, with allowed tags and valid attributes.`
```

#### User Input Prompt (Unchanged, but clear)
```javascript
// Lines 78-85 in openai-content-generator.js
const userPrompt = `Create a personalized ${kind} as SSML for Google TTS.

DURATION (minutes): ${duration}
MOOD: ${mood}
STYLE: ${style}
NOTES: ${user_notes || '—'}
NAME: ${user_name || '—'}`;
```

### Alternative Meditation Prompt
**Location:** [`backend/src/openai.js`](backend/src/openai.js#L6-L24)

A simpler meditation generation function (currently unused in main flow).

```javascript
// Lines 7-8 in openai.js
const prompt = `Create a ${duration}-minute guided meditation script for someone feeling ${mood}. 
Use the ${style} meditation style. Structure it with clear paragraphs for pacing. Keep it calming and supportive.`;
```

### Session Speech Prompt
**Location:** [`backend/src/routes_session.js`](backend/src/routes_session.js#L23-L53)

Generates prompts for TTS audio generation based on session parameters.

```javascript
// Lines 24-52 in routes_session.js
function generateSpeechPrompt({ mood, duration, style, user_notes }) {
  const basePrompt = `Create a ${duration}-minute guided meditation for someone feeling ${mood}.`;
  
  let styleInstruction = '';
  switch (style) {
    case 'Breathwork':
      styleInstruction = 'Focus on breathing exercises and breath awareness.';
      break;
    case 'Body scan':
      styleInstruction = 'Guide through a systematic body scan meditation.';
      break;
    case 'Loving-kindness':
      styleInstruction = 'Include loving-kindness and compassion practices.';
      break;
    case 'Focus':
      styleInstruction = 'Emphasize concentration and mindfulness techniques.';
      break;
    case 'Sleep':
      styleInstruction = 'Create a calming, sleep-inducing meditation.';
      break;
    default:
      styleInstruction = 'Use general mindfulness and relaxation techniques.';
  }
  
  let notesInstruction = '';
  if (user_notes && user_notes.trim()) {
    notesInstruction = `Incorporate these personal notes: "${user_notes.trim()}".`;
  }
  
  return `${basePrompt} ${styleInstruction} ${notesInstruction} Keep the tone calm, supportive, and conversational. Speak naturally as if guiding someone in person.`;
}
```

---

## AI Coach Chat

**Location:** [`backend/src/routes_coach.js`](backend/src/routes_coach.js#L72-L83)

Provides personalized meditation coaching based on user's journal history and streak data.

```javascript
// Lines 72-83 in routes_coach.js
const prompt = `You are a calm, supportive meditation coach. Respond to the user's message in a helpful, specific way.

${context ? `User's recent context:\n${context}` : ''}

User message: ${message}

Guidelines:
- Keep response under 120 words
- Be calm, supportive, and specific
- Reference their meditation practice when relevant
- Avoid medical advice
- Focus on mindfulness and meditation techniques`;
```

**Context Building:** Lines 44-69 in routes_coach.js
- Fetches recent journal entries (last 5)
- Includes current meditation streak information
- Provides personalized context for responses

---

## Journal Analysis & Summarization

### Journal Entry Analysis
**Location:** [`backend/src/routes_journal.js`](backend/src/routes_journal.js#L14-L62)

Analyzes journal entries to extract emotions and generate summaries.

```javascript
// Lines 14-62 in routes_journal.js
const prompt = `Analyze this meditation journal entry and extract:
1. A brief summary (1-2 sentences)
2. Primary emotions felt (from: calm, anxious, grateful, frustrated, peaceful, overwhelmed, content, stressed, hopeful, sad, joyful, angry, relaxed, worried, confident, lonely, energized, tired, focused, distracted, other)
3. Any insights or patterns

Journal entry: "${text}"

Respond in JSON format:
{
  "summary": "Brief summary here",
  "emotions": ["emotion1", "emotion2"],
  "insights": "Any insights or patterns noticed"
}`;
```

### Journal Summarization
**Location:** [`backend/src/summarizer.js`](backend/src/summarizer.js#L9-L22)

Creates summaries of journal entries for analysis.

```javascript
// Lines 9-22 in summarizer.js
async function generateSummary(text){
  const prompt = `Summarize this meditation journal entry in 1-2 sentences, focusing on the key emotions and insights:

"${text}"

Summary:`;

  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [{ role: 'user', content: prompt }],
    max_tokens: 100,
    temperature: 0.3
  });

  return response.choices[0]?.message?.content?.trim() || 'No summary available';
}
```

---

## Personalized Nudges

**Location:** [`backend/src/routes_nudges.js`](backend/src/routes_nudges.js#L43-L56)

Generates personalized meditation nudges based on user's journal history and streak data.

```javascript
// Lines 43-56 in routes_nudges.js
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
```

**Data Sources:** Lines 23-41 in routes_nudges.js
- Recent journal entries (last 14 days, max 10 entries)
- Current and best meditation streaks
- Emotion analysis from journal summaries

---

## Voice Transcription

### Speech-to-Text Processing
**Location:** [`backend/src/routes_stt.js`](backend/src/routes_stt.js#L12-L131)

Processes voice recordings and transcribes them for journal entries.

```javascript
// Lines 12-131 in routes_stt.js
// Uses Whisper API for transcription
// No specific prompts - direct audio-to-text conversion
```

### Voice Journal Processing
**Location:** [`backend/src/routes_voice.js`](backend/src/routes_voice.js)

Handles voice journal entries with transcription and analysis.

---

## Content Generation Parameters

### Word Count Calculation
**Location:** [`backend/src/openai-content-generator.js`](backend/src/openai-content-generator.js#L7-L15)

Calculates target word count based on duration and content type.

```javascript
// Lines 7-15 in openai-content-generator.js
function calculateTargetWords(kind, duration) {
  const wordsPerMinute = kind === 'sleep_story' ? 100 : 120;
  const baseWords = duration * wordsPerMinute;
  const buffer = Math.floor(baseWords * 0.1); // 10% buffer
  return baseWords + buffer;
}
```

### Available Meditation Styles
**Location:** [`backend/src/routes_session.js`](backend/src/routes_session.js#L28-L45)

- **Breathwork**: Focus on breathing exercises and breath awareness
- **Body scan**: Guide through a systematic body scan meditation
- **Loving-kindness**: Include loving-kindness and compassion practices
- **Focus**: Emphasize concentration and mindfulness techniques
- **Sleep**: Create a calming, sleep-inducing meditation

### Available Moods
The system accepts various mood inputs that influence the meditation content:
- anxious, calm, stressed, peaceful, overwhelmed, content, etc.

---

## API Configuration

### OpenAI Model Settings
- **Model**: `gpt-4o-mini`
- **Max Tokens**: Variable based on content type (4000 max)
- **Temperature**: 0.7 for content generation, 0.3-0.5 for analysis
- **System Role**: Varies by function (meditation teacher, sleep story writer, coach, etc.)

### Content Processing
- **Pause Cue Removal**: Lines 116-120 in openai-content-generator.js
- **Markdown Stripping**: Lines 103-104 in openai-content-generator.js
- **Word Count Validation**: Lines 106-107 in openai-content-generator.js

---

## Usage Examples

### Creating a Meditation Session
1. User selects mood, duration, style, and optional notes
2. System calculates target word count
3. Generates content using meditation system prompt
4. Converts to audio using TTS
5. Stores in database with metadata

### Creating a Sleep Story
1. User selects mood, duration, and optional notes
2. System calculates target word count (100 wpm)
3. Generates story using sleep story system prompt
4. Converts to audio using TTS
5. Stores in database with metadata

### AI Coach Interaction
1. User sends message
2. System fetches recent journal context
3. Generates personalized response using coach prompt
4. Returns supportive, specific advice

---

## File Structure

```
backend/src/
├── openai-content-generator.js # Main content generation
├── routes_session.js      # Session management & speech prompts
├── routes_coach.js        # AI coach chat
├── routes_journal.js      # Journal analysis
├── routes_nudges.js       # Personalized nudges
├── routes_stt.js          # Speech-to-text
├── routes_voice.js        # Voice journal processing
├── summarizer.js          # Journal summarization
└── openai.js              # Alternative meditation generation
```

---

*Last updated: September 19, 2025*
*Total prompts: 8 main categories, 15+ individual prompts*
