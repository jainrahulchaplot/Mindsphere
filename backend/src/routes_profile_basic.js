const express = require('express');
const { createClient } = require('@supabase/supabase-js');
const { SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, DEMO_USER_ID } = require('./config.js');

const router = express.Router();

// Initialize Supabase client
const supabase = (SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY)
  ? createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)
  : null;

/**
 * GET /api/v1/profile/basic
 * Get user's basic profile data
 */
router.get('/basic', async (req, res) => {
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

    // Get user data from app_users
    const { data: user, error: userError } = await supabase
      .from('app_users')
      .select('id, email, display_name, avatar_url, provider, created_at, updated_at')
      .eq('id', user_id)
      .single();

    if (userError) {
      console.error('Error fetching user:', userError);
      return res.status(404).json({ error: 'User not found' });
    }

    // Get profile data from basic_profiles
    const { data: profile, error: profileError } = await supabase
      .from('basic_profiles')
      .select('given_name, family_name, locale, timezone, updated_at')
      .eq('user_id', user_id)
      .single();

    // Profile might not exist yet (first time user)
    const profileData = profile || {
      given_name: null,
      family_name: null,
      locale: null,
      timezone: null,
      updated_at: null
    };

    res.json({
      user: {
        id: user.id,
        email: user.email,
        display_name: user.display_name,
        avatar_url: user.avatar_url,
        provider: user.provider,
        created_at: user.created_at,
        updated_at: user.updated_at
      },
      profile: profileData
    });

  } catch (error) {
    console.error('Profile fetch error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * PUT /api/v1/profile/basic
 * Update user's basic profile data
 */
router.put('/basic', async (req, res) => {
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

    // Validate required fields
    if (!given_name && !family_name && !locale && !timezone) {
      return res.status(400).json({ error: 'At least one field required' });
    }

    // Update basic_profiles table
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
      console.error('Error updating profile:', profileError);
      return res.status(500).json({ error: 'Failed to update profile' });
    }

    console.log(`✅ Profile updated for user ${user_id}`);

    res.json({ 
      ok: true,
      profile: {
        given_name: profile.given_name,
        family_name: profile.family_name,
        locale: profile.locale,
        timezone: profile.timezone,
        updated_at: profile.updated_at
      }
    });

  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
