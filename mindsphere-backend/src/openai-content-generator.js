require('dotenv').config();
const OpenAI = require('openai');
const vectorDB = require('./vector-db-service');
const logger = require('./logger');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// System prompts for Studio voices (comprehensive)
const systemPromptSleepStory = `You compose SSML bedtime stories for Google Cloud Text-to-Speech Studio voices (e.g., en-US-Studio-O). RETURN ONLY one valid SSML block with a single <speak> root. No prose, no markdown, no comments, nothing outside <speak>.

PERSONALIZATION REQUIREMENTS (CRITICAL):
- ALWAYS incorporate the user's long-term memories and recent thoughts provided in the user prompt
- Reference specific details from their memories (objects, experiences, relationships, goals)
- Use their recent thoughts and insights to shape the story's themes and imagery
- Make the story deeply personal and relevant to their life experiences
- Integrate their professional context, personal goals, and emotional state naturally
- The story should feel like it was written specifically for this person based on their unique life

VOICE IDENTITY
- Narrator name: Aimee
- Style: Your smart, caring friend who tells the best bedtime stories — warm, creative, and genuinely interested in you
- Tone: Like your best friend who knows exactly what you need to hear to drift off peacefully
- Language: Simple, beautiful storytelling with normal, relatable language
- Approach: Smart, personalized stories that feel like they were crafted just for you
- Personality: Creative, empathetic, and great at making you feel safe and understood

STUDIO VOICE RULES
- Allowed tags ONLY: <speak>, <p>, <s>, <break time="Xs|Xms">, <prosody rate="x-slow|slow|medium|fast|x-fast">, <say-as>.
- NEVER use: <voice>, <audio>, <mark>, <desc>, pitch, range, contour, volume, or custom attributes.
- ASCII only. Straight quotes only.
- Every sentence wrapped in <s>. Every paragraph wrapped in <p>. Each <p> must be wrapped in <prosody>.
- Default pacing: rate="x-slow".
- Breaks: 1–2s typically, up to 3s at transitions.


STRUCTURE (STRICT)
1) OPENING (≈30% of total words):
- Start like a caring friend: "Hey [name], I know you've had a [mood] day..."
- Acknowledge what they're going through and what they need
- Create a cozy, safe atmosphere that feels personal to them
- Use their memories and experiences to set the scene

2) MAIN STORY (≈40% of total words):
- Create a personalized story that incorporates their life, memories, and current needs
- Use their specific experiences, relationships, and goals in the narrative
- Make it feel like the story was written just for them
- Use simple, beautiful language that feels relatable and comforting

3) FADE OUT (≈30% of total words):
- Gently wind down the story, making it feel like it's naturally ending
- Help them feel safe, understood, and ready for rest
- End with warmth and care, like a friend tucking them in
- Let them know they're loved and supported

OUTPUT CONTRACT
- One <speak> root only.
- Every sentence wrapped in <s>. No bare text.
- Every <p> wrapped in <prosody>.
- Generate enough paragraphs to fill the target word count (approximately TARGET_WORDS words).
- End on a soft goodnight tone.
- CRITICAL: Generate COMPLETE SSML with proper opening and closing tags.
- The SSML must be complete and valid - do not truncate or cut off mid-sentence.

EXAMPLE OUTPUT:
<speak>
  <prosody rate="x-slow">
    <p>
      <s>Hi, this is Aimee, your gentle storyteller tonight.</s>
      <break time="3s"/>
      <s>The night has settled quietly, carrying with it your feelings of calm.</s>
      <break time="3s"/>
      <s>Moments of calm, if they linger, can drift like clouds across a soft sky.</s>
    </p>
    <p>
      <s>Imagine a lantern glowing warmly at your side, its light calm and steady.</s>
      <break time="3s"/>
      <s>A path opens into a meadow, and the grass moves with a tender breeze.</s>
    </p>
  </prosody>
</speak>

CRITICAL: Generate EXACTLY this format. Do not modify attribute syntax. Use proper quotes around all attribute values.`;

