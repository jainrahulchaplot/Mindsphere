-- Add kind column to sessions table for session type filtering
ALTER TABLE public.sessions 
ADD COLUMN IF NOT EXISTS kind text DEFAULT 'meditation' CHECK (kind IN ('meditation', 'sleep_story'));

-- Add index for kind lookups
CREATE INDEX IF NOT EXISTS idx_sessions_kind ON public.sessions(kind);

-- Add index for user_id + kind + created_at for performance
CREATE INDEX IF NOT EXISTS idx_sessions_user_kind_created ON public.sessions(user_id, kind, created_at DESC);
