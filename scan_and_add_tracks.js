import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error('❌ Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

async function scanAndAddTracks() {
  console.log('🔍 Scanning storage bucket for new tracks...');
  
  try {
    // List files in the music bucket
    const { data: files, error: listError } = await supabase.storage
      .from('music')
      .list('ambient', { limit: 100 });

    if (listError) {
      console.error('❌ Error listing storage files:', listError);
      return;
    }

    console.log(`📁 Found ${files.length} files in storage bucket`);

    // Get existing tracks
    const { data: existingTracks } = await supabase
      .from('music_tracks')
      .select('url');

    const existingUrls = existingTracks?.map(track => track.url) || [];
    console.log(`🎵 Found ${existingUrls.length} existing tracks in database`);

    // Find new files
    const newFiles = files.filter(file => {
      const fileUrl = `${SUPABASE_URL}/storage/v1/object/public/music/ambient/${file.name}`;
      return !existingUrls.includes(fileUrl) && file.name.endsWith('.mp3');
    });

    console.log(`🆕 Found ${newFiles.length} new audio files`);

    if (newFiles.length === 0) {
      console.log('✅ No new tracks to add');
      return;
    }

    // Add new tracks
    const addedTracks = [];
    for (const file of newFiles) {
      const title = file.name.replace('.mp3', '').replace(/[-_]/g, ' ');
      const url = `${SUPABASE_URL}/storage/v1/object/public/music/ambient/${file.name}`;
      
      const { data, error } = await supabase
        .from('music_tracks')
        .insert({
          title,
          url,
          sort_order: existingTracks.length + addedTracks.length + 1
        })
        .select()
        .single();

      if (error) {
        console.error(`❌ Error adding track ${title}:`, error.message);
      } else {
        addedTracks.push(data);
        console.log(`✅ Added track: ${title} (ID: ${data.id})`);
      }
    }

    console.log(`\n🎉 Successfully added ${addedTracks.length} new tracks!`);
    
    // Show all tracks
    const { data: allTracks } = await supabase
      .from('music_tracks')
      .select('*')
      .order('sort_order', { ascending: true });

    console.log('\n🎵 Current playlist:');
    allTracks.forEach(track => {
      console.log(`  ${track.sort_order}. ${track.title} (ID: ${track.id})`);
    });
    
  } catch (err) {
    console.error('❌ Error:', err);
  }
}

scanAndAddTracks();
