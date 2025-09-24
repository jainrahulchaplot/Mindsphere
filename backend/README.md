# MindSphere Backend

> **Express.js backend server for AI-powered meditation and journaling platform with Google Cloud TTS integration.**

[![Node.js](https://img.shields.io/badge/Node.js-18.0.0-green.svg)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-4.18.0-black.svg)](https://expressjs.com/)
[![OpenAI](https://img.shields.io/badge/OpenAI-GPT--4-blue.svg)](https://openai.com/)
[![Google Cloud TTS](https://img.shields.io/badge/Google%20Cloud-TTS-orange.svg)](https://cloud.google.com/text-to-speech)

---

## 🌟 Overview

The MindSphere backend provides a comprehensive API for meditation session management, AI content generation, text-to-speech audio creation, and intelligent journaling with emotion analysis. Built with Express.js and integrated with OpenAI and Google Cloud TTS.

### Key Features

- **🤖 AI Content Generation** - OpenAI-powered meditation scripts and sleep stories with memory-based personalization
- **🧠 Memory-Based Personalization** - AI content and session names personalized using user memories and snippets
- **🎵 Google Cloud TTS** - High-quality audio with `en-US-Studio-O` voice and SSML support
- **📊 Analytics & Tracking** - Usage analytics, streak tracking, and session type filtering
- **🔍 Vector Search** - pgvector-powered similarity search for notes, sessions, memories, and snippets
- **📝 Intelligent Journaling** - AI-powered emotion analysis and summarization
- **🗄️ Database Management** - Supabase integration with PostgreSQL and vector embeddings
- **🧘 Demo User Support** - Pre-configured Jain monk demo user with philosophy-based content

---

## 🏗️ Architecture

### Core Services
- **Express.js Server** - RESTful API with middleware and routing
- **OpenAI Integration** - GPT-4 powered content generation and analysis
- **Google Cloud TTS** - Premium text-to-speech with Studio-O voice
- **Supabase Client** - Database operations and vector search
- **SSML Processing** - Speech markup validation and sanitization

### Project Structure
```
backend/
├── src/
│   ├── index.js                    # Main Express server
│   ├── config.js                   # Configuration management
│   ├── supabase.js                 # Supabase client setup
│   ├── openai.js                   # OpenAI client configuration
│   ├── openai-content-generator.js # AI content generation with duration-based prompts and personalization
│   ├── tts-generator.js            # Google Cloud TTS integration
│   ├── vector-db-service.js        # Vector database operations and personalization
│   ├── studio-validator.js         # SSML validation and sanitization
│   ├── studio-sanitizer.js         # SSML cleanup utilities
│   ├── summarizer.js               # AI-powered summarization
│   ├── whisper-stt.js              # Speech-to-text integration
│   ├── auth_middleware.js          # Authentication middleware
│   ├── routes_session.js           # Session management endpoints
│   ├── routes_session_feedback.js  # Session feedback endpoints
│   ├── routes_usage.js             # Usage analytics with session type filtering
│   ├── routes_library.js           # Sessions library management
│   ├── routes_notes.js             # Notes and vector search
│   ├── routes_journal.js           # Journaling and emotion analysis
│   ├── routes_streaks.js           # Streak tracking
│   ├── routes_memories.js          # User memories management
│   ├── routes_snippets.js          # User snippets management
│   ├── routes_quotes.js            # Mental health quotes
│   ├── routes_voice.js             # Voice-related endpoints
│   ├── routes_music.js             # Music and ambient sounds
│   ├── routes_coach.js             # AI coaching features
│   ├── routes_memories.js          # Memory management
│   ├── routes_nudges.js            # User nudges and reminders
│   ├── routes_profile_basic.js     # Basic profile management
│   ├── routes_snippets.js          # Code snippets and utilities
│   ├── routes_stt.js               # Speech-to-text processing
│   ├── routes_debug.js             # Debug and development endpoints
│   ├── routes_migration.js         # Database migration utilities
│   ├── routes_me.js                # User profile endpoints
│   └── schemas/                    # Data validation schemas
│       ├── notes.js                # Notes validation
│       └── sessions.js             # Sessions validation
├── package.json                    # Dependencies and scripts
├── .env                           # Environment variables
└── README.md                      # This file
```

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn
- OpenAI API key
- Google Cloud TTS API key
- Supabase account

### Installation

1. **Install dependencies**
   ```bash
   cd backend
   npm install
   ```

2. **Configure environment variables**
   
   Create `.env` file:
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

3. **Start the server**
   ```bash
   node src/index.js
   ```

4. **Verify the server**
   ```bash
   curl http://localhost:8000/health
   ```

---

## 🔌 API Endpoints

### Session Management
- `POST /api/v1/session/create` - Create new session
- `POST /api/v1/session/:id/generate-script` - Generate AI script
- `POST /api/v1/session/:id/generate-audio` - Generate TTS audio
- `GET /api/v1/session/:id` - Get session details
- `POST /api/v1/session/:id/feedback` - Submit session feedback

### Analytics & Usage
- `GET /api/v1/usage/daily` - Get daily usage data with session type filtering
- `GET /api/v1/library` - Get sessions library with filters (supports kind parameter for session type filtering)
- `GET /api/v1/streaks/:user_id` - Get user streak data
- `POST /api/v1/streaks/:user_id` - Update user streak

### Notes & Vector Search
- `GET /api/v1/notes` - List user notes
- `POST /api/v1/notes` - Create new note
- `GET /api/v1/notes/:id` - Get specific note
- `PUT /api/v1/notes/:id` - Update note
- `DELETE /api/v1/notes/:id` - Delete note
- `POST /api/v1/notes/similarity` - Find similar notes using vector search
- `POST /api/v1/notes/:id/embedding` - Update note embedding

### User Memories & Snippets
- `GET /api/v1/memories` - List user memories
- `POST /api/v1/memories` - Create new memory
- `PUT /api/v1/memories/:id` - Update memory
- `DELETE /api/v1/memories/:id` - Delete memory
- `GET /api/v1/snippets` - List user snippets
- `POST /api/v1/snippets` - Create new snippet
- `PUT /api/v1/snippets/:id` - Update snippet
- `DELETE /api/v1/snippets/:id` - Delete snippet

### Journaling
- `POST /api/v1/journal/submit` - Submit journal entry with AI analysis

### Utility Endpoints
- `GET /health` - Health check
- `GET /api/v1/quotes/mental-health` - Get AI-generated mental health quotes
- `POST /api/v1/voice/transcribe` - Speech-to-text transcription

---

## 🤖 AI Content Generation

### OpenAI Integration
The backend uses OpenAI's GPT-4 for generating meditation scripts and sleep stories with the following features:

- **Duration-Based Prompts** - Dynamic word count calculation based on session duration
- **Percentage-Based Structure** - Content sections use percentages of total words
- **Memory-Based Personalization** - AI content personalized using user's long-term memories and recent thoughts
- **Session Name Personalization** - AI-generated session names incorporate personal context from memories
- **Name Personalization** - Direct user name integration for intimate experience
- **Mood-Aware Content** - Acknowledges and works with user's emotional state
- **Studio-O Compatible** - Optimized for Google Cloud TTS Studio-O voice
- **Batch Processing** - Intelligent batching for long audio sessions with SSML validation

### Content Types
- **Meditation Scripts** - 40% intro, 50% main practice, 5% integration, 5% closing
- **Sleep Stories** - 20% opening, 60% main story, 20% fade out

### Example Usage
```javascript
const { generateContentWithOpenAI, generateSessionName } = require('./src/openai-content-generator');

// Generate personalized content with memories and snippets
const script = await generateContentWithOpenAI(
  'sleep_story',
  'anxious',
  5,
  'Feeling stressed about work',
  'Rahul',
  'user-id-123' // userId for personalization
);

// Generate personalized session name
const sessionName = await generateSessionName(
  'meditation',
  'calm',
  10,
  'Need to focus better',
  'Rahul',
  'user-id-123' // userId for personalization
);
```

---

## 🎵 Google Cloud TTS Integration

### Voice Configuration
- **Voice**: `en-US-Studio-O` (premium female voice)
- **Rate**: 0.85x (slower for meditation)
- **Pitch**: -2.0 (deeper, more calming)
- **SSML Support**: Full Speech Synthesis Markup Language support

### SSML Features
- **Prosody Control** - Rate, pitch, and emphasis
- **Break Tags** - Pause timing for natural flow
- **Sentence Wrapping** - Proper `<s>` tag usage
- **Paragraph Structure** - Organized content flow

### Example Usage
```javascript
const { generateTTSAudio } = require('./src/tts-generator');

const audioUrl = await generateTTSAudio({
  text: '<speak><prosody rate="x-slow">Hello Rahul, this is Aimee...</prosody></speak>',
  sessionId: '143'
});
```

---

## 📊 Database Operations

### Supabase Integration
The backend uses Supabase for database operations with the following features:

- **PostgreSQL** - Primary database
- **Vector Search** - pgvector for similarity search
- **Real-time** - Live data updates
- **Authentication** - User management (optional)

### Key Tables
- **sessions** - Meditation and sleep story sessions
- **notes** - User notes with vector embeddings
- **user_memories** - User memories with vector embeddings for personalization
- **user_snippets** - User snippets with vector embeddings for personalization
- **journals** - Journal entries with AI analysis
- **streaks** - User streak tracking

### Example Usage
```javascript
const { supabase } = require('./src/supabase');

// Create session
const { data, error } = await supabase
  .from('sessions')
  .insert({
    user_id: 'user-123',
    kind: 'meditation',
    mood: 'anxious',
    duration: 5
  });

// Vector search
const { data: similarNotes } = await supabase.rpc('match_notes', {
  query_embedding: embedding,
  match_threshold: 0.7,
  match_count: 5
});
```

---

## 🧠 Vector Database Service

### Personalization Features
The backend includes a comprehensive vector database service for AI personalization:

- **Memory Management** - Store and retrieve user memories with vector embeddings
- **Snippet Processing** - Handle user snippets with automatic embedding generation
- **Similarity Search** - Find relevant memories and snippets using pgvector
- **Personalization Context** - Generate context for AI prompts from user data
- **Embedding Synchronization** - Automatic embedding updates when content changes

### Example Usage
```javascript
const { vectorDB } = require('./src/vector-db-service');

// Store a memory with automatic embedding
const memory = await vectorDB.storeMemory({
  user_id: 'user-123',
  title: 'Meditation Practice',
  content: 'I practice meditation every morning at 6 AM',
  category: 'routine'
});

// Get personalization context for AI prompts
const context = await vectorDB.getPersonalizationContext(
  'user-123',
  'meditation',
  'anxious',
  'Feeling stressed about work'
);

// Find similar memories
const similarMemories = await vectorDB.getRelevantMemories(
  'user-123',
  'meditation',
  5
);
```

---

## 🔧 Configuration

### Environment Variables
```env
# Required
OPENAI_API_KEY=your_openai_api_key_here
SUPABASE_URL=your_supabase_url_here
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key_here
GOOGLE_APPLICATION_CREDENTIALS=path/to/service-account.json

# Optional
PORT=8000
FRONTEND_ORIGIN=*
TTS_PROVIDER=cloud_tts
CLOUD_TTS_VOICE=en-US-Studio-O
CLOUD_TTS_RATE=0.85
CLOUD_TTS_PITCH=-2.0
```

### Google Cloud TTS Setup
1. Create a Google Cloud project
2. Enable the Text-to-Speech API
3. Create a service account
4. Download the JSON key file
5. Set `GOOGLE_APPLICATION_CREDENTIALS` to the file path

---

## 🧪 Testing

### Manual Testing
```bash
# Health check
curl http://localhost:8000/health

# Create session
curl -X POST http://localhost:8000/api/v1/session/create \
  -H "Content-Type: application/json" \
  -d '{"kind":"meditation","mood":"anxious","duration":5,"user_name":"Rahul"}'

# Generate script
curl -X POST http://localhost:8000/api/v1/session/143/generate-script

# Generate audio
curl -X POST http://localhost:8000/api/v1/session/143/generate-audio

# Get usage analytics
curl "http://localhost:8000/api/v1/usage/daily?user_id=test-user&kind=meditation"

# Test memories endpoints
curl -X POST http://localhost:8000/api/v1/memories \
  -H "Content-Type: application/json" \
  -d '{"user_id":"test-user","title":"Meditation Practice","content":"I meditate daily","category":"routine"}'

# Test snippets endpoints
curl -X POST http://localhost:8000/api/v1/snippets \
  -H "Content-Type: application/json" \
  -d '{"user_id":"test-user","content":"Feeling more focused after morning meditation"}'

# Test mental health quotes
curl http://localhost:8000/api/v1/quotes/mental-health
```

### API Testing Script
```bash
#!/bin/bash
# test_api.sh

BASE_URL="http://localhost:8000"

echo "Testing MindSphere Backend API..."

# Health check
echo "1. Health check..."
curl -s "$BASE_URL/health" | jq

# Create session
echo "2. Creating session..."
SESSION_RESPONSE=$(curl -s -X POST "$BASE_URL/api/v1/session/create" \
  -H "Content-Type: application/json" \
  -d '{"kind":"sleep_story","mood":"calm","duration":2,"user_name":"TestUser"}')
echo $SESSION_RESPONSE | jq

# Extract session ID
SESSION_ID=$(echo $SESSION_RESPONSE | jq -r '.session_id')
echo "Session ID: $SESSION_ID"

# Generate script
echo "3. Generating script..."
curl -s -X POST "$BASE_URL/api/v1/session/$SESSION_ID/generate-script" | jq

# Generate audio
echo "4. Generating audio..."
curl -s -X POST "$BASE_URL/api/v1/session/$SESSION_ID/generate-audio" | jq

# Test memories
echo "5. Testing memories..."
curl -s -X POST "$BASE_URL/api/v1/memories" \
  -H "Content-Type: application/json" \
  -d '{"user_id":"test-user","title":"Test Memory","content":"This is a test memory","category":"test"}' | jq

# Test snippets
echo "6. Testing snippets..."
curl -s -X POST "$BASE_URL/api/v1/snippets" \
  -H "Content-Type: application/json" \
  -d '{"user_id":"test-user","content":"This is a test snippet"}' | jq

# Test mental health quotes
echo "7. Testing mental health quotes..."
curl -s "$BASE_URL/api/v1/quotes/mental-health" | jq

echo "API testing complete!"
```

---

## 🐛 Troubleshooting

### Common Issues

#### OpenAI API Errors
```bash
# Check API key
curl -H "Authorization: Bearer $OPENAI_API_KEY" \
  https://api.openai.com/v1/models
```

#### Google Cloud TTS Errors
```bash
# Check credentials
gcloud auth application-default print-access-token
```

#### Database Connection Issues
```bash
# Test Supabase connection
curl -H "apikey: $SUPABASE_SERVICE_ROLE_KEY" \
  "$SUPABASE_URL/rest/v1/"
```

#### Port Already in Use
```bash
# Find process using port 8000
lsof -i :8000

# Kill process
kill -9 <PID>
```

---

## 📈 Performance

### Optimization Strategies
- **Connection Pooling** - Reuse database connections
- **Caching** - Cache frequently accessed data
- **Compression** - Compress API responses
- **Error Handling** - Graceful error recovery
- **Rate Limiting** - Prevent API abuse

### Monitoring
- **Health Endpoint** - `/health` for uptime monitoring
- **Logging** - Structured logging for debugging
- **Metrics** - Track API usage and performance

---

## 🔒 Security

### Best Practices
- **Environment Variables** - Never commit secrets
- **Input Validation** - Validate all inputs
- **Rate Limiting** - Prevent abuse
- **CORS** - Configure cross-origin requests
- **Error Handling** - Don't expose sensitive data

### API Security
```javascript
// Input validation example
const { body, validationResult } = require('express-validator');

app.post('/api/v1/session/create', [
  body('kind').isIn(['meditation', 'sleep_story']),
  body('duration').isInt({ min: 1, max: 60 }),
  body('user_name').isLength({ min: 1, max: 50 })
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  // Process request...
});
```

---

## 🚀 Deployment

### Production Setup
1. **Environment Variables** - Set all required environment variables
2. **Google Cloud** - Configure service account and permissions
3. **Supabase** - Set up production database
4. **Process Manager** - Use PM2 or similar for process management
5. **Reverse Proxy** - Use Nginx for load balancing

### Docker Deployment
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 8000
CMD ["node", "src/index.js"]
```

### PM2 Configuration
```json
{
  "name": "mindsphere-backend",
  "script": "src/index.js",
  "instances": 2,
  "exec_mode": "cluster",
  "env": {
    "NODE_ENV": "production",
    "PORT": 8000
  }
}
```

---

## 📝 Development

### Code Style
- **ESLint** - Code quality and consistency
- **Prettier** - Code formatting
- **Conventional Commits** - Commit message format
- **JSDoc** - Function documentation

### Adding New Endpoints
1. Create route file in `src/routes_*.js`
2. Add validation schema in `src/schemas/`
3. Register route in `src/index.js`
4. Add tests and documentation

### Database Migrations
```sql
-- Example migration
-- supabase/migrations/20250120000000_add_session_kind.sql
ALTER TABLE public.sessions
ADD COLUMN IF NOT EXISTS kind text;

CREATE INDEX IF NOT EXISTS idx_sessions_kind ON public.sessions(kind);
```

---

## 📞 Support

For backend-specific issues:
- Check the troubleshooting section
- Review API documentation
- Check server logs
- Test with curl commands

---

**Built with ❤️ for mental wellness and mindfulness**