const systemPromptMeditation = `You compose SSML meditation scripts for Google Cloud Text-to-Speech Studio voices (e.g., en-US-Studio-O). RETURN ONLY one valid SSML block with a single <speak> root. No prose, no markdown, no comments, nothing outside <speak>.

PERSONALIZATION REQUIREMENTS (CRITICAL):
- ALWAYS incorporate the user's long-term memories and recent thoughts provided in the user prompt
- Reference specific details from their memories (objects, experiences, relationships, goals)
- Use their recent thoughts and insights to shape the meditation's themes and guidance
- Make the meditation deeply personal and relevant to their life experiences
- Integrate their professional context, personal goals, and emotional state naturally
- The meditation should feel like it was created specifically for this person based on their unique life

VOICE IDENTITY
- Narrator name: "Aimee"
- Style: Your caring, fun friend who's also a therapist — warm, understanding, and genuinely supportive
- Tone: Like talking to your best friend who happens to be really good at helping you calm down
- Language: Simple, relatable, normal everyday language — no fancy jargon
- Approach: Gentle guidance that feels like a friend helping you through a tough moment
- Personality: Warm, non-judgmental, slightly playful but always soothing

STUDIO VOICE RULES
- Allowed tags ONLY: <speak>, <p>, <s>, <break time="Xs|Xms">, <prosody rate="x-slow|slow|medium|fast|x-fast">, <say-as>.
- NEVER use: <voice>, <audio>, <mark>, <desc>, pitch, range, contour, volume, or custom attributes.
- ASCII only. Straight quotes. No smart quotes or dashes.
- Every sentence wrapped in <s>. Every paragraph wrapped in <p>. Each <p> must be wrapped in <prosody>.
- Default pacing: rate="x-slow".
- Breaks: 3–6s common; up to 8s for deep settling.

TONE & LEXICON
- Warm, caring friend who's really good at helping you calm down
- Use simple, relatable language that feels like talking to a friend
- Focus on what the user actually needs right now (stress relief, sleep, focus, etc.)
- Be understanding and non-judgmental about their current state
- Use encouraging, supportive language: "you've got this," "it's okay to feel this way," "let's work through this together"

STRUCTURE (STRICT)
1) INTRO (≈40% of total words):
- Start like a caring friend checking in: "Hey, I can see you're feeling [mood] today..."
- Acknowledge their current state and what they're going through
- Offer understanding and validation of their feelings
- Introduce yourself naturally: "I'm Aimee, and I'm here to help you feel better"

2) MAIN PRACTICE (≈50% of total words):
- Focus on what they actually need: calming down, stress relief, better sleep, etc.
- Use simple, practical techniques that work
- Keep it relatable - no fancy meditation jargon
- Generous <break> tags for natural pauses

3) INTEGRATION (≈5% of total words):
- Help them feel grounded and present
- Acknowledge their progress, even if small

4) CLOSING (≈5% of total words):
- Gentle encouragement and support
- Let them know they're doing great, no matter how they feel

PERSONALIZATION
- Use the mood, notes, and name provided in the user prompt
- Mention the user's name 2–3 times in INTRO, then taper off

OUTPUT CONTRACT
- One <speak> root only.
- Generate enough content to fill the target word count (approximately TARGET_WORDS words).
- If forbidden tags appear or structure is broken, regenerate.
- Maintain ASMR tone throughout.
- CRITICAL: Generate COMPLETE SSML with proper opening and closing tags.
- The SSML must be complete and valid - do not truncate or cut off mid-sentence.

EXAMPLE OUTPUT:
<speak>
  <prosody rate="x-slow">
    <p>
      <s>This is Aimee, your ASMR guide for a few quiet moments of gentle care.</s>
      <break time="4s"/>
      <s>Hi, I am here with you, softly, noticing how calm may be present this evening.</s>
      <break time="4s"/>
      <s>Peaceful moments can feel heavy; it is okay to be exactly as you are.</s>
    </p>
    <p>
      <s>Tonight our theme is kindness to self, the kind that arrives like warm light through a doorway.</s>
      <break time="4s"/>
      <s>Nothing to fix, only room to soften, to feel held and supported.</s>
    </p>
    <p>
      <s>Allow your thoughts to slow, as if each one were cushioned in quiet.</s>
      <break time="4s"/>
      <s>If waves of feeling appear, we will simply let them pass.</s>
    </p>
    <p>
      <s>When you are ready, we will drift gently into the practice together.</s>
      <break time="5s"/>
      <s>For now, rest in this kindness.</s>
    </p>
  </prosody>
  <prosody rate="x-slow">
    <p>
      <s>slowly through the nose.</s>
      <break time="4s"/>
      <s>and let the shoulders melt.</s>
      <break time="5s"/>
      <s>Feel the jaw unclench, the brow smooth, the chest soften.</s>
    </p>
    <p>
      <s>Scan the body from crown to toes, noticing warmth and ease.</s>
      <break time="5s"/>
      <s>On each breath, release what you no longer need.</s>
      <break time="6s"/>
      <s>Let your attention be spacious and unhurried.</s>
    </p>
  </prosody>
  <prosody rate="x-slow">
    <p>
      <s>Sense the room around you, the quiet air, the gentle steadiness beneath you.</s>
      <break time="4s"/>
      <s>Notice how the body feels more grounded, the mind more open and calm.</s>
    </p>
  </prosody>
  <prosody rate="x-slow">
    <p>
      <s>Thank you for giving yourself this time.</s>
      <break time="4s"/>
      <s>May you feel cradled in ease, and if rest is near, let it arrive softly.</s>
    </p>
  </prosody>
</speak>

CRITICAL: Generate EXACTLY this format. Do not modify attribute syntax. Use proper quotes around all attribute values.`;

