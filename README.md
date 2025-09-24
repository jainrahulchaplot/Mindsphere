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
│   │   ├── studio-validator.js  # SSML validation and sanitization
│   │   └── schemas/             # Data validation schemas
│   └── .env                     # Environment variables
├── supabase/                    # Database migrations
│   └── migrations/              # SQL migration files
└── package.json                 # Dependencies
```

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- OpenAI API key
- Google Cloud TTS API key
- Supabase account (optional)
- Docker & Docker Compose (for containerized deployment)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd MindSphere
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

### Docker Deployment

1. **Set environment variables**
   ```bash
   export OPENAI_API_KEY=your_openai_api_key_here
   export SUPABASE_URL=your_supabase_url_here
   export SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key_here
   export GOOGLE_APPLICATION_CREDENTIALS=path/to/service-account.json
   ```

2. **Run with Docker Compose**
   ```bash
   docker compose up --build
   ```

3. **Access the application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:8000

**Note:** Environment variables must be provided externally and are not committed to the repository for security.

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

### Components

#### Card Component
```tsx
<div className="card">
  {/* Glass surface with blur, border, soft shadow */}
</div>
```

#### Button Component
```tsx
<button className="btn">Label</button>
```

#### Input Component
```tsx
<input className="bg-graphite text-white border border-white/10 rounded-lg px-3 py-2 placeholder-silver/60 focus:outline-none focus:ring-2 focus:ring-white/10"/>
```

---

## 🔌 API Documentation

### Endpoints

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
- `GET /api/v1/notes/:id` - Get specific note
- `PUT /api/v1/notes/:id` - Update note
- `DELETE /api/v1/notes/:id` - Delete note
- `POST /api/v1/notes/similarity` - Find similar notes using vector search
- `POST /api/v1/notes/:id/embedding` - Update note embedding

#### Journaling
- `POST /api/v1/journal/submit` - Submit journal entry with AI analysis

#### Streaks
- `GET /api/v1/streaks/:user_id` - Get user streak data
- `POST /api/v1/streaks/:user_id` - Update user streak

### Request/Response Examples

#### Create Session
```typescript
// Request
POST /api/v1/session/create
{
  "kind": "sleep_story",
  "mood": "anxious",
  "duration": 5,
  "user_notes": "Feeling stressed about work",
  "user_name": "Rahul"
}

// Response
{
  "session_id": "143",
  "status": "created"
}
```

#### Generate Script
```typescript
// Request
POST /api/v1/session/143/generate-script

// Response
{
  "session_id": "143",
  "status": "script_generated",
  "script_content": "<speak><prosody rate=\"x-slow\">...</prosody></speak>",
  "session_name": "Soft Lullabies of a Gentle Night"
}
```

#### Generate Audio
```typescript
// Request
POST /api/v1/session/143/generate-audio

// Response
{
  "session_id": "143",
  "status": "audio_generated",
  "audio_url": "https://storage.../143.mp3",
  "duration_sec": 162
}
```

#### Get Usage Analytics
```typescript
// Request
GET /api/v1/usage/daily?user_id=user-123&from=2025-01-01&to=2025-01-31&kind=meditation

// Response
{
  "first_use_date": "2025-01-15",
  "days": [
    {"date": "2025-01-15", "sessions": 2, "minutes": 10},
    {"date": "2025-01-16", "sessions": 1, "minutes": 5}
  ],
  "streaks": {"current": 5, "best": 12},
  "analytics": {
    "totalSessions": 15,
    "totalMinutes": 75,
    "completionRate": 85.5,
    "avgSessionDuration": 5.0,
    "longestBreak": 2
  }
}
```

#### Get Sessions Library
```typescript
// Request
GET /api/v1/library?user_id=user-123&kind=meditation&from=2025-01-01

// Response
[
  {
    "id": "143",
    "created_at": "2025-01-20T10:30:00Z",
    "kind": "meditation",
    "mood": "anxious",
    "duration_sec": 300,
    "audio_url": "https://storage.../143.mp3"
  }
]
```

#### Submit Journal
```typescript
// Request
POST /api/v1/journal/submit
{
  "text": "I felt anxious today but meditation helped",
  "user_id": "user-123",
  "session_id": "143"
}

// Response
{
  "summary": "The user experienced anxiety but found relief through meditation practice.",
  "emotions": ["anxious", "relieved"],
  "stored": true
}
```

---

## 🧩 React Query Hooks

The frontend uses React Query for efficient server state management:

```typescript
// Session generation
const startSession = useStartSession();
const { mutateAsync: generateScript } = startSession;

// Text-to-speech
const tts = useTTS();
const { mutateAsync: generateAudio } = tts;

// Journaling
const journal = useJournalSubmit();
const { mutateAsync: submitJournal } = journal;

