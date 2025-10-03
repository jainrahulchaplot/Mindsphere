-- Fix database schema for MindSphere sessions
-- Run these SQL commands in your Supabase SQL editor

-- 1. First, let's check the current table structure
SELECT column_name, data_type, is_nullable, column_default 
FROM information_schema.columns 
WHERE table_name = 'sessions' AND table_schema = 'public'
ORDER BY ordinal_position;

-- 2. Drop and recreate the sessions table with proper schema
DROP TABLE IF EXISTS public.sessions CASCADE;

CREATE TABLE public.sessions (
    id BIGSERIAL PRIMARY KEY,
    user_id TEXT NOT NULL,
    kind TEXT NOT NULL CHECK (kind IN ('meditation', 'sleep_story')),
    mood TEXT,
    style TEXT,
    duration INTEGER, -- duration in minutes
    duration_sec INTEGER, -- actual audio duration in seconds
    words INTEGER, -- word count of generated content
    prompt TEXT, -- original user prompt/notes
    script TEXT, -- generated script content
    user_notes TEXT, -- additional user notes
    audio_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Pre-listening data
    selected_duration INTEGER, -- selected duration in minutes
    selected_type TEXT CHECK (selected_type IN ('meditation', 'sleep_story')),
    additional_notes TEXT,
    
    -- Post-listening feedback
    post_rating INTEGER CHECK (post_rating >= 1 AND post_rating <= 3), -- 1=feel bad, 2=no improvement, 3=feel good
    post_feedback TEXT, -- free text feedback
    feedback_embedding VECTOR(1536), -- vector embedding of feedback
    completed_at TIMESTAMPTZ
);

-- 3. Create indexes for better performance
CREATE INDEX IF NOT EXISTS sessions_user_id_idx ON public.sessions(user_id);
CREATE INDEX IF NOT EXISTS sessions_created_at_idx ON public.sessions(created_at);
CREATE INDEX IF NOT EXISTS sessions_kind_idx ON public.sessions(kind);
CREATE INDEX IF NOT EXISTS sessions_mood_idx ON public.sessions(mood);

-- 4. Create vector similarity index for feedback embeddings
CREATE INDEX IF NOT EXISTS sessions_feedback_embedding_idx 
ON public.sessions USING ivfflat (feedback_embedding vector_cosine_ops) 
WITH (lists = 100);

-- 5. Enable RLS (Row Level Security) if needed
ALTER TABLE public.sessions ENABLE ROW LEVEL SECURITY;

-- 6. Create RLS policies (users can only see their own sessions)
CREATE POLICY "Users can view own sessions" ON public.sessions
    FOR SELECT USING (auth.uid()::text = user_id);

CREATE POLICY "Users can insert own sessions" ON public.sessions
    FOR INSERT WITH CHECK (auth.uid()::text = user_id);

CREATE POLICY "Users can update own sessions" ON public.sessions
    FOR UPDATE USING (auth.uid()::text = user_id);

-- 7. Grant necessary permissions
GRANT ALL ON public.sessions TO authenticated;
GRANT ALL ON public.sessions TO service_role;
GRANT USAGE, SELECT ON SEQUENCE public.sessions_id_seq TO authenticated;
GRANT USAGE, SELECT ON SEQUENCE public.sessions_id_seq TO service_role;

-- 8. Create a function to match sessions by feedback similarity
CREATE OR REPLACE FUNCTION match_sessions(
    query_embedding VECTOR(1536),
    match_user_id TEXT,
    match_threshold FLOAT DEFAULT 0.7,
    match_count INT DEFAULT 5
)
RETURNS TABLE (
    id BIGINT,
    user_id TEXT,
    kind TEXT,
    mood TEXT,
    style TEXT,
    script TEXT,
    post_rating INTEGER,
    post_feedback TEXT,
    similarity FLOAT
)
LANGUAGE SQL STABLE
AS $$
    SELECT 
        s.id,
        s.user_id,
        s.kind,
        s.mood,
        s.style,
        s.script,
        s.post_rating,
        s.post_feedback,
        1 - (s.feedback_embedding <=> query_embedding) AS similarity
    FROM public.sessions s
    WHERE s.user_id = match_user_id
        AND s.feedback_embedding IS NOT NULL
        AND 1 - (s.feedback_embedding <=> query_embedding) > match_threshold
    ORDER BY s.feedback_embedding <=> query_embedding
    LIMIT match_count;
$$;

-- 9. Test the table creation
SELECT 'Sessions table created successfully' AS status;
