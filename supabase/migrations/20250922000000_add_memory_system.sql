-- Add memory and snippet tables for personalization
-- This creates the foundation for vector database personalization

-- User memories table (long-term memory)
CREATE TABLE IF NOT EXISTS user_memories (
  id bigserial PRIMARY KEY,
  user_id uuid NOT NULL,
  content text NOT NULL,
  category text DEFAULT 'general',
  importance integer DEFAULT 1 CHECK (importance >= 1 AND importance <= 5),
  embedding vector(1536), -- OpenAI embedding dimension
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- User snippets table (quick thoughts)
CREATE TABLE IF NOT EXISTS user_snippets (
  id bigserial PRIMARY KEY,
  user_id uuid NOT NULL,
  content text NOT NULL CHECK (length(content) <= 500),
  embedding vector(1536), -- OpenAI embedding dimension
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- User preferences table (for personalization context)
CREATE TABLE IF NOT EXISTS user_preferences (
  id bigserial PRIMARY KEY,
  user_id uuid NOT NULL UNIQUE,
  preferred_voice_style text DEFAULT 'calm',
  preferred_content_themes text[] DEFAULT '{}',
  personal_goals text[] DEFAULT '{}',
  meditation_goals text[] DEFAULT '{}',
  sleep_preferences text[] DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_user_memories_user_id ON user_memories(user_id);
CREATE INDEX IF NOT EXISTS idx_user_memories_category ON user_memories(category);
CREATE INDEX IF NOT EXISTS idx_user_memories_importance ON user_memories(importance);
CREATE INDEX IF NOT EXISTS idx_user_memories_created_at ON user_memories(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_user_snippets_user_id ON user_snippets(user_id);
CREATE INDEX IF NOT EXISTS idx_user_snippets_created_at ON user_snippets(created_at DESC);

-- Vector similarity search indexes (using pgvector)
CREATE INDEX IF NOT EXISTS idx_user_memories_embedding ON user_memories 
USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);

CREATE INDEX IF NOT EXISTS idx_user_snippets_embedding ON user_snippets 
USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);

-- Enable pgvector extension if not already enabled
CREATE EXTENSION IF NOT EXISTS vector;

-- Function to get relevant memories for personalization
CREATE OR REPLACE FUNCTION get_relevant_memories(
  p_user_id uuid,
  p_query_embedding vector(1536),
  p_limit integer DEFAULT 5,
  p_similarity_threshold float DEFAULT 0.7
)
RETURNS TABLE (
  id bigint,
  content text,
  category text,
  importance integer,
  similarity float
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    m.id,
    m.content,
    m.category,
    m.importance,
    1 - (m.embedding <=> p_query_embedding) as similarity
  FROM user_memories m
  WHERE m.user_id = p_user_id
    AND m.embedding IS NOT NULL
    AND 1 - (m.embedding <=> p_query_embedding) > p_similarity_threshold
  ORDER BY m.embedding <=> p_query_embedding
  LIMIT p_limit;
END;
$$ LANGUAGE plpgsql;

-- Function to get relevant snippets for personalization
CREATE OR REPLACE FUNCTION get_relevant_snippets(
  p_user_id uuid,
  p_query_embedding vector(1536),
  p_limit integer DEFAULT 3,
  p_similarity_threshold float DEFAULT 0.7
)
RETURNS TABLE (
  id bigint,
  content text,
  similarity float
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    s.id,
    s.content,
    1 - (s.embedding <=> p_query_embedding) as similarity
  FROM user_snippets s
  WHERE s.user_id = p_user_id
    AND s.embedding IS NOT NULL
    AND 1 - (s.embedding <=> p_query_embedding) > p_similarity_threshold
  ORDER BY s.embedding <=> p_query_embedding
  LIMIT p_limit;
END;
$$ LANGUAGE plpgsql;

-- Function to get user preferences
CREATE OR REPLACE FUNCTION get_user_preferences(p_user_id uuid)
RETURNS TABLE (
  preferred_voice_style text,
  preferred_content_themes text[],
  personal_goals text[],
  meditation_goals text[],
  sleep_preferences text[]
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COALESCE(up.preferred_voice_style, 'calm'),
    COALESCE(up.preferred_content_themes, '{}'),
    COALESCE(up.personal_goals, '{}'),
    COALESCE(up.meditation_goals, '{}'),
    COALESCE(up.sleep_preferences, '{}')
  FROM user_preferences up
  WHERE up.user_id = p_user_id;
END;
$$ LANGUAGE plpgsql;