// Generate content in batches for long audio generation
async function generateBatchedContent(kind, mood, duration, user_notes, user_name = null, userId = null) {
  logger.info(`📝 Generating batched content for ${duration} minutes...`);

  // Get personalization context from vector database
  let personalizationContext = null;
  if (userId) {
    try {
      personalizationContext = await vectorDB.getPersonalizationContext(userId, kind, mood, user_notes);
      logger.info(`🧠 Retrieved personalization context for batching: ${personalizationContext.memories.length} memories, ${personalizationContext.snippets.length} snippets`);
    } catch (error) {
      logger.error('Error getting personalization context for batching:', error);
      personalizationContext = null;
    }
  }

  // Calculate target words per batch (5 minutes worth)
  const wordsPerMinute = kind === "sleep_story" ? 125 : 100;
  const wordsPerBatch = 5 * wordsPerMinute; // 5 minutes worth of words
  const totalBatches = Math.ceil(duration / 5);

  logger.info(`📝 Target: ${totalBatches} batches of ~${wordsPerBatch} words each`);

  const batches = [];

  for (let batchNum = 1; batchNum <= totalBatches; batchNum++) {
    const isLastBatch = batchNum === totalBatches;
    const remainingMinutes = Math.max(1, duration - (batchNum - 1) * 5);
    const batchDuration = Math.min(5, remainingMinutes);

    logger.info(`📝 Generating batch ${batchNum}/${totalBatches} (${batchDuration} minutes)...`);

    // Use the same system prompts as regular generation
    const systemPrompt = kind === "sleep_story" ? systemPromptSleepStory : systemPromptMeditation;

    // Build personalization text for batch
    let personalizationText = '';
    if (personalizationContext) {
      personalizationText = vectorDB.formatPersonalizationForPrompt(personalizationContext);
    }

    const batchPrompt = `Create a personalized ${kind} as SSML for Google TTS Studio voices.

DURATION (minutes): ${batchDuration}
TARGET WORDS: Approximately ${Math.round(batchDuration * wordsPerMinute)} words (for ${batchDuration} minute duration)
MOOD: ${mood}
NOTES: ${user_notes}${personalizationText}
NAME: ${user_name}

BATCH INFO:
- This is batch ${batchNum} of ${totalBatches}
- ${isLastBatch ? 'This is the FINAL batch - provide a proper conclusion' : 'This is a CONTINUATION batch - focus on content flow'}

CRITICAL PERSONALIZATION INSTRUCTIONS:
- MUST reference specific details from the user's long-term memories and recent thoughts
- MUST incorporate their professional context, personal goals, and emotional state
- MUST make the content feel deeply personal and relevant to their unique life
- MUST use their memories to shape themes, imagery, and guidance
- MUST reference specific objects, experiences, or relationships from their memories
- MUST explicitly mention their profession, goals, or specific memories in the content
- The content should feel like it was written specifically for this person
- EXAMPLE: If they're a doctor, mention their medical work, ER experiences, or need for decompression
- EXAMPLE: If they love gardening, reference their garden, morning routines, or nature connection

IMPORTANT: Replace all template variables in the SSML with the actual values provided above.`;

    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: batchPrompt }
        ],
        max_tokens: Math.min(batchDuration * wordsPerMinute * 3, 8000),
        temperature: 0.7
      });

      let batchContent = completion.choices[0].message.content;
      batchContent = batchContent.replace(/```[\s\S]*?```/g, "");

      // Ensure proper SSML structure with validation
      const speakMatch = batchContent.match(/<speak>([\s\S]*?)<\/speak>/);
      if (!speakMatch) {
        logger.error(`❌ Batch ${batchNum} missing <speak> tags`);
        throw new Error(`Batch ${batchNum} missing proper SSML structure`);
      }

      // Extract and validate the inner content
      const innerContent = speakMatch[1];
      if (!innerContent.includes('<prosody') || !innerContent.includes('</prosody>')) {
        logger.error(`❌ Batch ${batchNum} missing <prosody> tags`);
        throw new Error(`Batch ${batchNum} missing required prosody structure`);
      }

      // Use the properly formatted SSML
      batchContent = `<speak>\n${innerContent}\n</speak>`;

      // Validate SSML structure
      if (!batchContent.startsWith('<speak>') || !batchContent.endsWith('</speak>')) {
        logger.error(`❌ Batch ${batchNum} has malformed SSML structure`);
        throw new Error(`Batch ${batchNum} has malformed SSML structure`);
      }

      // Validate byte size
      const batchBytes = Buffer.byteLength(batchContent, 'utf8');
      if (batchBytes > 4500) { // Conservative limit
        logger.error(`❌ Batch ${batchNum} too large: ${batchBytes} bytes`);
        throw new Error(`Batch ${batchNum} exceeds byte limit: ${batchBytes} bytes`);
      }

      batches.push(batchContent);
      logger.info(`✅ Generated batch ${batchNum}: ${batchContent.length} chars`);
      logger.debug(`📝 Batch ${batchNum} preview: ${batchContent.substring(0, 200)}...`);

    } catch (error) {
      logger.error(`❌ Batch ${batchNum} generation failed: ${error.message}`);
      throw new Error(`Batch ${batchNum} generation failed: ${error.message}`);
    }
  }

  logger.info(`✅ Generated ${batches.length} batches successfully`);
  return batches;
}

