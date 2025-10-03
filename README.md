<<<<<<< HEAD
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

=======
# MindSphere - AI-Powered Meditation & Journaling Platform

> **A premium, monochrome meditation app with AI-generated scripts, text-to-speech, and intelligent journaling with emotion analysis.**

[![React](https://img.shields.io/badge/React-18.2.0-blue.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0.0-blue.svg)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-18.0.0-green.svg)](https://nodejs.org/)
[![Vite](https://img.shields.io/badge/Vite-5.0.0-purple.svg)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.0.0-cyan.svg)](https://tailwindcss.com/)

---

## 🌟 Overview

MindSphere is a sophisticated meditation and journaling platform that combines AI-generated meditation scripts with intelligent reflection tools. Built with a strict monochrome design system, it provides a premium, distraction-free experience for mental wellness.

### Key Features

- **🤖 Ultra-Personalized AI Content** - Professional-grade meditation scripts and sleep stories with name personalization
- **🧠 Memory-Based Personalization** - AI content and session names personalized using user memories and snippets
- **🎵 Premium Google Cloud TTS** - High-quality audio with `en-US-Studio-O` voice and SSML support
- **📊 Habit Tracker Dashboard** - Calendar view with green/red dots and analytics
- **📚 Sessions Library** - Complete session history with filters and inline playback
- **📝 Intelligent Journaling** - AI-powered emotion analysis and summarization
- **🔥 Streak Tracking** - Gamified consistency tracking for habit building
- **🎨 Monochrome Design** - Premium, distraction-free UI with glass morphism
- **⚡ Real-time API Integration** - Seamless backend communication with React Query
- **🔍 Vector Search** - pgvector-powered similarity search for notes and sessions
- **📱 Session Type Filtering** - Separate analytics for Meditation and Sleep Story sessions
- **🧘 Demo Jain Monk User** - Pre-configured demo user with Jain philosophy-based memories and quotes

---

## 🏗️ Architecture

### Frontend Stack
- **React 18** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS** for utility-first styling
- **React Query** for server state management
- **Axios** for HTTP requests

### Backend Stack
- **Node.js** with Express.js
- **OpenAI API** for script generation and journal analysis
- **Google Cloud TTS** for premium audio generation with `en-US-Studio-O` voice and SSML support
- **Supabase** for database, authentication, and vector search
- **pgvector** for similarity search and embeddings

### Project Structure
```
MindSphere/
├── src/                          # Frontend source code
│   ├── components/               # React components
│   │   ├── Card.tsx             # Glass card component
│   │   ├── Button.tsx           # Monochrome button
│   │   ├── SessionSetup.tsx     # Meditation setup UI
│   │   ├── SessionPlayer.tsx    # Audio player component
│   │   ├── SessionFeedback.tsx  # Post-session feedback
│   │   ├── HabitTrackerCard.tsx # Calendar habit tracker with session type filtering
│   │   ├── SessionsListCard.tsx # Sessions library
│   │   ├── JournalCard.tsx      # Journaling interface
│   │   ├── StreakCard.tsx       # Streak display
│   │   └── IntegratedHeader.tsx # Global header with logo and streak display
│   ├── pages/                   # Page components
│   │   ├── Dashboard.tsx        # Main dashboard
│   │   ├── MeditationPage.tsx   # Home/meditation page
│   │   ├── SessionPage.tsx      # Active session page
│   │   └── ViewOnlySessionPage.tsx # Read-only session view
│   ├── api/                     # API layer
│   │   ├── client.ts            # Axios configuration
│   │   ├── types.ts             # TypeScript definitions
│   │   └── hooks.ts             # React Query hooks
│   ├── App.tsx                  # Main application
│   ├── main.tsx                 # Application entry point
│   └── index.css                # Global styles
├── backend/                     # Backend source code
│   ├── src/
│   │   ├── index.js             # Express server
│   │   ├── routes_session.js    # Session management with Google Cloud TTS
│   │   ├── routes_session_feedback.js # Session feedback
│   │   ├── routes_usage.js      # Usage analytics with session type filtering
│   │   ├── routes_library.js    # Sessions library
│   │   ├── routes_notes.js      # Notes management
│   │   ├── routes_journal.js    # Journaling endpoints
│   │   ├── routes_streaks.js    # Streak tracking
│   │   ├── routes_memories.js   # User memories management
│   │   ├── routes_snippets.js   # User snippets management
│   │   ├── routes_quotes.js     # Mental health quotes
│   │   ├── openai-content-generator.js # AI content generation with duration-based prompts and personalization
│   │   ├── openai.js            # AI integration
│   │   ├── tts-generator.js     # Google Cloud TTS integration
│   │   ├── vector-db-service.js # Vector database operations and personalization
│   │   └── schemas/             # Data validation schemas
│   └── .env                     # Environment variables
├── supabase/                    # Database migrations
│   └── migrations/              # SQL migration files
└── package.json                 # Dependencies
```

---

>>>>>>> 6932d93b9cb55e5f677d276dd88b2d34f9465ca5
## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
<<<<<<< HEAD
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
=======
- OpenAI API key
- Google Cloud TTS API key
- Supabase account (optional)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/jainrahulchaplot/Mindsphere.git
   cd Mindsphere
   ```

2. **Install dependencies**
   ```bash
   # Install frontend dependencies
   npm install
   
   # Install backend dependencies
   cd backend
   npm install
   cd ..
   ```

3. **Configure environment variables**
   
   Create `backend/.env`:
   ```env
   # OpenAI API
   OPENAI_API_KEY=your_openai_api_key_here
   
   # Supabase Database
   SUPABASE_URL=your_supabase_url_here
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key_here
   
   # Google Cloud TTS
   GOOGLE_APPLICATION_CREDENTIALS=path/to/service-account.json
   TTS_PROVIDER=cloud_tts
   CLOUD_TTS_VOICE=en-US-Studio-O
   CLOUD_TTS_RATE=0.85
   CLOUD_TTS_PITCH=-2.0
   
   # Server Configuration
   PORT=8000
   FRONTEND_ORIGIN=*
   ```

4. **Start the development servers**
   
   **Option 1: Use the start script**
   ```bash
   ./start_servers.sh
   ```
   
   **Option 2: Manual start**
   
   **Terminal 1 (Backend):**
   ```bash
   cd backend
   node src/index.js
   ```
   
   **Terminal 2 (Frontend):**
   ```bash
   npm run dev
   ```

5. **Access the application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:8000

---

## 🎨 Design System

### Monochrome Palette
MindSphere follows a strict monochrome design system for a premium, distraction-free experience:

| Token      | Hex      | Usage |
|------------|----------|-------|
| `black`    | `#0A0A0A`| Page background, top bars |
| `graphite` | `#1A1A1A`| Card surfaces (primary) |
| `slate`    | `#2A2A2A`| Buttons, inputs, subdued surfaces |
| `steel`    | `#3A3A3A`| Dividers, secondary borders |
| `silver`   | `#C9CCD1`| Secondary text |
| `platinum` | `#E6E7EA`| Headings, key text |
| `white`    | `#FFFFFF`| Highlights, icons on dark |

### Typography
- **Font Family:** Montserrat (300, 400, 500 weights)
- **Base Size:** 13px (`text-xs`)
- **Scale:** `text-xs` (body) → `text-sm` (headings) → `text-2xl` (emphasis)
- **Weight:** 400-500 (body), 600 (headings)

---

## 🔌 API Documentation

### Key Endpoints

#### Session Management
- `POST /api/v1/session/create` - Create new session
- `POST /api/v1/session/:id/generate-script` - Generate AI script
- `POST /api/v1/session/:id/generate-audio` - Generate TTS audio
- `GET /api/v1/session/:id` - Get session details
- `POST /api/v1/session/:id/feedback` - Submit post-session feedback

#### Dashboard & Analytics
- `GET /api/v1/usage/daily` - Get daily usage data with streaks and session type filtering
- `GET /api/v1/library` - Get user's sessions library with filters

#### Notes & Vector Search
- `GET /api/v1/notes` - List user notes
- `POST /api/v1/notes` - Create new note
- `POST /api/v1/notes/similarity` - Find similar notes using vector search

#### Journaling
- `POST /api/v1/journal/submit` - Submit journal entry with AI analysis

#### Streaks
- `GET /api/v1/streaks/:user_id` - Get user streak data
- `POST /api/v1/streaks/:user_id` - Update user streak

---

## 🎵 Audio Features

### Google Cloud TTS Integration
- **High-Quality Audio** - Google Cloud TTS v1 with advanced Neural2 voice models
- **Premium Voice** - Uses `en-US-Studio-O` for superior quality and SSML support
- **SSML Support** - Advanced speech markup for natural pacing and emphasis
- **Smart Voice Configuration** - Optimized settings for different content types
- **Ultra-Personalized Content** - Enhanced prompts with name personalization
- **TTS-Optimized Generation** - Content specifically crafted for text-to-speech

---

## 🤖 AI Content Generation

### Enhanced Prompt System
- **Professional-Grade Prompts** - 25+ years of expertise simulation for meditation teachers and sleep story writers
- **SSML Generation** - ASCII-only Google-safe SSML with proper tags and timing
- **Duration-Based Structure** - Adapts to any session length (1-60+ minutes) with percentage-based timing
- **Name Personalization** - Addresses users by their first name for intimate, one-on-one experience
- **Mood-Aware Content** - Acknowledges and works with user's current emotional state
- **TTS-Optimized** - Content specifically crafted for natural text-to-speech delivery

### Content Types
- **Meditation Scripts** - Guided practices with structured opening (40%), main practice (50%), integration (5%), and closing (5%)
- **Sleep Stories** - Gentle bedtime narratives with rich sensory details and calming imagery
- **Style-Specific Guidance** - Tailored content for Breathwork, Body Scan, Loving-Kindness, Focus, and Sleep practices

---

## 📊 Dashboard Features

### Habit Tracker
- **Calendar Grid** - Monthly view with green/red dots showing session activity
- **Green Dots** - Days with ≥1 meditation session
- **Red Dots** - Days with 0 sessions (after first use)
- **Month Navigation** - Previous/next month controls with "Today" button
- **Session Type Tabs** - Separate analytics for Meditation and Sleep Story sessions
- **Analytics** - Current streak, best streak, total sessions, total time, completion rate

### Sessions Library
- **Complete History** - All sessions with filters and search
- **Session Details** - Date, kind, mood, style, duration for each session
- **Inline Playback** - Play/pause audio directly from the list
- **Filters** - By kind (Meditation/Sleep Story), date range, search
- **View-Only Mode** - Click any session to open in read-only viewer

---
>>>>>>> 6932d93b9cb55e5f677d276dd88b2d34f9465ca5

## 🔧 Development

### Available Scripts
<<<<<<< HEAD
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
=======

```bash
# Frontend development
npm run dev          # Start Vite dev server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint

# Backend development
cd backend
node src/index.js    # Start Express server

# Start both servers
./start_servers.sh   # Start frontend and backend together
```

### Code Style
- **TypeScript** for type safety
- **ESLint** for code quality
- **Prettier** for code formatting
- **Conventional Commits** for commit messages

---

## 🚀 Deployment

### Frontend (Vercel/Netlify)
1. Build the project: `npm run build`
2. Deploy the `dist/` folder
3. Set environment variables for API base URL

### Backend (Railway/Heroku)
1. Set environment variables
2. Deploy the `backend/` directory
3. Configure CORS for frontend domain

### Database (Supabase)
1. Run migrations in `supabase/migrations/`
2. Configure RLS policies
3. Set up authentication (optional)

---

## 🧪 Testing

### Manual Testing Checklist
- [ ] Session generation with different moods/durations
- [ ] Google Cloud TTS audio generation with Studio-O voice
- [ ] Audio playback controls and progress tracking
- [ ] Dashboard habit tracker calendar with session type filtering
- [ ] Sessions library with filters and search
- [ ] View-only session page
- [ ] Journal submission and AI analysis
- [ ] Streak tracking and updates
- [ ] Vector search for notes and sessions
- [ ] Error handling for API failures
- [ ] Responsive design on mobile devices

---

## 🔒 Security

### Environment Variables
- Never commit `.env` files
- Use strong API keys
- Rotate keys regularly
- Use environment-specific configurations

### API Security
- Input validation on all endpoints
- Rate limiting (recommended)
- CORS configuration
- Error handling without sensitive data exposure

---

## 🆕 Recent Updates

### v3.2 - Memory-Based Personalization & Demo User (Latest)
- **Memory-Based Personalization** - AI content and session names now personalized using user memories and snippets
- **Jain Monk Demo User** - Pre-configured demo user with Jain philosophy-based memories and quotes
- **Enhanced Session Names** - AI-generated session names incorporate personal context from memories
- **Vector Search Integration** - Personalization context retrieved using pgvector similarity search
- **Ambient Player Removal** - Removed unused ambient music player components
- **Template Literal Fixes** - Fixed module load-time evaluation errors in OpenAI content generator
- **SSML Validation Improvements** - Enhanced SSML generation for long audio sessions with batch processing

### v3.1 - Session Type Filtering & Metrics Fix
- **Fixed Session Type Filtering** - Metrics, list, and chips now properly filter by selected session type (Meditation/Sleep Story)
- **Corrected Stats Calculation** - Analytics now use API-filtered data instead of frontend-filtered data
- **Improved Mood Filtering** - Mood chips now show only moods available for the selected session type
- **Enhanced Query Management** - React Query properly invalidates and refetches when session type changes

### v3.0 - Studio-O Voice & Enhanced Analytics
- **Google Cloud TTS Studio-O** - Upgraded to premium `en-US-Studio-O` voice for superior audio quality
- **Aimee Narrator** - Consistent female narrator across all content types
- **Duration-Based Prompts** - Dynamic word count calculation based on session duration
- **Percentage-Based Structure** - All content sections now use percentages of total words
- **Session Type Filtering** - Separate analytics for Meditation and Sleep Story sessions

---

## 🤝 Contributing

### Development Workflow
1. Fork the repository
2. Create a feature branch
3. Follow the monochrome design system
4. Write tests for new features
5. Submit a pull request

### Design Guidelines
- Maintain monochrome color palette
- Use existing component primitives
- Follow typography scale
- Keep animations subtle and smooth

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **OpenAI** for AI-powered script generation and analysis
- **Google Cloud** for high-quality text-to-speech with Studio-O voice
- **Supabase** for backend-as-a-service and vector search
- **pgvector** for similarity search capabilities
- **Vite** for fast development experience
- **Tailwind CSS** for utility-first styling
- **React Query** for server state management

---

## 📞 Support

For support, questions, or feature requests:
- Create an issue on GitHub
- Check the troubleshooting section
- Review the API documentation

---

**Built with ❤️ for mental wellness and mindfulness**
>>>>>>> 6932d93b9cb55e5f677d276dd88b2d34f9465ca5
