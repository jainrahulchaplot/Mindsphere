# MindSphere - Multi-Service Architecture

A comprehensive mental wellness platform with separate microservices for backend, frontend, AI agent, and mobile applications.

## 🏗️ Architecture

This repository contains 4 separate services:

- **`mindsphere-backend/`** - Node.js API server (Railway deployment)
- **`mindsphere-frontend/`** - React web application (Vercel deployment)  
- **`mindsphere-ai-agent/`** - LiveKit voice agent (Railway deployment)
- **`mindsphere-mobile/`** - React Native mobile app (Expo)

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn
- Git

### Local Development

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd mindsphere-v1-separated
   ```

2. **Install dependencies for all services:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   - Copy `env.example` to `.env` in each service directory
   - Fill in your API keys and configuration

4. **Start all services:**
   ```bash
   npm run start:local
   ```

### Individual Service Commands

```bash
# Backend (API Server)
cd mindsphere-backend && npm start

# Frontend (Web App)
cd mindsphere-frontend && npm run dev

# AI Agent (Voice Processing)
cd mindsphere-ai-agent && npm start

# Mobile (React Native)
cd mindsphere-mobile && npm start
```

## 📁 Service Details

### Backend Service (`mindsphere-backend/`)
- **Technology:** Node.js, Express, Supabase
- **Deployment:** Railway
- **Port:** 3001
- **Features:** API endpoints, database operations, authentication

### Frontend Service (`mindsphere-frontend/`)
- **Technology:** React, Vite, TypeScript
- **Deployment:** Vercel
- **Port:** 3000
- **Features:** User interface, state management, real-time updates

### AI Agent Service (`mindsphere-ai-agent/`)
- **Technology:** LiveKit, OpenAI GPT-4
- **Deployment:** Railway
- **Features:** Voice processing, real-time conversations, session management

### Mobile Service (`mindsphere-mobile/`)
- **Technology:** React Native, Expo
- **Features:** Native mobile app, offline capabilities, push notifications

## 🔧 Development

### Git Workflow
Each service has its own Git repository. Use the provided scripts for multi-repo management:

```bash
# Check status of all repositories
npm run git:status

# Add changes to all repositories
npm run git:add

# Commit changes to all repositories
npm run git:commit "your commit message"

# Push changes to all repositories
npm run git:push

# Create feature branch in all repositories
npm run git:feature "feature-name"
```

### Coding Standards
- Follow the guidelines in `.cursorrules`
- Use structured logging (no console.*)
- No fallback/mock data - fail fast
- Plan first, then code
- Service-first architecture

## 🌐 Deployment

### Production URLs
- **Frontend:** https://mindsphere-frontend.vercel.app
- **Backend:** https://mindsphere-backend.railway.app
- **AI Agent:** https://mindsphere-ai-agent.railway.app

### Environment Variables
Each service requires specific environment variables. See individual `env.example` files for details.

## 📚 Documentation

- **Coding Standards:** `.cursorrules`
- **Service-specific docs:** See individual service README files
- **API Documentation:** Available in backend service

## 🤝 Contributing

1. Follow the coding standards in `.cursorrules`
2. Use the multi-repo Git workflow
3. Test changes across all affected services
4. Update documentation as needed

## 📄 License

Private - All rights reserved
