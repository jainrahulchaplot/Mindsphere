-- Add session_name column to sessions table
-- This migration adds AI-generated session names to the sessions table

-- Add session_name column to sessions table
ALTER TABLE public.sessions ADD COLUMN IF NOT EXISTS session_name text;

-- Add comment to document the change
COMMENT ON COLUMN public.sessions.session_name IS 'AI-generated personalized session name (4-8 words)';