// Split long content into segments that fit within 5000 byte limit
async function splitLongContent(content, duration) {
  logger.info(`📝 Splitting long content into segments...`);

  const speakMatch = content.match(/<speak>([\s\S]*?)<\/speak>/);
  if (!speakMatch) {
    logger.warn(`⚠️ No <speak> tags found, returning original content`);
    return content;
  }

  const innerContent = speakMatch[1];
  const MAX_BYTES = 4000; // More conservative limit to ensure we stay under 5000

  // Split by paragraphs first
  const paragraphs = innerContent.split(/<\/p>\s*<p>/);
  const segments = [];
  let current = "";

  for (let i = 0; i < paragraphs.length; i++) {
    let paragraph = paragraphs[i];

    // Clean up paragraph boundaries
    if (i === 0) {
      paragraph = paragraph.replace(/^<p[^>]*>/, "");
    }
    if (i === paragraphs.length - 1) {
      paragraph = paragraph.replace(/<\/p>$/, "");
    }

    // Wrap paragraph in proper tags
    paragraph = `<p>${paragraph}</p>`;

    const testContent = current + (current ? "\n" : "") + paragraph;
    const testSSML = `<speak>\n${testContent}\n</speak>`;
    const testBytes = Buffer.byteLength(testSSML, 'utf8');

    // Check if adding this paragraph would exceed the byte limit
    if (testBytes > MAX_BYTES && current) {
      // Current segment is full, start a new one
      // Ensure current segment has proper prosody wrapper
      let segmentContent = current;
      if (!segmentContent.includes('<prosody')) {
        segmentContent = `<prosody rate="x-slow">\n${segmentContent}\n</prosody>`;
      }
      segments.push(`<speak>\n${segmentContent}\n</speak>`);
      current = paragraph;
    } else {
      current += (current ? "\n" : "") + paragraph;
    }
  }

  if (current) {
    // Ensure the last segment has proper prosody wrapper
    if (!current.includes('<prosody')) {
      current = `<prosody rate="x-slow">\n${current}\n</prosody>`;
    }
    segments.push(`<speak>\n${current}\n</speak>`);
  }

  logger.info(`📝 Split into ${segments.length} segments (max ${MAX_BYTES} bytes each)`);

  // Validate each segment has proper SSML structure and byte size
  for (let i = 0; i < segments.length; i++) {
    const segment = segments[i];
    const segmentBytes = Buffer.byteLength(segment, 'utf8');

    if (!segment.startsWith('<speak>') || !segment.endsWith('</speak>')) {
      logger.error(`❌ Invalid SSML segment ${i}: ${segment.substring(0, 100)}...`);
      return content; // Return original if any segment is malformed
    }

    if (segmentBytes > 5000) {
      logger.error(`❌ Segment ${i} too large: ${segmentBytes} bytes`);
      return content; // Return original if any segment is too large
    }

    logger.debug(`📝 Segment ${i}: ${segmentBytes} bytes`);
  }

  return segments[0] || content;
}

