-- Update music tracks with your current ambient library
-- Replace the placeholder URLs with your actual Supabase Storage URLs

-- First, clear existing tracks (optional - remove if you want to keep existing)
DELETE FROM music_tracks;

-- Insert your 8 ambient tracks
INSERT INTO music_tracks (title, url, sort_order) VALUES
('Arnor', 'https://your-supabase-project.supabase.co/storage/v1/object/public/music/ambient/Arnor(chosic.com).mp3', 1),
('Evening Improvisation', 'https://your-supabase-project.supabase.co/storage/v1/object/public/music/ambient/Evening-Improvisation-wit....mp3', 2),
('Moonlight', 'https://your-supabase-project.supabase.co/storage/v1/object/public/music/ambient/scott-buckley-moonlight(c....mp3', 3),
('Shindao', 'https://your-supabase-project.supabase.co/storage/v1/object/public/music/ambient/Shindao-chosic.com_.mp3', 4),
('Spring Flowers', 'https://your-supabase-project.supabase.co/storage/v1/object/public/music/ambient/Spring-Flowers(chosic.co....mp3', 5),
('Sunset Landscape 1', 'https://your-supabase-project.supabase.co/storage/v1/object/public/music/ambient/Sunset-Landscape(chosic....mp3', 6),
('Sunset Landscape 2', 'https://your-supabase-project.supabase.co/storage/v1/object/public/music/ambient/Sunset-Landscape(chosic....mp3', 7),
('Transcendence', 'https://your-supabase-project.supabase.co/storage/v1/object/public/music/ambient/Transcendence-chosic.co....mp3', 8);

-- Verify the insertion
SELECT * FROM music_tracks ORDER BY sort_order;