// Streak tracking
const { data: streaks } = useStreaks(userId);
const updateStreak = useUpdateStreak();
```

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

### Vector Search
- **Similarity Search** - Find related notes and sessions using AI embeddings
- **Semantic Search** - Search by meaning, not just keywords
- **Mood Analysis** - Track emotional patterns across sessions
- **Content Discovery** - Find similar meditation styles and themes

---

## 🎵 Audio Features

### Google Cloud TTS Integration
- **High-Quality Audio** - Google Cloud TTS v1 with advanced Neural2 voice models
- **Premium Voice** - Uses `en-US-Studio-O` for superior quality and SSML support
- **SSML Support** - Advanced speech markup for natural pacing and emphasis
- **Smart Voice Configuration** - Optimized settings for different content types
  - **Meditation**: Female voice with moderate pace (0.85x rate, -2.0 pitch)
  - **Sleep Stories**: Female voice with slower pace (0.85x rate, -2.0 pitch)
- **Ultra-Personalized Content** - Enhanced prompts with name personalization
- **TTS-Optimized Generation** - Content specifically crafted for text-to-speech
- **MP3 Output** - Optimized for web playback with proper encoding
- **Background Processing** - Audio generation happens server-side
- **Sequential Playback** - Smooth audio controls with progress tracking

### Player Controls
- Play/Pause functionality
- Track navigation (previous/next)
- Progress tracking
- Auto-advance on completion

---

## 🤖 AI Content Generation

### Enhanced Prompt System
- **Professional-Grade Prompts** - 25+ years of expertise simulation for meditation teachers and sleep story writers
- **SSML Generation** - ASCII-only Google-safe SSML with proper tags and timing
- **Duration-Based Structure** - Adapts to any session length (1-60+ minutes) with percentage-based timing
- **Name Personalization** - Addresses users by their first name for intimate, one-on-one experience
- **Mood-Aware Content** - Acknowledges and works with user's current emotional state
- **TTS-Optimized** - Content specifically crafted for natural text-to-speech delivery
- **Studio-O Compatible** - Optimized for Google Cloud TTS Studio-O voice

### Content Types
- **Meditation Scripts** - Guided practices with structured opening (40%), main practice (50%), integration (5%), and closing (5%)
- **Sleep Stories** - Gentle bedtime narratives with rich sensory details and calming imagery
- **Style-Specific Guidance** - Tailored content for Breathwork, Body Scan, Loving-Kindness, Focus, and Sleep practices

### Personalization Features
- **Memory-Based Context** - AI content personalized using user's long-term memories and recent thoughts
- **Snippet Integration** - Incorporates user's professional context, personal goals, and emotional state
- **Session Name Personalization** - AI-generated session names that reference specific aspects of user's life
- **User Notes Integration** - Weaves personal notes naturally into content
- **Emotional Intelligence** - Acknowledges current mood with empathy and understanding
- **Adaptive Language** - Uses encouraging, supportive language throughout
- **One-on-One Experience** - Creates sense of being personally guided and cared for

---

## 📊 Database Schema

### Sessions Table
```sql
CREATE TABLE sessions (
  id BIGSERIAL PRIMARY KEY,
  user_id TEXT NOT NULL,
  kind TEXT NOT NULL, -- 'meditation' | 'sleep_story'
  mood TEXT,
  style TEXT,
  duration INTEGER, -- duration in minutes
  duration_sec INTEGER, -- actual audio duration in seconds
  words INTEGER, -- word count of generated content
  prompt TEXT, -- original user prompt/notes
  script TEXT, -- generated script content
  user_notes TEXT, -- additional user notes
  user_name TEXT, -- user's name for personalization
  audio_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  -- Pre-listening data
  selected_duration INTEGER,
  selected_type TEXT,
  additional_notes TEXT,
  -- Post-listening feedback
  post_rating INTEGER CHECK (post_rating >= 1 AND post_rating <= 3),
  post_feedback TEXT,
  feedback_embedding VECTOR(1536),
  completed_at TIMESTAMPTZ
);
```

### Notes Table (Vector Search)
```sql
CREATE TABLE notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  kind TEXT NOT NULL, -- 'prompt' | 'journal' | 'voice_note'
  text TEXT NOT NULL,
  embedding VECTOR(1536), -- OpenAI embeddings
  mood TEXT,
  emotions TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Vector similarity index
CREATE INDEX notes_embedding_idx ON notes 
USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);
```

### User Memories Table
```sql
CREATE TABLE user_memories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  category TEXT,
  importance INTEGER DEFAULT 1,
  embedding VECTOR(1536), -- OpenAI embeddings
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Vector similarity index
CREATE INDEX user_memories_embedding_idx ON user_memories 
USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);
```

### User Snippets Table
```sql
CREATE TABLE user_snippets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  content TEXT NOT NULL,
  embedding VECTOR(1536), -- OpenAI embeddings
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Vector similarity index
CREATE INDEX user_snippets_embedding_idx ON user_snippets 
USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);
```

### Journals Table
```sql
CREATE TABLE journals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT,
  session_id TEXT,
  text TEXT NOT NULL,
  summary TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Streaks Table
