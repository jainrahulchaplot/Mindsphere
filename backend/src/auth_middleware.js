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
 * - If SUPABASE_AUTH_ENABLED=true: expects Authorization: Bearer <jwt>; verifies and sets req.user = { id, email, ... }
 * - Else: DEMO mode, sets req.user = { id: DEMO_USER_ID }
 * - Graceful fallback: If JWT verification fails, falls back to demo mode instead of crashing
 */
async function attachUser(req, res, next) {
  if (!SUPABASE_AUTH_ENABLED) {
    req.user = { id: DEMO_USER_ID, mode: 'demo' };
    return next();
  }

  // Try to get JWT token from Authorization header
  const auth = req.headers.authorization || '';
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : null;
  
  // If no token provided, fall back to demo mode (don't crash)
  if (!token) {
    console.log('🔍 No JWT token provided, falling back to demo mode');
    req.user = { id: DEMO_USER_ID, mode: 'demo' };
    return next();
  }

  try {
    const jwks = getJwks();
    if (!jwks) {
      console.log('🔍 JWKS not available, falling back to demo mode');
      req.user = { id: DEMO_USER_ID, mode: 'demo' };
      return next();
    }

    const { payload } = await jwtVerify(token, jwks, {
      issuer: `${SUPABASE_URL}/auth/v1`,
      audience: SUPABASE_URL
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
    console.log('🔍 JWT verification failed, falling back to demo mode:', e.message);
    req.user = { id: DEMO_USER_ID, mode: 'demo' };
    next();
  }
}

module.exports = {
  attachUser
};
