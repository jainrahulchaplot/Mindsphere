# MindSphere AI Voice Agent

> LiveKit-powered AI voice agent for real-time meditation guidance

[![LiveKit](https://img.shields.io/badge/LiveKit-Agents-green.svg)](https://docs.livekit.io/agents/)
[![OpenAI](https://img.shields.io/badge/OpenAI-Realtime_API-blue.svg)](https://platform.openai.com/)

---

## 🌟 Features

- **Real-time Voice Conversations** - Natural, low-latency voice interactions
- **Memory-Based Context** - Personalized responses using user memories and preferences
- **Background Noise Cancellation** - Clean audio with LiveKit noise suppression
- **OpenAI Realtime API** - Coral voice for natural, empathetic conversations

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- LiveKit Cloud account (or self-hosted server)
- OpenAI API key

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
# Start agent in development mode
npm run dev
```

### Production

```bash
# Start agent in production mode
npm start
```

---

## 🔧 Configuration

### Environment Variables

Create a `.env` file:

```env
# LiveKit Configuration
LIVEKIT_URL=wss://your-project.livekit.cloud
LIVEKIT_API_KEY=your_api_key
LIVEKIT_API_SECRET=your_api_secret

# OpenAI Configuration
OPENAI_API_KEY=your_openai_api_key

# Backend API URL
BACKEND_URL=http://localhost:8000
```

---

## 🏗️ Architecture

### How It Works

1. **User Joins Room** - Frontend requests token from backend
2. **Agent Connects** - AI agent joins the same LiveKit room
3. **Context Loading** - Agent fetches user memories from backend
4. **Voice Conversation** - Real-time audio exchange via OpenAI Realtime API
5. **Room Cleanup** - Automatic cleanup when user disconnects

### Key Components

- **LiveKit Agents Framework** - Real-time communication infrastructure
- **OpenAI Realtime Model** - Natural language understanding and generation
- **Background Voice Cancellation** - Noise suppression for clear audio
- **Memory Integration** - Personalized context from backend API

---

## 📊 User Context

The agent fetches personalized context including:
- Long-term memories
- Recent thoughts and insights
- Personal goals
- Meditation preferences
- Sleep preferences
- Preferred content themes

---

## 🚢 Deployment

### Railway (Recommended)

```bash
# Deploy to Railway
railway up
```

### Environment Setup
Set all environment variables in your deployment platform.

---

## 🔗 Related Services

- **Backend API**: Provides user context and authentication
- **Frontend**: User interface for voice interactions
- **LiveKit Server**: Real-time communication infrastructure

---

## 📝 License

Part of the MindSphere project.