```sql
CREATE TABLE streaks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT UNIQUE NOT NULL,
  current_streak INTEGER DEFAULT 0,
  best_streak INTEGER DEFAULT 0,
  last_entry_date DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

---

## 🔧 Development

### Available Scripts

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

### API Testing
```bash
# Health check
curl http://localhost:8000/health

# Test session creation
curl -X POST http://localhost:8000/api/v1/session/create \
  -H "Content-Type: application/json" \
  -d '{"kind":"meditation","mood":"anxious","duration":5,"user_name":"Rahul"}'

# Test script generation
curl -X POST http://localhost:8000/api/v1/session/143/generate-script

# Test audio generation
curl -X POST http://localhost:8000/api/v1/session/143/generate-audio

# Test usage analytics
curl "http://localhost:8000/api/v1/usage/daily?user_id=test-user&from=2025-01-01&to=2025-01-31&kind=meditation"

# Test sessions library
curl "http://localhost:8000/api/v1/library?user_id=test-user"

# Test journal submission
curl -X POST http://localhost:8000/api/v1/journal/submit \
  -H "Content-Type: application/json" \
  -d '{"text":"Test journal entry","user_id":"test-user"}'

# Test streak tracking
curl http://localhost:8000/api/v1/streaks/test-user
```

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

## 📈 Performance

### Frontend Optimizations
- **Code Splitting** with Vite
- **Tree Shaking** for smaller bundles
- **Memoization** with React.memo
- **Lazy Loading** for non-critical components

### Backend Optimizations
- **Connection Pooling** for database
- **Caching** for frequently accessed data
- **Compression** for API responses
- **Error Boundaries** for graceful failures

---

## 🐛 Troubleshooting

### Common Issues

#### Frontend Won't Start
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

#### Backend API Errors
- Check environment variables in `backend/.env`
- Verify OpenAI API key is valid
- Ensure Google Cloud TTS credentials are correct
- Check port 8000 is available

#### Audio Playback Issues
- Check browser autoplay policies
- Verify TTS API is working
- Test with different audio formats

#### SSML Generation Issues
- Check OpenAI API key and quota
- Verify prompt templates are correct
- Ensure Studio-O voice compatibility

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
- **Debug Logging** - Added comprehensive logging for troubleshooting session type filtering
- **Reset Mood Filter** - Mood filter automatically resets when switching between session types

### v3.0 - Studio-O Voice & Enhanced Analytics
- **Google Cloud TTS Studio-O** - Upgraded to premium `en-US-Studio-O` voice for superior audio quality
- **Aimee Narrator** - Consistent female narrator across all content types
- **Duration-Based Prompts** - Dynamic word count calculation based on session duration
- **Percentage-Based Structure** - All content sections now use percentages of total words
- **Session Type Filtering** - Separate analytics for Meditation and Sleep Story sessions
- **Enhanced Personalization** - Direct user name integration without safe variables
- **Complete SSML Generation** - AI now generates complete, valid SSML without truncation
- **Bypassed Sanitization** - Direct AI output to TTS for maximum content fidelity

### v2.0 - Dashboard Rebuild
- **Complete Dashboard Redesign** - Replaced complex dashboard with 2 focused cards
- **Habit Tracker Calendar** - Visual calendar with green/red dots and analytics
- **Sessions Library** - Complete session history with filters and inline playback
- **View-Only Sessions** - Read-only session viewer for historical sessions
- **Vector Search** - AI-powered similarity search for notes and sessions

### v1.0 - Core Features
- **Google Cloud TTS** - Exclusive use of Google Cloud TTS with Neural2 voices and SSML support
- **SSML Implementation** - ASCII-only Google-safe SSML generation with sanitization and validation
- **Enhanced Prompts** - TTS-optimized content generation for meditation and sleep stories
- **Fallback Mechanism** - Robust fallback to plain text when SSML generation fails
- **Database Schema** - Enhanced sessions table with feedback and analytics
- **pgvector Integration** - Added vector search capabilities
- **API Optimization** - New endpoints for usage analytics and library management
- **Mobile-First Design** - Improved responsive design and touch interactions

### New Features
- **Post-Session Feedback** - 3-point rating system with text feedback
- **Session Analytics** - Word count, duration tracking, and usage patterns
- **Advanced Filtering** - Search and filter sessions by multiple criteria
- **Streak Analytics** - Current and best streak tracking with detailed stats
- **Content Discovery** - Find similar sessions and meditation styles
- **Global Header** - Integrated header with logo, streak, and ambient player on all pages

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