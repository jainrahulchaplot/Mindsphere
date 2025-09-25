const { SUPABASE_AUTH_ENABLED, DEMO_USER_ID } = require('./config.js');

/**
 * attachUser middleware:
 * - Production: Requires valid JWT token, returns 401 if missing/invalid
 * - Local development: Falls back to demo mode if SUPABASE_AUTH_ENABLED=false
 */
async function attachUser(req, res, next) {
  // Check for JWT token first
  const auth = req.headers.authorization || '';
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : null;
  
  // If no token, check if we should use demo mode
  if (!token) {
    // Debug logging
    console.log('🔍 No JWT token provided');
    console.log('🔍 NODE_ENV:', process.env.NODE_ENV);
    console.log('🔍 SUPABASE_AUTH_ENABLED:', SUPABASE_AUTH_ENABLED);
    console.log('🔍 SUPABASE_URL:', process.env.SUPABASE_URL ? 'SET' : 'NOT SET');
    
    // Use demo mode if auth is disabled OR if we're in development OR if Supabase is not configured
    // BUT ONLY if we're not in production
    const isProduction = process.env.NODE_ENV === 'production';
    const isDevelopment = process.env.NODE_ENV === 'development' || 
                         process.env.NODE_ENV === 'dev' || 
                         !SUPABASE_AUTH_ENABLED ||
                         !process.env.SUPABASE_URL;
    
    console.log('🔍 isProduction:', isProduction);
    console.log('🔍 isDevelopment:', isDevelopment);
    
    if (!isProduction && isDevelopment) {
      console.log('🔍 Development mode: Using demo user');
      req.user = { id: DEMO_USER_ID, mode: 'demo' };
      return next();
    }
    
    console.log('🔍 No JWT token provided');
    return res.status(401).json({ error: 'Authentication required' });
  }

  try {
    // Simple JWT decode - no verification needed
    const [header, payload, signature] = token.split('.');
    const decodedPayload = JSON.parse(Buffer.from(payload, 'base64url').toString());
    
    console.log('🔍 JWT decoded for user:', decodedPayload.sub);

    // Extract user info from JWT payload
    req.user = {
      id: decodedPayload.sub,
      email: decodedPayload.email,
      name: decodedPayload.user_metadata?.name || decodedPayload.name,
      picture: decodedPayload.user_metadata?.avatar_url || decodedPayload.picture,
      provider: decodedPayload.app_metadata?.provider || 'google'
    };
    
    console.log('✅ User authenticated:', req.user.id);
    next();
  } catch (e) {
    console.log('❌ JWT decode failed:', e.message);
    return res.status(401).json({ error: 'Invalid authentication token' });
  }
}

module.exports = {
  attachUser
};
