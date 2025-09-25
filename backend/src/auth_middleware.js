const { createRemoteJWKSet, jwtVerify } = require('jose');
const { SUPABASE_URL, SUPABASE_AUTH_ENABLED, DEMO_USER_ID } = require('./config.js');

let JWKS = null;
function getJwks() {
  if (!JWKS) {
    if (!SUPABASE_URL) {
      console.warn('⚠️ SUPABASE_URL missing, JWT verification will fail');
      return null;
    }
    try {
      JWKS = createRemoteJWKSet(new URL(`${SUPABASE_URL}/auth/v1/keys`));
    } catch (error) {
      console.error('❌ Failed to create JWKS:', error.message);
      return null;
    }
  }
  return JWKS;
}

/**
 * attachUser middleware:
 * - Production: Requires valid JWT token, returns 401 if missing/invalid
 * - Local development: Falls back to demo mode if SUPABASE_AUTH_ENABLED=false
 */
async function attachUser(req, res, next) {
  // Local development fallback
  if (!SUPABASE_AUTH_ENABLED) {
    console.log('🔍 Development mode: Using demo user');
    req.user = { id: DEMO_USER_ID, mode: 'demo' };
    return next();
  }

  // Production: Require valid JWT token
  const auth = req.headers.authorization || '';
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : null;
  
  if (!token) {
    console.log('🔍 No JWT token provided');
    return res.status(401).json({ error: 'Authentication required' });
  }

  try {
    const jwks = getJwks();
    if (!jwks) {
      console.error('❌ JWKS not available');
      return res.status(500).json({ error: 'Authentication service unavailable' });
    }

    const { payload } = await jwtVerify(token, jwks, {
      issuer: `https://ylrrlzwphuktzocwjjin.supabase.co/auth/v1`,
      audience: 'authenticated'
    });

    // Payload claims: sub (user id), email, user_metadata, etc.
    req.user = {
      id: payload.sub,
      email: payload.email,
      name: payload.user_metadata?.name || payload.name,
      picture: payload.user_metadata?.avatar_url || payload.picture,
      provider: payload.app_metadata?.provider || 'google'
    };
    console.log('🔍 JWT verified, user_id:', payload.sub);
    next();
  } catch (e) {
    console.log('🔍 JWT verification failed:', e.message);
    return res.status(401).json({ error: 'Invalid authentication token' });
  }
}

module.exports = {
  attachUser
};
