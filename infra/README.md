# MindSphere Database Setup

## Manual Steps Required

Follow these steps in order to set up your Supabase database:

### 1. Create Database Schema
1. Open your Supabase project dashboard
2. Go to **SQL Editor**
3. Copy and paste the contents of `infra/schema.sql`
4. Click **Run** to execute the schema

### 2. Create Storage Buckets
1. Go to **Storage** in your Supabase dashboard
2. Create a **PUBLIC** bucket named `audio` (for TTS chunks later)
3. Create a **PUBLIC** bucket named `music` (for background music)

### 3. Upload Sample Music Track
1. Find a small open-source MP3 file (or use a royalty-free track)
2. Upload it to the `music` bucket at path: `playlist/mock-track.mp3`
3. Copy the **Public URL** (it will look like: `https://<project>.supabase.co/storage/v1/object/public/music/playlist/mock-track.mp3`)

### 4. Seed Music Data
1. Edit `infra/seed_music.sql` locally
2. Replace `<PUBLIC_URL>` with the copied URL from step 3
3. Go back to **SQL Editor** in Supabase
4. Paste and run the contents of `infra/seed_music.sql`

## Schema Overview

### Tables Created:
- **profiles**: User profile information
- **sessions**: Meditation/focus sessions
- **journals**: User journal entries linked to sessions
- **streaks**: User streak tracking
- **music_tracks**: Background music playlist

### Functions Created:
- **update_streak_on_completion()**: RPC function to update user streaks

### Storage Buckets:
- **audio**: For TTS audio chunks (public)
- **music**: For background music tracks (public)

## Result
After completing these steps, you'll have:
- ✅ Database tables and RPC functions created
- ✅ Storage buckets 'audio' and 'music' configured
- ✅ One background music track seeded in the database