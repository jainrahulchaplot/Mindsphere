require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error('❌ Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

async function migrateSchema() {
  console.log('🔄 Starting database schema migration...');
  
  try {
    // Add missing columns to sessions table
    const migrations = [
      'ALTER TABLE public.sessions ADD COLUMN IF NOT EXISTS additional_notes text;',
      'ALTER TABLE public.sessions ADD COLUMN IF NOT EXISTS selected_duration int;',
      'ALTER TABLE public.sessions ADD COLUMN IF NOT EXISTS selected_type text;',
      'ALTER TABLE public.sessions ADD COLUMN IF NOT EXISTS post_rating int CHECK (post_rating >= 1 and post_rating <= 3);',
      'ALTER TABLE public.sessions ADD COLUMN IF NOT EXISTS post_feedback text;',
      'ALTER TABLE public.sessions ADD COLUMN IF NOT EXISTS feedback_embedding vector(1536);',
      'ALTER TABLE public.sessions ADD COLUMN IF NOT EXISTS completed_at timestamptz;',
      'ALTER TABLE public.sessions ADD COLUMN IF NOT EXISTS script text;',
      'ALTER TABLE public.sessions ADD COLUMN IF NOT EXISTS words int;',
      'ALTER TABLE public.sessions ADD COLUMN IF NOT EXISTS prompt text;',
      // New columns for sequential generation flow
      'ALTER TABLE public.sessions ADD COLUMN IF NOT EXISTS script_generated boolean DEFAULT false;',
      'ALTER TABLE public.sessions ADD COLUMN IF NOT EXISTS audio_generated boolean DEFAULT false;',
      'ALTER TABLE public.sessions ADD COLUMN IF NOT EXISTS script_content text;',
      'ALTER TABLE public.sessions ADD COLUMN IF NOT EXISTS generation_status text DEFAULT \'pending\';'
    ];

    for (const migration of migrations) {
      console.log(`🔄 Running: ${migration}`);
      const { error } = await supabase.rpc('exec_sql', { sql: migration });
      
      if (error) {
        console.error(`❌ Migration failed: ${error.message}`);
        // Continue with other migrations even if one fails
      } else {
        console.log(`✅ Success: ${migration}`);
      }
    }

    console.log('🎉 Schema migration completed!');
    
  } catch (error) {
    console.error('❌ Migration error:', error.message);
    process.exit(1);
  }
}

migrateSchema();
