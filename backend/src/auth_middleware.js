const { createRemoteJWKSet, jwtVerify } = require('jose');
const { SUPABASE_URL, SUPABASE_AUTH_ENABLED, DEMO_USER_ID } = require('./config.js');

let JWKS = null;
function getJwks() {
  if (!JWKS) {
    if (!SUPABASE_URL) throw new Error('SUPABASE_URL missing');
    JWKS = createRemoteJWKSet(new URL(`${SUPABASE_URL}/auth/v1/keys`));
  }
  return JWKS;
}

/**
 * attachUser middleware:
 * - If SUPABASE_AUTH_ENABLED=true: expects Authorization: Bearer <jwt>; verifies and sets req.user = { id, email, ... }
 * - Else: DEMO mode, sets req.user = { id: DEMO_USER_ID }
 */
async function attachUser(req, res, next) {
  if (!SUPABASE_AUTH_ENABLED) {
    req.user = { id: DEMO_USER_ID, mode: 'demo' };
    return next();
  }
  try {
    const auth = req.headers.authorization || '';
    const token = auth.startsWith('Bearer ') ? auth.slice(7) : null;
    if (!token) return res.status(401).json({ error: 'missing_token' });

    const { payload } = await jwtVerify(token, getJwks(), {
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
    next();
  } catch (e) {
    console.error('JWT verify failed', e);
    return res.status(401).json({ error: 'invalid_token' });
  }
}

module.exports = {
  attachUser
};
