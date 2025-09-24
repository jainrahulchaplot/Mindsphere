const express = require('express');
const { createClient } = require('@supabase/supabase-js');

require('dotenv').config();

const router = express.Router();

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = (SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY)
  ? createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)
  : null;

// POST /api/v1/migrate - Run database migrations
router.post('/', async (req, res) => {
  try {
    if (!supabase) {
      return res.status(500).json({ error: 'Supabase not configured' });
    }

    console.log('🔄 Running database migrations...');
    
    // Add missing columns to sessions table
    const migrations = [
      'ALTER TABLE public.sessions ADD COLUMN IF NOT EXISTS additional_notes text;',
      'ALTER TABLE public.sessions ADD COLUMN IF NOT EXISTS selected_duration int;',
      'ALTER TABLE public.sessions ADD COLUMN IF NOT EXISTS selected_type text;',
      'ALTER TABLE public.sessions ADD COLUMN IF NOT EXISTS post_rating int CHECK (post_rating >= 1 and post_rating <= 3);',
      'ALTER TABLE public.sessions ADD COLUMN IF NOT EXISTS post_feedback text;',
      'ALTER TABLE public.sessions ADD COLUMN IF NOT EXISTS completed_at timestamptz;',
      'ALTER TABLE public.sessions ADD COLUMN IF NOT EXISTS script text;',
      'ALTER TABLE public.sessions ADD COLUMN IF NOT EXISTS words int;',
      'ALTER TABLE public.sessions ADD COLUMN IF NOT EXISTS prompt text;'
    ];

    const results = [];
    
    for (const migration of migrations) {
      console.log(`🔄 Running: ${migration}`);
      try {
        const { error } = await supabase.rpc('exec_sql', { sql: migration });
        
        if (error) {
          console.error(`❌ Migration failed: ${error.message}`);
          results.push({ migration, success: false, error: error.message });
        } else {
          console.log(`✅ Success: ${migration}`);
          results.push({ migration, success: true });
        }
      } catch (err) {
        console.error(`❌ Migration error: ${err.message}`);
        results.push({ migration, success: false, error: err.message });
      }
    }

    const successCount = results.filter(r => r.success).length;
    const totalCount = results.length;

    res.json({
      success: successCount === totalCount,
      message: `Migration completed: ${successCount}/${totalCount} successful`,
      results
    });

  } catch (error) {
    console.error('Migration error:', error);
    res.status(500).json({ error: 'Migration failed', details: error.message });
  }
});

module.exports = router;
