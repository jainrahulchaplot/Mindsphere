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

// Add new music tracks
const newTracks = [
  {
    title: "Mountain Wind",
    url: "https://ylrrlzwphuktzocwjjin.supabase.co/storage/v1/object/public/music/ambient/mountain-wind.mp3",
    sort_order: 3
  },
  {
    title: "Zen Garden", 
    url: "https://ylrrlzwphuktzocwjjin.supabase.co/storage/v1/object/public/music/ambient/zen-garden.mp3",
    sort_order: 4
  },
  {
    title: "Night Sounds",
    url: "https://ylrrlzwphuktzocwjjin.supabase.co/storage/v1/object/public/music/ambient/night-sounds.mp3", 
    sort_order: 5
  },
  {
    title: "Thunderstorm",
    url: "https://ylrrlzwphuktzocwjjin.supabase.co/storage/v1/object/public/music/ambient/thunderstorm.mp3",
    sort_order: 6
  },
  {
    title: "Cafe Ambience",
    url: "https://ylrrlzwphuktzocwjjin.supabase.co/storage/v1/object/public/music/ambient/cafe-ambience.mp3",
    sort_order: 7
  },
  {
    title: "Birds Chirping",
    url: "https://ylrrlzwphuktzocwjjin.supabase.co/storage/v1/object/public/music/ambient/birds-chirping.mp3",
    sort_order: 8
  }
];

async function addTracks() {
  console.log('🎵 Adding new music tracks to database...');
  
  try {
    const { data, error } = await supabase
      .from('music_tracks')
      .insert(newTracks)
      .select();

    if (error) {
      console.error('❌ Error adding tracks:', error);
      return;
    }

    console.log('✅ Successfully added tracks:');
    data.forEach(track => {
      console.log(`  - ${track.title} (ID: ${track.id})`);
    });
    
    console.log(`\n🎵 Total tracks now in database: ${data.length + 2}`); // +2 for existing tracks
    
  } catch (err) {
    console.error('❌ Error:', err);
  }
}

addTracks();
