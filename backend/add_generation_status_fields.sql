-- Add generation status tracking fields to sessions table
ALTER TABLE sessions 
ADD COLUMN IF NOT EXISTS script_generated BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS audio_generated BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS script_content TEXT,
ADD COLUMN IF NOT EXISTS generation_status TEXT DEFAULT 'pending';

-- Update existing sessions to have pending status
UPDATE sessions 
SET generation_status = 'completed' 
WHERE audio_url IS NOT NULL;

-- Update existing sessions to have script_generated = true if they have audio
UPDATE sessions 
SET script_generated = TRUE, audio_generated = TRUE 
WHERE audio_url IS NOT NULL;