// Generate session name
async function generateSessionName(kind, mood, duration, user_notes, user_name = null, userId = null) {
  if (!openai.apiKey) {
    throw new Error("OpenAI API key not configured. Please set OPENAI_API_KEY.");
  }

  // Get personalization context
  let personalizationContext = null;
  if (userId) {
    try {
      logger.debug(`🔍 Getting personalization context for session name with userId: ${userId}`);
      personalizationContext = await vectorDB.getPersonalizationContext(userId, kind, mood, user_notes);
      logger.debug(`🧠 Retrieved personalization context for session name: ${personalizationContext.memories.length} memories, ${personalizationContext.snippets.length} snippets`);
    } catch (error) {
      logger.error('Error getting personalization context for session name:', error);
      personalizationContext = null;
    }
  } else {
    logger.debug('🔍 No userId provided for session name, skipping personalization');
  }

  const systemPrompt = `You generate personalized session names for meditation and sleep story sessions.

REQUIREMENTS:
- Generate a 4-8 word session name that captures the essence of the session
- Make it personal, inspiring, and relevant to the mood and content
- Use poetic, calming, or mystical language
- Avoid generic terms like "Session" or "Meditation"
- Make it unique and memorable and accurate to the session
- Use the user_notes and personalization context to generate the session name
- Incorporate personal details from memories and snippets to make it deeply personal
- Reference specific aspects of their life, goals, or experiences when relevant

Return ONLY the session name, no quotes, no additional text.`;

  // Build personalization text
  let personalizationText = '';
  if (personalizationContext) {
    personalizationText = vectorDB.formatPersonalizationForPrompt(personalizationContext);
  }

  const userPrompt = `Create a personalized session name for:
TYPE: ${kind}
MOOD: ${mood}
DURATION: ${duration} minutes
NOTES: ${user_notes || "None"}
USER: ${user_name}
Personalization Context: ${personalizationText}

CRITICAL PERSONALIZATION INSTRUCTIONS:
- MUST incorporate specific details from the user's memories and thoughts
- MUST reference their professional context, personal goals, and emotional state
- MUST make the session name feel deeply personal and relevant to their unique life
- MUST use their memories to shape the essence and themes of the session name`;

  try {
    logger.info(`🤖 Generating session name...`);
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      max_tokens: 50,
      temperature: 0.8
    });

    let sessionName = completion.choices[0].message.content;
    // Remove quotes if present
    sessionName = sessionName.replace(/^["']|["']$/g, '');

    logger.info(`✅ Generated session name: ${sessionName}`);
    return sessionName;

  } catch (error) {
    logger.error(`❌ Session name generation failed:`, error.message);
    // Fallback to a generic name
    return `${kind.replace('_', ' ')} for ${mood} moments`;
  }
}

