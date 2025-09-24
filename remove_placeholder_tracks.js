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

async function removePlaceholderTracks() {
  console.log('🗑️ Removing placeholder tracks...');
  
  try {
    // Remove tracks with placeholder URLs (IDs 4-9)
    const { error } = await supabase
      .from('music_tracks')
      .delete()
      .in('id', [4, 5, 6, 7, 8, 9]);

    if (error) {
      console.error('❌ Error removing tracks:', error);
      return;
    }

    console.log('✅ Successfully removed placeholder tracks');
    
    // Get remaining tracks
    const { data, error: fetchError } = await supabase
      .from('music_tracks')
      .select('*')
      .order('sort_order', { ascending: true });

    if (fetchError) {
      console.error('❌ Error fetching remaining tracks:', fetchError);
      return;
    }

    console.log('🎵 Remaining tracks:');
    data.forEach(track => {
      console.log(`  - ${track.title} (ID: ${track.id})`);
    });
    
  } catch (err) {
    console.error('❌ Error:', err);
  }
}

removePlaceholderTracks();
