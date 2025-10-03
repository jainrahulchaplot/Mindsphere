# 🚀 MindSphere Monorepo Deployment

## Structure
- `mindsphere-frontend/` → Vercel
- `mindsphere-backend/` → Railway
- `mindsphere-ai-agent/` → LiveKit Voice Agent
- `mindsphere-mobile/` → React Native Mobile App

## Vercel Setup (Frontend)
1. Settings → Root Directory: `mindsphere-frontend`
2. Build Command: `npm install && npm run build`
3. Output Directory: `dist`

## Railway Setup (Backend)
1. Settings → Root Directory: `mindsphere-backend`
2. Auto-detects Dockerfile
3. Healthcheck Path: `/health`

## Environment Variables

### Frontend (Vercel)
```
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
VITE_API_BASE_URL=
VITE_LIVEKIT_URL=
```

### Backend (Railway)
```
SUPABASE_URL=
SUPABASE_SERVICE_KEY=
OPENAI_API_KEY=
LIVEKIT_API_KEY=
LIVEKIT_API_SECRET=
PORT=8000
NODE_ENV=production
```

## Local Development
```bash
npm start              # Start all services
npm run start:backend  # Backend only
npm run start:frontend # Frontend only
```