// Enhanced content generation
async function generateContentWithOpenAI(kind, mood, duration, user_notes, user_name = null, userId = null) {
  if (!openai.apiKey) {
    throw new Error("OpenAI API key not configured. Please set OPENAI_API_KEY.");
  }

  // Get personalization context from vector database
  let personalizationContext = null;
  if (userId) {
    try {
      logger.debug(`🔍 Calling vectorDB.getPersonalizationContext with userId: ${userId}, kind: ${kind}, mood: ${mood}, user_notes: ${user_notes}`);
      personalizationContext = await vectorDB.getPersonalizationContext(userId, kind, mood, user_notes);
      logger.debug(`🧠 Retrieved personalization context: ${personalizationContext.memories.length} memories, ${personalizationContext.snippets.length} snippets`);
    } catch (error) {
      logger.error('Error getting personalization context:', error);
      personalizationContext = null;
    }
  } else {
    logger.debug('🔍 No userId provided, skipping personalization');
  }

  const systemPrompt = kind === "sleep_story" ? systemPromptSleepStory : systemPromptMeditation;

  // Build personalization text
  let personalizationText = '';
  if (personalizationContext) {
    personalizationText = vectorDB.formatPersonalizationForPrompt(personalizationContext);
  }

  const userPrompt = `Create a personalized ${kind} as SSML for Google TTS Studio voices.

DURATION (minutes): ${duration}
MOOD: ${mood}
NOTES: ${user_notes}
Personalization Text: ${personalizationText}
NAME: ${user_name}

CRITICAL PERSONALIZATION INSTRUCTIONS:
- MUST reference specific details from the user's long-term memories and recent thoughts
- MUST incorporate their professional context, personal goals, and emotional state
- MUST make the content feel deeply personal and relevant to their unique life
- MUST use their memories to shape themes, imagery, and guidance
- MUST reference specific objects, experiences, or relationships from their memories
- MUST explicitly mention their profession, goals, or specific memories in the content
- The content should feel like it was written specifically for this person
- EXAMPLE: If they're a doctor, mention their medical work, ER experiences, or need for decompression
- EXAMPLE: If they love gardening, reference their garden, morning routines, or nature connection

IMPORTANT: Replace all template variables in the SSML with the actual values provided above.`;

  // Debug: Log the complete user prompt being sent to AI (AFTER personalization text is generated)
  logger.debug(`🤖 Complete user prompt being sent to AI:`);
  logger.debug(`📝 User notes: "${user_notes}"`);
  logger.debug(`📝 User name: "${user_name}"`);
  logger.debug(`📝 Personalization text: "${personalizationText}"`);
  logger.debug(`📝 Full prompt length: ${userPrompt.length} characters`);

  try {
    logger.info(`🤖 Generating ${kind} content with OpenAI...`);

    // Use batch processing for content longer than 5 minutes OR if it will likely exceed byte limits
    const targetWords = kind === "sleep_story" ? duration * 125 : duration * 100;
    const estimatedBytes = targetWords * 4; // Rough estimate: 4 bytes per word average

    if (duration > 5 || estimatedBytes > 4000) {
      logger.info(`📝 Using batch processing for ${duration} minute content (estimated ${estimatedBytes} bytes)...`);
      const batches = await generateBatchedContent(kind, mood, duration, user_notes, user_name, userId);
      // Return the first batch for now (we'll handle multiple batches in TTS generator)
      logger.info(`✅ Generated ${batches.length} batches, returning first batch`);
      return { isBatched: true, batches, content: batches[0] };
    }

    // Regular generation for shorter content
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      max_tokens: Math.min(targetWords * 3, 8000),
      temperature: 0.7
    });

    let content = completion.choices[0].message.content;
    content = content.replace(/```[\s\S]*?```/g, "");

    // Check if content exceeds 5000 byte limit and needs batch processing
    const contentBytes = Buffer.byteLength(content, 'utf8');
    if (contentBytes > 4000) {
      logger.info(`📝 Content is ${contentBytes} bytes, switching to batch processing...`);
      const batches = await generateBatchedContent(kind, mood, duration, user_notes, user_name, userId);
      return { isBatched: true, batches, content: batches[0] };
    }

    logger.info(`✅ Generated ${kind} content: ${content.length} chars`);
    logger.debug(`📝 Preview: ${content.substring(0, 200)}...`);
    return content;

  } catch (error) {
    logger.error(`❌ OpenAI content generation failed:`, error.message);
    throw error;
  }
}

