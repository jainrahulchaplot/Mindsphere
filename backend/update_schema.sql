-- Add missing columns to sessions table
ALTER TABLE public.sessions ADD COLUMN IF NOT EXISTS additional_notes text;
ALTER TABLE public.sessions ADD COLUMN IF NOT EXISTS selected_duration int;
ALTER TABLE public.sessions ADD COLUMN IF NOT EXISTS selected_type text;
ALTER TABLE public.sessions ADD COLUMN IF NOT EXISTS post_rating int CHECK (post_rating >= 1 and post_rating <= 3);
ALTER TABLE public.sessions ADD COLUMN IF NOT EXISTS post_feedback text;
ALTER TABLE public.sessions ADD COLUMN IF NOT EXISTS feedback_embedding vector(1536);
ALTER TABLE public.sessions ADD COLUMN IF NOT EXISTS completed_at timestamptz;
ALTER TABLE public.sessions ADD COLUMN IF NOT EXISTS script text;
ALTER TABLE public.sessions ADD COLUMN IF NOT EXISTS words int;
ALTER TABLE public.sessions ADD COLUMN IF NOT EXISTS prompt text;
