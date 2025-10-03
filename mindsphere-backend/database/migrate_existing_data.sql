-- Migrate existing sessions data to new schema
-- Run this AFTER running fix_database_schema.sql

-- 1. First, let's backup any existing data
CREATE TABLE IF NOT EXISTS sessions_backup AS 
SELECT * FROM public.sessions;

-- 2. Check if we have any data to migrate
SELECT COUNT(*) as existing_sessions FROM sessions_backup;

-- 3. If there's existing data, migrate it to the new schema
-- (This will only work if the old table structure is compatible)
INSERT INTO public.sessions (
    id, user_id, kind, mood, style, duration, duration_sec, words,
    prompt, script, user_notes, audio_url, created_at,
    selected_duration, selected_type, additional_notes,
    post_rating, post_feedback, feedback_embedding, completed_at
)
SELECT 
    COALESCE(id, nextval('sessions_id_seq')) as id,
    user_id,
    COALESCE(kind, 'meditation') as kind,
    mood,
    style,
    duration,
    duration_sec,
    words,
    prompt,
    script,
    COALESCE(user_notes, additional_notes) as user_notes,
    audio_url,
    COALESCE(created_at, NOW()) as created_at,
    selected_duration,
    selected_type,
    additional_notes,
    post_rating,
    post_feedback,
    feedback_embedding,
    completed_at
FROM sessions_backup
ON CONFLICT (id) DO NOTHING;

-- 4. Verify the migration
SELECT 
    COUNT(*) as total_sessions,
    COUNT(CASE WHEN kind = 'meditation' THEN 1 END) as meditation_sessions,
    COUNT(CASE WHEN kind = 'sleep_story' THEN 1 END) as sleep_story_sessions,
    COUNT(CASE WHEN post_rating IS NOT NULL THEN 1 END) as sessions_with_feedback
FROM public.sessions;

-- 5. Clean up backup table (optional)
-- DROP TABLE IF EXISTS sessions_backup;
