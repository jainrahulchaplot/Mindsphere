-- Remove style column from sessions table
-- This migration removes the style functionality from the meditation sessions

-- Drop the style column from sessions table
ALTER TABLE public.sessions DROP COLUMN IF EXISTS style;

-- Add comment to document the change
COMMENT ON TABLE public.sessions IS 'Sessions table without style column - style functionality removed';