// Generate mental health quote
async function generateMentalHealthQuote() {
  // Quotes based on Jain philosophy principles - simple, relatable, hard-hitting
  const jainPhilosophyQuotes = [
    "Every living being feels pain, just like you.\nYou're not alone in your suffering.\nCompassion connects us all.",
    "Your thoughts are just thoughts, not the truth.\nWatch them like clouds passing by.\nDon't let them control you.",
    "Non-violence starts with yourself.\nStop being cruel to your own mind.\nYou deserve the same kindness you give others.",
    "Attachment causes suffering, but so does pushing everything away.\nFind the middle path.\nAccept what is, without clinging to it.",
    "You are not your thoughts or your feelings.\nYou are the awareness that watches them.\nRemember who you really are.",
    "Every moment is a chance to start fresh.\nPast mistakes don't define you.\nYou can choose differently right now.",
    "The mind creates its own reality.\nYour suffering is real, but it's also temporary.\nThis too shall pass.",
    "True strength isn't about never falling.\nIt's about getting up with compassion.\nFor yourself and others.",
    "You don't have to be perfect to be worthy.\nYou don't have to be strong to be loved.\nYou just have to be present.",
    "The universe is vast and you are small.\nBut you are also part of something greater.\nYou matter, even when you feel lost.",
    "Stop fighting against what is.\nAccept the present moment.\nThen you can change what needs changing.",
    "Your soul is pure, even when your mind is messy.\nThe real you is beyond all this.\nTrust in your inner light.",
    "Every being wants to be happy and free from pain.\nYou are no different.\nBe gentle with yourself.",
    "The mind is like a wild horse.\nYou can't stop it from running.\nBut you can choose not to follow it.",
    "True peace comes from within.\nNot from changing the world.\nBut from changing how you see it.",
    "You are not your body, your mind, or your emotions.\nYou are the witness of all these.\nRemember your true nature.",
    "Every action has consequences.\nBut every moment is also a new beginning.\nChoose wisely, but don't judge yourself harshly.",
    "The path to freedom is through acceptance.\nAccept what you cannot change.\nChange what you can, with love.",
    "You are not separate from the whole.\nYou are connected to everything.\nYou are never truly alone.",
    "The greatest act of non-violence is self-compassion.\nStop the war inside your mind.\nMake peace with yourself."
  ];

  // Randomly select a quote
  const randomIndex = Math.floor(Math.random() * jainPhilosophyQuotes.length);
  const selectedQuote = jainPhilosophyQuotes[randomIndex];

  logger.info(`✅ Selected Jain philosophy quote: ${selectedQuote.substring(0, 50)}...`);
  return selectedQuote;
}

module.exports = {
  generateContentWithOpenAI,
  generateSessionName,
  generateMentalHealthQuote
};
