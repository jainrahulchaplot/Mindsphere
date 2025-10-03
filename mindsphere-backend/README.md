# MindSphere Backend

> Express.js backend server for AI-powered meditation and journaling platform

[![Node.js](https://img.shields.io/badge/Node.js-18.0.0-green.svg)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-4.19.0-black.svg)](https://expressjs.com/)
[![OpenAI](https://img.shields.io/badge/OpenAI-GPT--4-blue.svg)](https://openai.com/)

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL (Supabase)
- OpenAI API key
- Google Cloud TTS credentials

### Installation

```bash
# Install dependencies
npm install

# Copy environment file
cp env.example .env

# Update .env with your credentials
```

### Development

```bash
# Start development server
npm start

# Access at http://localhost:8000
```

---

## 🏗️ Architecture

### Stack
- **Node.js** with Express.js
- **OpenAI API** for script generation and analysis
- **Google Cloud TTS** for premium audio generation
- **Supabase** for database and authentication
- **pgvector** for similarity search
- **Winston** for structured logging

### Project Structure
```
src/
├── index.js                    # Main server
├── routes_*.js                 # API routes
├── openai-content-generator.js # AI content
├── tts-generator.js            # Text-to-speech
├── vector-db-service.js        # Vector operations
├── logger.js                   # Logging
└── middleware/                 # Express middleware
```

---

## 🔌 API Endpoints

### Session Management
- `POST /api/v1/session/start` - Create new session
- `GET /api/v1/session/:id` - Get session details
- `POST /api/v1/session/:id/feedback` - Submit feedback

### Analytics
- `GET /api/v1/usage/daily` - Daily usage data
- `GET /api/v1/library` - User's sessions library

### Voice
- `POST /api/voice/token` - Generate LiveKit token
- `GET /api/voice/context/:userId` - Get user context

---

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests with coverage
npm run test:coverage
```

---

## 🚢 Deployment

### Railway (Recommended)
```bash
# Deploy to Railway
railway up
```

### Environment Variables
Set these in your deployment platform:
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `OPENAI_API_KEY`
- `GOOGLE_APPLICATION_CREDENTIALS`
- `LIVEKIT_URL`
- `LIVEKIT_API_KEY`
- `LIVEKIT_API_SECRET`

---

## 📝 License

Part of the MindSphere project.

