# MindSphere - AI-Powered Mental Wellness Platform

> A comprehensive mental wellness platform with voice interactions, AI-powered sessions, and personalized content delivery.

## 🏗️ Architecture Overview

MindSphere is built as a microservices architecture with four main components:

```
mindsphere/
├── mindsphere-backend/     # Node.js API server
├── mindsphere-frontend/    # React + Vite web app
├── mindsphere-ai-agent/    # LiveKit voice agent
└── mindsphere-mobile/      # React Native mobile app
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Supabase account
- OpenAI API key
- LiveKit account

### 1. Clone and Setup
```bash
git clone <repository-url>
cd mindsphere
```

### 2. Environment Configuration
Each service has its own `.env` file. Copy from examples:

```bash
# Backend
cd mindsphere-backend && cp env.example .env

# Frontend  
cd ../mindsphere-frontend && cp env.example .env

# AI Agent
cd ../mindsphere-ai-agent && cp env.example .env
```

### 3. Install Dependencies
```bash
# Install all dependencies
npm install

# Or install individually
cd mindsphere-backend && npm install
cd ../mindsphere-frontend && npm install
cd ../mindsphere-ai-agent && npm install
cd ../mindsphere-mobile && npm install
```

### 4. Start Development Servers
```bash
# Start all services
./start-local.sh

# Or start individually
npm run start:backend    # http://localhost:8000
npm run start:frontend   # http://localhost:5173
npm run start:agent      # Voice agent
```

## 📁 Project Structure

### Backend (`mindsphere-backend/`)
- **Framework**: Node.js + Express
- **Database**: Supabase (PostgreSQL)
- **AI**: OpenAI GPT-4, Google Cloud TTS
- **Voice**: LiveKit integration
- **Port**: 8000

**Key Features:**
- RESTful API endpoints
- User authentication & profiles
- Session management
- Voice token generation
- Music library management
- Journal & notes system

### Frontend (`mindsphere-frontend/`)
- **Framework**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **State**: Context API + Custom hooks
- **Port**: 5173

**Key Features:**
- Responsive web interface
- Voice interaction UI
- Session management
- User dashboard
- Real-time updates

### AI Agent (`mindsphere-ai-agent/`)
- **Framework**: Node.js + TypeScript
- **Voice**: LiveKit
- **AI**: OpenAI GPT-4
- **Port**: 3000

**Key Features:**
- Real-time voice processing
- AI conversation handling
- Session state management
- Voice synthesis

### Mobile (`mindsphere-mobile/`)
- **Framework**: React Native + Expo
- **Platform**: iOS/Android
- **Architecture**: WebView-based

**Key Features:**
- Cross-platform mobile app
- WebView integration
- Native device features

## 🔧 Development

### Available Scripts
```bash
# Global scripts (from root)
npm start                 # Start all services
npm run start:local       # Start local development
npm run start:backend     # Start backend only
npm run start:frontend    # Start frontend only
npm run start:agent       # Start AI agent only
npm run build:backend     # Build backend
npm run build:frontend    # Build frontend
npm test                  # Run all tests
npm run clean             # Clean node_modules

# Git management scripts
npm run git:setup         # Setup all Git repositories
npm run git:status        # Check status across all services
npm run git:add "files"   # Add files to all services
npm run git:commit "msg"  # Commit changes across all services
npm run git:push          # Push changes to all services
npm run git:feature "name" # Create feature branch
npm run git:sync          # Pull and push changes
```

### Environment Variables

#### Backend (.env)
```env
# Server
PORT=8000
NODE_ENV=development
FRONTEND_ORIGIN=http://localhost:5173

# Supabase
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_service_key
SUPABASE_ANON_KEY=your_anon_key

# OpenAI
OPENAI_API_KEY=your_openai_key

# LiveKit
LIVEKIT_URL=your_livekit_url
LIVEKIT_API_KEY=your_api_key
LIVEKIT_API_SECRET=your_api_secret

# Google Cloud TTS
GOOGLE_APPLICATION_CREDENTIALS_BASE64=your_credentials

# ElevenLabs (optional)
ELEVEN_API_KEY=your_eleven_key
ELEVEN_VOICE_ID=your_voice_id
```

#### Frontend (.env)
```env
# Supabase
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_anon_key

