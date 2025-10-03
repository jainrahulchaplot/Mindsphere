require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const OpenAI = require('openai');

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = (SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY)
  ? createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)
  : null;

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

class VectorDBService {
  constructor() {
    this.supabase = supabase;
    this.openai = openai;
  }

  // Generate embedding for text using OpenAI
  async generateEmbedding(text) {
    try {
      const response = await this.openai.embeddings.create({
        model: 'text-embedding-3-small',
        input: text,
      });
      return response.data[0].embedding;
    } catch (error) {
      console.error('Error generating embedding:', error);
      throw new Error(`Failed to generate embedding: ${error.message}`);
    }
  }

  // Get relevant memories for personalization
  async getRelevantMemories(userId, queryText, limit = 5, similarityThreshold = 0.7) {
    if (!this.supabase) {
      console.warn('Supabase not configured, returning empty memories');
      return [];
    }

    try {
      // Generate embedding for the query
      const queryEmbedding = await this.generateEmbedding(queryText);

      // Query relevant memories using vector similarity
      const { data, error } = await this.supabase.rpc('get_relevant_memories', {
        p_user_id: userId,
        p_query_embedding: queryEmbedding,
        p_limit: limit,
        p_similarity_threshold: similarityThreshold
      });

      if (error) {
        console.error('Error fetching relevant memories:', error);
        // If there's a type mismatch or function doesn't exist, return empty array to trigger fallback
        if (error.code === '42883' || error.message.includes('operator does not exist')) {
          console.log('Database function error (type mismatch), returning empty array to trigger fallback');
          return [];
        }
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error in getRelevantMemories:', error);
      return [];
    }
  }

  // Get relevant snippets for personalization
  async getRelevantSnippets(userId, queryText, limit = 3, similarityThreshold = 0.7) {
    if (!this.supabase) {
      console.warn('Supabase not configured, returning empty snippets');
      return [];
    }

    try {
      // Generate embedding for the query
      const queryEmbedding = await this.generateEmbedding(queryText);

      // Query relevant snippets using vector similarity
      const { data, error } = await this.supabase.rpc('get_relevant_snippets', {
        p_user_id: userId,
        p_query_embedding: queryEmbedding,
        p_limit: limit,
        p_similarity_threshold: similarityThreshold
      });

      if (error) {
        console.error('Error fetching relevant snippets:', error);
        // If there's a type mismatch or function doesn't exist, return empty array to trigger fallback
        if (error.code === '42883' || error.message.includes('operator does not exist')) {
          console.log('Database function error (type mismatch), returning empty array to trigger fallback');
          return [];
        }
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error in getRelevantSnippets:', error);
      return [];
    }
  }

  // Get user preferences
  async getUserPreferences(userId) {
    if (!this.supabase) {
      console.warn('Supabase not configured, returning default preferences');
      return {
        preferred_voice_style: 'calm',
        preferred_content_themes: [],
        personal_goals: [],
        meditation_goals: [],
        sleep_preferences: []
      };
    }

    try {
      const { data, error } = await this.supabase.rpc('get_user_preferences', {
        p_user_id: userId
      });

      if (error) {
        console.error('Error fetching user preferences:', error);
        return {
          preferred_voice_style: 'calm',
          preferred_content_themes: [],
          personal_goals: [],
          meditation_goals: [],
          sleep_preferences: []
        };
      }

      return data[0] || {
        preferred_voice_style: 'calm',
        preferred_content_themes: [],
        personal_goals: [],
        meditation_goals: [],
        sleep_preferences: []
      };
    } catch (error) {
      console.error('Error in getUserPreferences:', error);
      return {
        preferred_voice_style: 'calm',
        preferred_content_themes: [],
        personal_goals: [],
        meditation_goals: [],
        sleep_preferences: []
      };
    }
  }

  // Store memory with embedding
  async storeMemory(userId, content, category = 'general', importance = 1) {
    if (!this.supabase) {
      console.warn('Supabase not configured, cannot store memory');
      return null;
    }

    try {
      console.log('Generating embedding for memory...');
      const embedding = await this.generateEmbedding(content);
      
      if (!embedding) {
        console.error('Failed to generate embedding for memory');
        return null;
      }

      console.log('Storing memory with embedding...');
      const { data, error } = await this.supabase
        .from('user_memories')
        .insert({
          user_id: userId,
          content,
          category,
          importance,
          embedding
        })
        .select()
        .single();

      if (error) {
        console.error('Error storing memory:', error);
        return null;
      }

      console.log('Memory stored successfully with embedding');
      return data;
    } catch (error) {
      console.error('Error in storeMemory:', error);
      return null;
    }
  }

  // Store snippet with embedding
  async storeSnippet(userId, content) {
    if (!this.supabase) {
      console.warn('Supabase not configured, cannot store snippet');
      return null;
    }

    if (content.length > 500) {
      throw new Error('Snippet content must be 500 characters or less');
    }

    try {
      console.log('Generating embedding for snippet...');
      const embedding = await this.generateEmbedding(content);
      
      if (!embedding) {
        console.error('Failed to generate embedding for snippet');
        return null;
      }

      console.log('Storing snippet with embedding...');
      const { data, error } = await this.supabase
        .from('user_snippets')
        .insert({
          user_id: userId,
          content,
          embedding
        })
        .select()
        .single();

      if (error) {
        console.error('Error storing snippet:', error);
        return null;
      }

      console.log('Snippet stored successfully with embedding');
      return data;
    } catch (error) {
      console.error('Error in storeSnippet:', error);
      return null;
    }
  }

  // Get personalization context for AI prompts
  async getPersonalizationContext(userId, sessionType, mood, userNotes) {
    try {
      // Use a general query to get more memories and snippets for better personalization
      // This ensures we get a broader range of personal context rather than just session-specific matches
      const queryText = 'experiences thoughts feelings memories insights';
      console.log(`🔍 Vector DB: Searching for personalization context for user ${userId}`);
      console.log(`🔍 Vector DB: Query text: "${queryText}"`);

      // Get relevant memories and snippets with lower threshold to get more results
      const [memories, snippets, preferences] = await Promise.all([
        this.getRelevantMemories(userId, queryText, 8, 0.1),
        this.getRelevantSnippets(userId, queryText, 5, 0.1),
        this.getUserPreferences(userId)
      ]);

      console.log(`🔍 Vector DB: Found ${memories.length} memories, ${snippets.length} snippets`);

      // Format the personalization context
      const context = {
        memories: memories.map(m => ({
          content: m.content,
          category: m.category,
          importance: m.importance,
          similarity: m.similarity
        })),
        snippets: snippets.map(s => ({
          content: s.content,
          similarity: s.similarity
        })),
        preferences: preferences
      };

      console.log(`🧠 Retrieved personalization context: ${context.memories.length} memories, ${context.snippets.length} snippets`);
      return context;
    } catch (error) {
      console.error('Error in getPersonalizationContext:', error);
      return {
        memories: [],
        snippets: [],
        preferences: {
          preferred_voice_style: 'calm',
          preferred_content_themes: [],
          personal_goals: [],
          meditation_goals: [],
          sleep_preferences: []
        }
      };
    }
  }


  // Format personalization context for AI prompts
  formatPersonalizationForPrompt(context) {
    let personalizationText = '';

    // Add memories
    if (context.memories && context.memories.length > 0) {
      personalizationText += '\n\nLONG-TERM MEMORY CONTEXT:\n';
      context.memories.forEach((memory, index) => {
        personalizationText += `${index + 1}. [${memory.category}] ${memory.content}\n`;
      });
    }

    // Add snippets
    if (context.snippets && context.snippets.length > 0) {
      personalizationText += '\n\nRECENT THOUGHTS & INSIGHTS:\n';
      context.snippets.forEach((snippet, index) => {
        personalizationText += `${index + 1}. ${snippet.content}\n`;
      });
    }

    // Add preferences
    if (context.preferences) {
      const prefs = context.preferences;
      if (prefs.personal_goals && prefs.personal_goals.length > 0) {
        personalizationText += `\n\nPERSONAL GOALS: ${prefs.personal_goals.join(', ')}\n`;
      }
      if (prefs.meditation_goals && prefs.meditation_goals.length > 0) {
        personalizationText += `MEDITATION GOALS: ${prefs.meditation_goals.join(', ')}\n`;
      }
      if (prefs.sleep_preferences && prefs.sleep_preferences.length > 0) {
        personalizationText += `SLEEP PREFERENCES: ${prefs.sleep_preferences.join(', ')}\n`;
      }
      if (prefs.preferred_content_themes && prefs.preferred_content_themes.length > 0) {
        personalizationText += `PREFERRED THEMES: ${prefs.preferred_content_themes.join(', ')}\n`;
      }
    }

    return personalizationText;
  }
}

module.exports = new VectorDBService();
