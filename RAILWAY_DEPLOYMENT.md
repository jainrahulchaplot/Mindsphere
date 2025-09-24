# Railway Deployment Guide for MindSphere Backend

## 🚀 Quick Setup

### 1. Connect to Railway
1. Go to [Railway.app](https://railway.app)
2. Sign in with your GitHub account
3. Click "New Project"
4. Select "Deploy from GitHub repo"
5. Choose your `jainrahulchaplot/Mindsphere` repository

### 2. Configure Deployment Settings
- **Root Directory**: Leave empty (Railway will auto-detect)
- **Build Command**: `cd backend && npm install`
- **Start Command**: `cd backend && node src/index.js`
- **Port**: Railway will auto-assign (use `process.env.PORT`)

### 3. Set Environment Variables
In Railway dashboard, go to your project → Variables tab and add:

```env
# OpenAI API
OPENAI_API_KEY=your_openai_api_key_here

# Supabase Database (your existing database will work!)
SUPABASE_URL=your_supabase_url_here
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key_here

# Google Cloud TTS
GOOGLE_APPLICATION_CREDENTIALS=path/to/service-account.json
TTS_PROVIDER=cloud_tts
CLOUD_TTS_VOICE=en-US-Studio-O
CLOUD_TTS_RATE=0.85
CLOUD_TTS_PITCH=-2.0

# CORS for Vercel Frontend
FRONTEND_ORIGIN=https://your-vercel-app.vercel.app

# Server Configuration
NODE_ENV=production
```

### 4. Deploy
1. Click "Deploy" in Railway dashboard
2. Wait for build to complete (2-3 minutes)
3. Railway will provide your backend URL (e.g., `https://your-app.railway.app`)

### 5. Update Frontend
Update your Vercel frontend environment variables:
```env
VITE_API_BASE_URL=https://your-app.railway.app
```

## 🗄️ Database Compatibility

**✅ Your Supabase database will work perfectly!**

- **No changes needed** - Your existing Supabase database will continue working
- **Same connection** - Use the same `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY`
- **All data preserved** - Sessions, users, notes, memories, etc. will all be accessible
- **Vector search** - pgvector functionality will work seamlessly

## 🔧 Railway Configuration Files

### railway.json
```json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "startCommand": "cd backend && node src/index.js",
    "healthcheckPath": "/health",
    "healthcheckTimeout": 100,
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
```

### Dockerfile (in backend/)
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 8000
CMD ["node", "src/index.js"]
```

## 🧪 Testing Deployment

### Health Check
```bash
curl https://your-app.railway.app/health
# Should return: {"status":"ok","ts":"2025-09-24T..."}
```

### API Test
```bash
curl https://your-app.railway.app/api/v1/usage/daily?user_id=test-user
# Should return usage data
```

## 🔄 Deployment Process

1. **Push to GitHub** - Your code is already pushed
2. **Railway auto-deploys** - When you push to main branch
3. **Environment variables** - Set in Railway dashboard
4. **Health checks** - Railway monitors `/health` endpoint
5. **Auto-restart** - If app crashes, Railway restarts it

## 🚨 Troubleshooting

### Build Issues
- Check Railway logs in dashboard
- Ensure all dependencies are in `package.json`
- Verify Node.js version (18+)

### Runtime Issues
- Check environment variables are set correctly
- Verify Supabase connection
- Check Google Cloud TTS credentials

### CORS Issues
- Update `FRONTEND_ORIGIN` to your Vercel domain
- Ensure Vercel domain is correct

## 📊 Monitoring

Railway provides:
- **Real-time logs** - View in dashboard
- **Metrics** - CPU, memory, network usage
- **Health checks** - Automatic monitoring
- **Deployments** - History of all deployments

## 🔐 Security

- **Environment variables** - Securely stored in Railway
- **HTTPS** - Automatic SSL certificates
- **CORS** - Configured for your Vercel domain
- **Database** - Supabase handles securit

## 🎯 Next Steps

1. **Deploy to Railway** - Follow steps
2. **Test endpoints** - Verify API is working
3. **Update Vercel** - Point frontend to Railway backend
4. **Monitor** - Check Railway dashboard for issues

Your MindSphere app will be fully deployed with:
- ✅ Frontend on Vercel
- ✅ Backend on Railway  
- ✅ Database on Supabase
- ✅ All features working seamlessly
