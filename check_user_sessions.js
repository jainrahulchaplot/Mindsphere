import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

dotenv.config();

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error('❌ Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

async function checkUserSessions() {
  try {
    console.log('🔍 Checking sessions by user_id...\n');
    
    // Get all unique user_ids from sessions table
    const { data: userStats, error } = await supabase
      .from('sessions')
      .select('user_id')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('❌ Error fetching sessions:', error);
      return;
    }

    // Count sessions by user_id
    const userCounts = {};
    userStats.forEach(session => {
      const userId = session.user_id;
      userCounts[userId] = (userCounts[userId] || 0) + 1;
    });

    console.log('📊 Sessions by User ID:');
    console.log('========================');
    Object.entries(userCounts).forEach(([userId, count]) => {
      const isDemoUser = userId === '550e8400-e29b-41d4-a716-446655440000';
      console.log(`${userId}${isDemoUser ? ' (DEMO USER)' : ''}: ${count} sessions`);
    });

    console.log('\n🔍 Checking recent sessions...\n');
    
    // Get recent sessions with details
    const { data: recentSessions, error: recentError } = await supabase
      .from('sessions')
      .select('id, user_id, session_name, kind, created_at')
      .order('created_at', { ascending: false })
      .limit(10);

    if (recentError) {
      console.error('❌ Error fetching recent sessions:', recentError);
      return;
    }

    console.log('📅 Recent 10 Sessions:');
    console.log('======================');
    recentSessions.forEach((session, index) => {
      const isDemoUser = session.user_id === '550e8400-e29b-41d4-a716-446655440000';
      console.log(`${index + 1}. ${session.session_name || 'Unnamed'} (${session.kind})`);
      console.log(`   User ID: ${session.user_id}${isDemoUser ? ' (DEMO USER)' : ''}`);
      console.log(`   Created: ${session.created_at}`);
      console.log('');
    });

  } catch (error) {
    console.error('❌ Script error:', error);
  }
}

checkUserSessions();
