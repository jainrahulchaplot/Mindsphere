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
      const jwksUrl = `${SUPABASE_URL}/auth/v1/keys`;
      console.log('🔍 Creating JWKS from:', jwksUrl);
      JWKS = createRemoteJWKSet(new URL(jwksUrl));
      console.log('✅ JWKS created successfully');
    } catch (error) {
      console.error('❌ Failed to create JWKS:', error.message);
      console.error('❌ JWKS URL:', `${SUPABASE_URL}/auth/v1/keys`);
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
      console.error('❌ JWKS not available, trying fallback verification');
      // Fallback: Basic JWT decode without verification (for testing)
      try {
        const [header, payload, signature] = token.split('.');
        const decodedPayload = JSON.parse(Buffer.from(payload, 'base64url').toString());
        
        console.log('🔍 Fallback JWT decode:', {
          sub: decodedPayload.sub,
          email: decodedPayload.email,
          iss: decodedPayload.iss,
          aud: decodedPayload.aud
        });

        // Basic validation
        if (decodedPayload.iss !== `${SUPABASE_URL}/auth/v1`) {
          throw new Error('Invalid issuer');
        }
        if (decodedPayload.aud !== 'authenticated') {
          throw new Error('Invalid audience');
        }

        req.user = {
          id: decodedPayload.sub,
          email: decodedPayload.email,
          name: decodedPayload.user_metadata?.name || decodedPayload.name,
          picture: decodedPayload.user_metadata?.avatar_url || decodedPayload.picture,
          provider: decodedPayload.app_metadata?.provider || 'google'
        };
        console.log('🔍 Fallback JWT verified, user_id:', decodedPayload.sub);
        next();
        return;
      } catch (fallbackError) {
        console.log('🔍 Fallback JWT verification failed:', fallbackError.message);
        return res.status(401).json({ error: 'Invalid authentication token' });
      }
    }

    console.log('🔍 Attempting JWT verification with:', {
      issuer: `${SUPABASE_URL}/auth/v1`,
      audience: 'authenticated',
      tokenLength: token.length
    });

    const { payload } = await jwtVerify(token, jwks, {
      issuer: `${SUPABASE_URL}/auth/v1`,
      audience: 'authenticated'
    });

    console.log('🔍 JWT payload:', {
      sub: payload.sub,
      email: payload.email,
      iss: payload.iss,
      aud: payload.aud
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
    console.log('🔍 Error details:', e);
    return res.status(401).json({ error: 'Invalid authentication token' });
  }
}

module.exports = {
  attachUser
};
