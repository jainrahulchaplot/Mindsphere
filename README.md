# MindSphere - Separated Repositories

> AI-powered meditation and sleep stories platform with separated service architecture

[![React](https://img.shields.io/badge/React-18.3.1-blue.svg)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-18.0.0-green.svg)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5.3-blue.svg)](https://www.typescriptlang.org/)

---

## 🏗️ Repository Structure

This project has been separated into independent, focused repositories:

```
Mindsphere V1 Separated/
├── mindsphere-frontend/      # React + Vite frontend
├── mindsphere-backend/       # Express API server
├── mindsphere-ai-agent/      # LiveKit voice agent
├── mindsphere-mobile/        # React Native app
└── start-all.sh              # Start all services
```

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or pnpm
- PostgreSQL (Supabase)
- LiveKit account (for voice features)

### Installation

```bash
# Navigate to the separated directory
cd "Mindsphere V1 Separated"

# Install all dependencies (run once)
cd mindsphere-frontend && npm install && cd ..
cd mindsphere-backend && npm install && cd ..
cd mindsphere-ai-agent && npm install && cd ..
```

### Environment Setup

1. **Backend** (`mindsphere-backend/.env`):
   ```bash
   cd mindsphere-backend
   cp env.example .env
   # Edit .env with your credentials
   ```

2. **Frontend** (`mindsphere-frontend/.env`):
   ```bash
   cd mindsphere-frontend
   cp env.example .env
   # Edit .env with your credentials
   ```

3. **AI Agent** (`mindsphere-ai-agent/.env`):
   ```bash
   cd mindsphere-ai-agent
   cp env.example .env
   # Edit .env with your credentials
   ```

### Start All Services

```bash
# From the root directory
./start-all.sh
```

Or start individually:

```bash
# Terminal 1 - Backend
cd mindsphere-backend
npm start

# Terminal 2 - Frontend
cd mindsphere-frontend
npm run dev

# Terminal 3 - AI Agent (optional)
cd mindsphere-ai-agent
npm start
```

### Access

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:8000
- **API Health**: http://localhost:8000/health

---

## 📦 Repository Details

### 1. Frontend (`mindsphere-frontend/`)

**Tech Stack**: React 18, TypeScript, Vite, Tailwind CSS, React Query

**Purpose**: User interface for meditation sessions, journaling, and voice interactions

**Key Features**:
- Session creation and playback
- Real-time voice agent integration
- Habit tracking and streaks
- Journal with AI emotion analysis
- Responsive design

**Port**: 5173

[📚 Frontend README](./mindsphere-frontend/README.md)

### 2. Backend (`mindsphere-backend/`)

**Tech Stack**: Node.js, Express, OpenAI, Google Cloud TTS, Supabase

**Purpose**: RESTful API for content generation, data management, and authentication

**Key Features**:
- AI content generation (meditation scripts, sleep stories)
- Premium TTS audio generation
- Vector search (memories, sessions)
- User authentication and profiles
- Analytics and usage tracking

**Port**: 8000

[📚 Backend README](./mindsphere-backend/README.md)

### 3. AI Agent (`mindsphere-ai-agent/`)

**Tech Stack**: LiveKit, OpenAI Realtime API, TypeScript

**Purpose**: Real-time voice conversations with memory-based personalization

**Key Features**:
- Natural voice interactions
- Memory-based context loading
- Background noise cancellation
- Automatic room management

[📚 AI Agent README](./mindsphere-ai-agent/README.md)

### 4. Mobile (`mindsphere-mobile/`)

**Tech Stack**: React Native, TypeScript, Expo

**Purpose**: Native mobile app with WebView integration

[📚 Mobile README](./mindsphere-mobile/README.md)

---

## 🔄 Development Workflow

### Working on Frontend

```bash
cd mindsphere-frontend
npm run dev
```

Changes will hot-reload automatically.

### Working on Backend

```bash
cd mindsphere-backend
npm run dev
```

The server will restart on file changes (if nodemon is configured).

### Working on AI Agent

```bash
cd mindsphere-ai-agent
npm run dev
```

---

## 🧪 Testing

### Frontend Tests

```bash
cd mindsphere-frontend
npm test
npm run test:coverage
```

### Backend Tests

```bash
cd mindsphere-backend
npm test
npm run test:coverage
```

---

## 🚢 Deployment

### Frontend (Vercel)

```bash
cd mindsphere-frontend
vercel --prod
```

### Backend (Railway)

```bash
cd mindsphere-backend
railway up
```

### AI Agent (Railway/Render)

```bash
cd mindsphere-ai-agent
railway up
```

---

## 📊 Architecture Overview

```
┌─────────────┐      ┌─────────────┐      ┌─────────────┐
│   Frontend  │─────▶│   Backend   │─────▶│  Supabase   │
│  (Vite)     │      │  (Express)  │      │ (Database)  │
└─────────────┘      └─────────────┘      └─────────────┘
       │                     │
       │                     │
       ▼                     ▼
┌─────────────┐      ┌─────────────┐
│  AI Agent   │      │   OpenAI    │
│  (LiveKit)  │      │     API     │
└─────────────┘      └─────────────┘
```

---

## 🔗 Service Communication

- **Frontend → Backend**: REST API calls (axios)
- **Frontend → AI Agent**: LiveKit WebRTC connection
- **AI Agent → Backend**: REST API for user context
- **Backend → Supabase**: Database operations and auth

---

## 📝 Benefits of Separation

✅ **Independent Development**: Teams can work on different services simultaneously
✅ **Technology Flexibility**: Use best tools for each service
✅ **Independent Scaling**: Scale each service based on demand
✅ **Clearer Boundaries**: Well-defined service contracts
✅ **Easier Testing**: Service-specific test suites
✅ **Deployment Flexibility**: Deploy services independently

---

## 🛠️ Troubleshooting

### Port Already in Use

```bash
# Find process using port
lsof -i :8000
lsof -i :5173

# Kill process
kill -9 <PID>
```

### Dependencies Not Installing

```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Environment Variables Not Loading

```bash
# Verify .env file exists and is not in .gitignore
ls -la | grep .env

# Check file permissions
chmod 600 .env
```

---

## 📚 Documentation

- [API Reference](./mindsphere-backend/docs/API_REFERENCE.md)
- [Database Schema](./mindsphere-backend/docs/database-schema.md)
- [Voice Agent Guide](./mindsphere-backend/docs/voice-agent-guide.md)
- [MCP Integration](./mindsphere-backend/docs/mcp-integration-guide.md)

---

## 🤝 Contributing

Each repository is independent. Follow the README in each directory for specific contribution guidelines.

---

## 📝 License

Part of the MindSphere project.

