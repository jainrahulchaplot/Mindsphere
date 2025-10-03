require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error('❌ Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

async function addColumns() {
  console.log('🔄 Adding missing columns to sessions table...');
  
  try {
    // Try to add columns one by one using direct SQL execution
    const sql = `
      ALTER TABLE public.sessions 
      ADD COLUMN IF NOT EXISTS script_generated boolean DEFAULT false,
      ADD COLUMN IF NOT EXISTS audio_generated boolean DEFAULT false,
      ADD COLUMN IF NOT EXISTS script_content text,
      ADD COLUMN IF NOT EXISTS generation_status text DEFAULT 'pending';
    `;

    console.log('🔄 Running SQL:', sql);
    
    // Use the REST API directly to execute SQL
    const response = await fetch(`${SUPABASE_URL}/rest/v1/rpc/exec_sql`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
        'apikey': SUPABASE_SERVICE_ROLE_KEY
      },
      body: JSON.stringify({ sql })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ SQL execution failed:', errorText);
      
      // Try alternative approach - create a simple table to test connection
      console.log('🔄 Testing connection with a simple query...');
      const { data, error } = await supabase
        .from('sessions')
        .select('id')
        .limit(1);
      
      if (error) {
        console.error('❌ Connection test failed:', error);
      } else {
        console.log('✅ Connection successful, but exec_sql function not available');
        console.log('💡 You may need to add the columns manually in the Supabase dashboard');
      }
    } else {
      console.log('✅ Columns added successfully!');
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

addColumns();
