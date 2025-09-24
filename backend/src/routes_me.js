const express = require('express');
const { createClient } = require('@supabase/supabase-js');
const { SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, DEMO_USER_ID } = require('./config.js');

const router = express.Router();

// Initialize Supabase client
const supabase = (SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY)
  ? createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)
  : null;

/**
 * POST /api/v1/me/sync
 * Sync Google user data to app_users and basic_profiles tables
 * This is called on first load after Google OAuth to persist user data
 */
router.post('/sync', async (req, res) => {
  try {
    const user_id = req.user?.id;
    
    if (!user_id) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    // Demo mode only for local development
    if (req.user?.mode === 'demo') {
      return res.status(400).json({ error: 'Demo mode not available in production' });
    }

    if (!supabase) {
      return res.status(500).json({ error: 'Database not configured' });
    }

    const { given_name, family_name, locale, timezone } = req.body;

    // Get user data from JWT claims (passed from frontend)
    const user_email = req.user?.email;
    const user_display_name = req.user?.name;
    const user_avatar_url = req.user?.picture;
    const user_provider = req.user?.provider || 'google';

    if (!user_email) {
      return res.status(400).json({ error: 'Email required for user sync' });
    }

    // Upsert app_users table
    const { data: appUser, error: appUserError } = await supabase
      .from('app_users')
      .upsert({
        id: user_id,
        email: user_email,
        display_name: user_display_name,
        avatar_url: user_avatar_url,
        provider: user_provider,
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'id'
      })
      .select()
      .single();

    if (appUserError) {
      console.error('Error upserting app_users:', appUserError);
      return res.status(500).json({ error: 'Failed to sync user data' });
    }

    // Upsert basic_profiles table
    const { data: profile, error: profileError } = await supabase
      .from('basic_profiles')
      .upsert({
        user_id: user_id,
        given_name: given_name || null,
        family_name: family_name || null,
        locale: locale || null,
        timezone: timezone || null,
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'user_id'
      })
      .select()
      .single();

    if (profileError) {
      console.error('Error upserting basic_profiles:', profileError);
      return res.status(500).json({ error: 'Failed to sync profile data' });
    }

    console.log(`✅ User sync completed for ${user_email}`);

    res.json({ 
      ok: true,
      user: {
        id: appUser.id,
        email: appUser.email,
        display_name: appUser.display_name,
        avatar_url: appUser.avatar_url,
        provider: appUser.provider
      },
      profile: {
        given_name: profile.given_name,
        family_name: profile.family_name,
        locale: profile.locale,
        timezone: profile.timezone
      }
    });

  } catch (error) {
    console.error('User sync error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
