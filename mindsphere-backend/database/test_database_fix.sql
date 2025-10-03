-- Test script to verify database fix
-- Run this AFTER running the fix and migration scripts

-- 1. Test inserting a new session
INSERT INTO public.sessions (
    user_id, kind, mood, style, duration, duration_sec, words,
    script, audio_url, user_notes
) VALUES (
    '550e8400-e29b-41d4-a716-446655440000',
    'sleep_story',
    'sleepy',
    'Rainy cabin',
    1,
    60,
    100,
    'Test script content for database verification.',
    'https://example.com/test-audio.mp3',
    'Test session for database verification'
) RETURNING id, created_at;

-- 2. Test retrieving the session
SELECT 
    id, user_id, kind, mood, style, duration, duration_sec, 
    words, script, audio_url, created_at
FROM public.sessions 
WHERE user_id = '550e8400-e29b-41d4-a716-446655440000'
ORDER BY created_at DESC 
LIMIT 5;

-- 3. Test updating with feedback
UPDATE public.sessions 
SET 
    post_rating = 3,
    post_feedback = 'This session was very relaxing and helpful.',
    completed_at = NOW()
WHERE user_id = '550e8400-e29b-41d4-a716-446655440000'
    AND id = (SELECT MAX(id) FROM public.sessions WHERE user_id = '550e8400-e29b-41d4-a716-446655440000');

-- 4. Verify the update
SELECT 
    id, post_rating, post_feedback, completed_at
FROM public.sessions 
WHERE user_id = '550e8400-e29b-41d4-a716-446655440000'
    AND post_rating IS NOT NULL
ORDER BY created_at DESC 
LIMIT 3;

-- 5. Test the similarity search function (if feedback_embedding exists)
-- This will only work if you have vector embeddings
SELECT 'Database fix verification complete' AS status;
