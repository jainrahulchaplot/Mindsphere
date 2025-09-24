-- Add audio_manifest column to sessions table
ALTER TABLE sessions ADD COLUMN IF NOT EXISTS audio_manifest JSONB DEFAULT '[]'::jsonb;
