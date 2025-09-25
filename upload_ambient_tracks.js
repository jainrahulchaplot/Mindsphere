const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error('❌ Missing Supabase credentials in .env file');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

// Your 8 ambient tracks from the image
const tracks = [
  { filename: 'Arnor(chosic.com).mp3', title: 'Arnor', sort_order: 1 },
  { filename: 'Evening-Improvisation-wit....mp3', title: 'Evening Improvisation', sort_order: 2 },
  { filename: 'scott-buckley-moonlight(c....mp3', title: 'Moonlight', sort_order: 3 },
  { filename: 'Shindao-chosic.com_.mp3', title: 'Shindao', sort_order: 4 },
  { filename: 'Spring-Flowers(chosic.co....mp3', title: 'Spring Flowers', sort_order: 5 },
  { filename: 'Sunset-Landscape(chosic....mp3', title: 'Sunset Landscape 1', sort_order: 6 },
  { filename: 'Sunset-Landscape(chosic....mp3', title: 'Sunset Landscape 2', sort_order: 7 },
  { filename: 'Transcendence-chosic.co....mp3', title: 'Transcendence', sort_order: 8 }
];

async function uploadTracks() {
  console.log('🎵 Starting ambient tracks upload...\n');

  for (const track of tracks) {
    try {
      console.log(`📁 Processing: ${track.filename}`);
      
      // Note: You'll need to place your MP3 files in a local folder
      // and update the file path below
      const filePath = `./uploads/ambient/${track.filename}`;
      
      // Upload to Supabase Storage
      const { data, error } = await supabase.storage
        .from('music')
        .upload(`ambient/${track.filename}`, filePath, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) {
        console.error(`❌ Upload failed for ${track.filename}:`, error.message);
        continue;
      }

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('music')
        .getPublicUrl(`ambient/${track.filename}`);

      console.log(`✅ Uploaded: ${track.title}`);
      console.log(`🔗 URL: ${urlData.publicUrl}`);
      console.log('');

      // Insert into database
      const { error: dbError } = await supabase
        .from('music_tracks')
        .insert({
          title: track.title,
          url: urlData.publicUrl,
          sort_order: track.sort_order
        });

      if (dbError) {
        console.error(`❌ Database insert failed for ${track.title}:`, dbError.message);
      } else {
        console.log(`✅ Added to database: ${track.title}`);
      }

    } catch (error) {
      console.error(`❌ Error processing ${track.filename}:`, error.message);
    }
  }

  console.log('\n🎉 Upload process completed!');
}

// Run the upload
uploadTracks().catch(console.error);
