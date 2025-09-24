-- Enable pgvector extension
create extension if not exists vector;

-- Create notes table
create table if not exists notes (
  id uuid primary key default gen_random_uuid(),
  user_id text not null,
  kind text not null, -- 'prompt' | 'journal' | 'voice_note'
  text text not null,
  embedding vector(1536), -- For OpenAI embeddings
  mood text,
  emotions text[],
  created_at timestamptz default now()
);

-- Add similarity index for fast KNN search
create index if not exists notes_embedding_idx on notes using ivfflat (embedding vector_cosine_ops) with (lists = 100);

-- Extend public.sessions table with new fields
alter table public.sessions add column if not exists prompt text;
alter table public.sessions add column if not exists mood text;
alter table public.sessions add column if not exists style text;
alter table public.sessions add column if not exists words int;
alter table public.sessions add column if not exists duration_sec int;
alter table public.sessions add column if not exists audio_url text;

-- Add pre-listening data fields
alter table public.sessions add column if not exists selected_duration int;
alter table public.sessions add column if not exists selected_type text;
alter table public.sessions add column if not exists additional_notes text;

-- Add post-listening feedback fields
alter table public.sessions add column if not exists post_rating int check (post_rating >= 1 and post_rating <= 3);
alter table public.sessions add column if not exists post_feedback text;
alter table public.sessions add column if not exists feedback_embedding vector(1536);
alter table public.sessions add column if not exists completed_at timestamptz;

-- Create voice_notes storage bucket
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM storage.buckets WHERE id = 'voice_notes') THEN
    INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
    VALUES ('voice_notes', 'voice_notes', false, 104857600, ARRAY['audio/mpeg', 'audio/mp3', 'audio/ogg', 'audio/webm']);
  END IF;
END $$;

-- Create private policy for voice_notes bucket (user can only access their own files)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'voice_notes_private_access' AND tablename = 'objects' AND schemaname = 'storage') THEN
    CREATE POLICY voice_notes_private_access ON storage.objects
    FOR ALL USING (auth.uid() = owner) WITH CHECK (auth.uid() = owner);
  END IF;
END $$;

-- Create function for similarity search
CREATE OR REPLACE FUNCTION match_notes(
  query_embedding vector(1536),
  match_user_id text,
  match_threshold float DEFAULT 0.7,
  match_count int DEFAULT 5
)
RETURNS TABLE (
  id uuid,
  user_id text,
  kind text,
  text text,
  mood text,
  emotions text[],
  created_at timestamptz,
  similarity float
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    notes.id,
    notes.user_id,
    notes.kind,
    notes.text,
    notes.mood,
    notes.emotions,
    notes.created_at,
    1 - (notes.embedding <=> query_embedding) AS similarity
  FROM notes
  WHERE notes.user_id = match_user_id
    AND 1 - (notes.embedding <=> query_embedding) > match_threshold
  ORDER BY notes.embedding <=> query_embedding
  LIMIT match_count;
END;
$$;
