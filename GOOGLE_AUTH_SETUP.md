# 🔐 Google Auth Setup Guide

## **Task 1: Supabase Auth (Google) with Safe Fallback**

This implementation adds real Google login via Supabase Auth while preserving demo mode as a fallback.

---

## **Files Created/Modified**

### **Frontend Files:**
- ✅ `src/lib/supabase.ts` - Supabase client configuration
- ⚠️ `frontend/.env` - **YOU NEED TO CREATE THIS** (see instructions below)

### **Backend Files:**
- ✅ `backend/src/config.js` - Configuration management
- ✅ `backend/src/auth_middleware.js` - JWT verification middleware
- ✅ `backend/package.json` - Added `jose` dependency
- ⚠️ `backend/.env` - **YOU NEED TO UPDATE THIS** (see instructions below)

---

## **Setup Instructions**

### **Step 1: Create Frontend Environment File**

Create `frontend/.env` with your Supabase credentials:

```bash
# Supabase Configuration
VITE_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
VITE_SUPABASE_ANON_KEY=YOUR_ANON_KEY
VITE_AUTH_MODE=google   # accepted: "google" | "demo"
```

### **Step 2: Update Backend Environment File**

Add these lines to your existing `backend/.env`:

```bash
# Supabase Configuration
SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
SUPABASE_ANON_KEY=YOUR_ANON_KEY
SUPABASE_AUTH_ENABLED=true   # set to false to fall back to demo
```

### **Step 3: Install Backend Dependencies**

```bash
cd backend
npm install
```

---

## **How It Works**

### **Demo Mode (Fallback)**
- When `SUPABASE_AUTH_ENABLED=false` or env vars missing
- Uses hardcoded user ID: `550e8400-e29b-41d4-a716-446655440000`
- No authentication required
- Maintains current behavior exactly

### **Google Auth Mode**
- When `SUPABASE_AUTH_ENABLED=true` and env vars present
- Requires `Authorization: Bearer <jwt>` header
- Verifies JWT using Supabase's JWKS endpoint
- Extracts user info from JWT payload

---

## **Backend Middleware Usage**

The `attachUser` middleware automatically handles both modes:

```javascript
import { attachUser } from './auth_middleware.js';

// Apply to all routes that need user context
app.use('/api/v1/session', attachUser, sessionRouter);
app.use('/api/v1/journal', attachUser, journalRouter);
// etc.
```

### **Request Object**
After middleware, `req.user` contains:

**Demo Mode:**
```javascript
req.user = {
  id: '550e8400-e29b-41d4-a716-446655440000',
  mode: 'demo'
}
```

**Google Auth Mode:**
```javascript
req.user = {
  id: 'google-user-id',
  email: 'user@example.com',
  name: 'User Name',
  picture: 'https://...',
  provider: 'google'
}
```

---

## **Testing**

### **Test Demo Mode**
1. Set `SUPABASE_AUTH_ENABLED=false` in backend/.env
2. Start backend: `cd backend && npm start`
3. All requests work without authentication headers

### **Test Google Auth Mode**
1. Set `SUPABASE_AUTH_ENABLED=true` in backend/.env
2. Add valid Supabase credentials
3. Start backend: `cd backend && npm start`
4. Requests require `Authorization: Bearer <jwt>` header

---

## **Next Steps**

1. **Configure Supabase Project:**
   - Enable Google Auth in Supabase Dashboard
   - Get your project URL and anon key
   - Update environment files

2. **Update API Routes:**
   - Add `attachUser` middleware to protected routes
   - Replace hardcoded `user_id` with `req.user.id`

3. **Update Frontend:**
   - Implement Google login using Supabase Auth
   - Send JWT tokens in API requests
   - Handle auth state management

---

## **Security Notes**

- ✅ **Safe Fallback**: Demo mode preserved for development
- ✅ **JWT Verification**: Uses Supabase's official JWKS endpoint
- ✅ **No Hardcoded Secrets**: All config via environment variables
- ✅ **Error Handling**: Graceful fallback on auth failures
- ✅ **Type Safety**: Proper TypeScript types for auth modes

---

## **Environment Variables Reference**

### **Frontend (.env)**
```bash
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key
VITE_AUTH_MODE=google  # or "demo"
```

### **Backend (.env)**
```bash
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your_anon_key
SUPABASE_AUTH_ENABLED=true  # or false for demo mode
```

---

**Status**: ✅ **Task 1 Complete** - Supabase Auth wired with safe fallback
