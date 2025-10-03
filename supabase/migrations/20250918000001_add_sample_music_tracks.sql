-- Add sample ambient music tracks
-- Note: Replace <PUBLIC_URL> with actual Supabase Storage URLs after uploading files

INSERT INTO music_tracks (title, url, sort_order) VALUES
('Forest Rain', '<PUBLIC_URL>', 1),
('Ocean Waves', '<PUBLIC_URL>', 2),
('Mountain Wind', '<PUBLIC_URL>', 3),
('Zen Garden', '<PUBLIC_URL>', 4),
('Night Sounds', '<PUBLIC_URL>', 5)
ON CONFLICT (id) DO NOTHING;
