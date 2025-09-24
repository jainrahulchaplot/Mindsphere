-- Create sessions storage bucket (idempotent)
DO $$
BEGIN
  -- Create bucket if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM storage.buckets WHERE id = 'sessions') THEN
    INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
    VALUES ('sessions', 'sessions', true, 104857600, ARRAY['audio/mpeg', 'audio/mp3', 'audio/ogg', 'audio/webm']);
  END IF;
END $$;

-- Create public read policy for sessions bucket
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'sessions_read' AND tablename = 'objects' AND schemaname = 'storage') THEN
    CREATE POLICY sessions_read ON storage.objects
    FOR SELECT USING (bucket_id = 'sessions');
  END IF;
END $$;

-- Add audio_url column to sessions table
ALTER TABLE public.sessions 
ADD COLUMN IF NOT EXISTS audio_url text;

-- Add user_notes column to sessions table  
ALTER TABLE public.sessions 
ADD COLUMN IF NOT EXISTS user_notes text;

-- Add duration_sec column to sessions table
ALTER TABLE public.sessions 
ADD COLUMN IF NOT EXISTS duration_sec int;

-- Add index for audio_url lookups
CREATE INDEX IF NOT EXISTS idx_sessions_audio_url ON public.sessions(audio_url);

-- Add index for user_id + created_at for performance
CREATE INDEX IF NOT EXISTS idx_sessions_user_created ON public.sessions(user_id, created_at DESC);
