# MindSphere Quick Start Guide

> **Get up and running with MindSphere in 5 minutes**

## 🚀 Quick Setup

### 1. Prerequisites
- Node.js 18+
- OpenAI API key
- Google Cloud TTS API key
- Supabase account (optional)

### 2. Clone and Install
```bash
git clone <repository-url>
cd MindSphere
npm install
cd backend && npm install && cd ..
```

### 3. Environment Setup
Create `backend/.env`:
```env
OPENAI_API_KEY=your_openai_api_key_here
SUPABASE_URL=your_supabase_url_here
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key_here
GOOGLE_APPLICATION_CREDENTIALS=path/to/service-account.json
```

### 4. Start Servers
```bash
./start_servers.sh
```

### 5. Access Application
- Frontend: http://localhost:5173
- Backend: http://localhost:8000

## 🧪 Quick Test

### Test Session Creation
```bash
# Create a meditation session
curl -X POST http://localhost:8000/api/v1/session/create \
  -H "Content-Type: application/json" \
  -d '{"kind":"meditation","mood":"calm","duration":5,"user_name":"TestUser"}'

# Generate script
curl -X POST http://localhost:8000/api/v1/session/143/generate-script

# Generate audio
curl -X POST http://localhost:8000/api/v1/session/143/generate-audio
```

### Test Sleep Story
```bash
# Create a sleep story
curl -X POST http://localhost:8000/api/v1/session/create \
  -H "Content-Type: application/json" \
  -d '{"kind":"sleep_story","mood":"anxious","duration":3,"user_name":"Rahul"}'
```

## 🎯 Key Features

### ✅ What Works
- **AI Content Generation** - Meditation scripts and sleep stories
- **Google Cloud TTS** - High-quality audio with Studio-O voice
- **Habit Tracker** - Calendar with green/red dots and session type filtering
- **Sessions Library** - Complete history with filters and proper session type filtering
- **Session Type Filtering** - Metrics, list, and chips properly filter by Meditation/Sleep Story
- **Vector Search** - AI-powered similarity search
- **Journaling** - AI emotion analysis

### 🎵 Audio Features
- **Voice**: `en-US-Studio-O` (premium female voice)
- **Narrator**: Aimee
- **SSML Support**: Advanced speech markup
- **Duration-Based**: Dynamic word count based on session length

### 📊 Analytics
- **Current Streak**: Days of consecutive sessions
- **Best Streak**: Longest streak achieved
- **Total Sessions**: Count by session type
- **Total Time**: Minutes spent meditating
- **Completion Rate**: Percentage of completed sessions

## 🔧 Troubleshooting

### Common Issues
1. **Port 8000 in use**: `lsof -i :8000` and kill the process
2. **OpenAI API errors**: Check API key and quota
3. **TTS errors**: Verify Google Cloud credentials
4. **Database errors**: Check Supabase connection

### Reset Everything
```bash
# Stop servers
pkill -f "npm run dev" && pkill -f "vite"

# Clear and reinstall
rm -rf node_modules package-lock.json
rm -rf backend/node_modules backend/package-lock.json
npm install
cd backend && npm install && cd ..

# Start fresh
./start_servers.sh
```

## 📱 Frontend Features

### Dashboard
- **Habit Tracker Card**: Monthly calendar with session dots
- **Sessions Library Card**: Complete session history
- **Session Type Tabs**: Filter by Meditation or Sleep Story

### Session Pages
- **Session Setup**: Choose mood, duration, and notes
- **Active Session**: Audio player with controls
- **View-Only Session**: Read-only historical sessions

### Global Header
- **Logo**: MindSphere branding
- **Streak Display**: Current streak counter
- **Ambient Player**: Background audio controls

## 🎨 Design System

### Colors
- **Black**: `#0A0A0A` (background)
- **Graphite**: `#1A1A1A` (cards)
- **Slate**: `#2A2A2A` (buttons)
- **White**: `#FFFFFF` (text)

### Typography
- **Font**: Montserrat
- **Sizes**: `text-xs` (13px) to `text-2xl` (24px)

## 📚 Next Steps

1. **Explore the Dashboard** - Check out the habit tracker and sessions library
2. **Create Sessions** - Try different moods and durations
3. **Test Audio** - Generate and play meditation audio
4. **Use Journaling** - Submit journal entries for AI analysis
5. **Check Analytics** - View your usage patterns and streaks

## 🆘 Need Help?

- **Documentation**: See `README.md` for full details
- **Backend**: See `backend/README.md` for API docs
- **Issues**: Check the troubleshooting section
- **API Testing**: Use the curl commands above

---

**Happy meditating! 🧘‍♀️**