# Backend API
VITE_API_BASE_URL=http://localhost:8000

# LiveKit
VITE_LIVEKIT_URL=your_livekit_url
```

## 🔄 Git Workflow

### Multi-Repository Architecture
MindSphere uses **separated microservices** with individual Git repositories:

- **mindsphere-backend** → `https://github.com/yourusername/mindsphere-backend`
- **mindsphere-frontend** → `https://github.com/yourusername/mindsphere-frontend`
- **mindsphere-ai-agent** → `https://github.com/yourusername/mindsphere-ai-agent`
- **mindsphere-mobile** → `https://github.com/yourusername/mindsphere-mobile`

### Quick Git Setup
```bash
# Setup all repositories with remote origins
npm run git:setup

# Update remote URLs with your GitHub username
./setup-git-repos.sh update-remotes yourusername
```

### Daily Git Operations
```bash
# Quick push to all repositories
npm run push "feat: add user authentication"

# Check status across all services
npm run git:status

# Add files to all services
npm run git:add "src/"

# Commit changes with conventional commits
npm run git:commit "feat: add user authentication"

# Push changes
npm run git:push

# Create feature branch
npm run git:feature "voice-interface"

# Sync (pull + push)
npm run git:sync
```

### Commit Convention
- `feat:` - New features
- `fix:` - Bug fixes
- `docs:` - Documentation changes
- `refactor:` - Code refactoring
- `test:` - Test additions/changes
- `chore:` - Maintenance tasks

### Cross-Service Changes
When changes affect multiple services:
1. Document affected services in commit messages
2. Update API contracts in both services simultaneously
3. Coordinate deployments across affected services
4. Use correlation IDs to track changes

## 🚀 Deployment

### Production URLs
- **Frontend**: [Vercel](https://vercel.com) - `https://mindsphere.vercel.app`
- **Backend**: [Railway](https://railway.app) - `https://mindsphere-backend.railway.app`
- **AI Agent**: [Railway](https://railway.app) - `https://mindsphere-agent.railway.app`

### Deployment Commands
```bash
# Frontend (Vercel)
cd mindsphere-frontend
vercel --prod

# Backend (Railway)
cd mindsphere-backend
railway up

# AI Agent (Railway)
cd mindsphere-ai-agent
railway up
```

## 🧪 Testing

```bash
# Run all tests
npm test

# Run specific service tests
cd mindsphere-backend && npm test
cd ../mindsphere-frontend && npm test
```

## 📚 Documentation

- [Backend API Docs](./mindsphere-backend/README.md)
- [Frontend Docs](./mindsphere-frontend/README.md)
- [AI Agent Docs](./mindsphere-ai-agent/README.md)
- [Mobile App Docs](./mindsphere-mobile/README.md)

## 📋 Coding Standards

### Core Principles
- **Plan first, then code** - Never start coding without a written plan
- **Service-first thinking** - Always consider which services are affected
- **No fallback/mock data** - Use real services or fail fast with clear errors
- **Structured logging only** - No console.*, use structured logger with context
- **Performance budget minded** - Measure before adding caches/dependencies

### Error Handling
- **Fail fast with clear error messages** - No fallback data
- **Comprehensive error logging** with correlation IDs
- **Service-specific error tracking**
- **Environment-aware logging levels**

### Git Workflow
- **One service per repository** - never mix service code
- **Conventional commits** - `feat:`, `fix:`, `docs:`, `refactor:`, `test:`, `chore:`
- **Feature branches** for all changes
- **Cross-service coordination** for multi-service changes

### Testing Requirements
- **Unit tests** for new logic branches and bug fixes
- **Integration tests** for service-specific functionality
- **Cross-service testing** for changes affecting multiple services
- **Real service integrations** in tests (no mocking)

## 🤝 Contributing

1. Follow the [Global Coding Instructions](.cursorrules)
2. Plan first, then code
3. Use MCP tools for evidence gathering
4. Write tests for new features
5. Update documentation
6. Follow the multi-repository Git workflow

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

## 🆘 Support

For issues and questions:
1. Check the troubleshooting guides in each service
2. Review the [Global Coding Instructions](.cursorrules)
3. Create an issue with detailed information

---

**Built with ❤️ for mental wellness**