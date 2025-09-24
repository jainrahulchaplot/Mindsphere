require('dotenv').config();
const { supabase } = require('./src/supabase');

async function runMigration() {
  try {
    console.log('Running database migration...');
    
    // Add the new columns
    const { data, error } = await supabase.rpc('exec_sql', {
      sql: `
        ALTER TABLE sessions 
        ADD COLUMN IF NOT EXISTS script_generated BOOLEAN DEFAULT FALSE,
        ADD COLUMN IF NOT EXISTS audio_generated BOOLEAN DEFAULT FALSE,
        ADD COLUMN IF NOT EXISTS script_content TEXT,
        ADD COLUMN IF NOT EXISTS generation_status TEXT DEFAULT 'pending';
      `
    });

    if (error) {
      console.error('Migration failed:', error);
      return;
    }

    console.log('Migration completed successfully!');
    
    // Update existing sessions
    const { error: updateError } = await supabase.rpc('exec_sql', {
      sql: `
        UPDATE sessions 
        SET generation_status = 'completed' 
        WHERE audio_url IS NOT NULL;
        
        UPDATE sessions 
        SET script_generated = TRUE, audio_generated = TRUE 
        WHERE audio_url IS NOT NULL;
      `
    });

    if (updateError) {
      console.error('Update existing sessions failed:', updateError);
    } else {
      console.log('Existing sessions updated successfully!');
    }

  } catch (err) {
    console.error('Migration error:', err);
  }
}

runMigration();
