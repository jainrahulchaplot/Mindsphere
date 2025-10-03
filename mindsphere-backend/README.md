# MindSphere Backend

> Node.js API server for MindSphere mental wellness platform

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Supabase account
- OpenAI API key
- LiveKit account

### Installation
```bash
npm install
cp env.example .env
# Edit .env with your credentials
```

### Development
```bash
npm start          # Production mode
npm run dev        # Development mode
npm test           # Run tests
```

## 📁 Project Structure

```
src/
├── __tests__/           # Test files
├── agent/              # AI agent integration
├── config/             # Configuration files
├── middleware/         # Express middleware
├── schemas/            # Data validation schemas
├── auth_middleware.js  # Authentication
├── index.js           # Main server file
├── logger.js          # Structured logging
├── supabase.js        # Database client
└── routes_*.js        # API route handlers
```

## 🔧 API Endpoints

### Authentication
- `POST /auth/login` - User login
- `POST /auth/register` - User registration
- `GET /auth/me` - Get current user

### Sessions
- `GET /sessions` - List user sessions
- `POST /sessions` - Create new session
- `GET /sessions/:id` - Get session details
- `PUT /sessions/:id` - Update session

### Voice
- `POST /voice/token` - Generate LiveKit token
- `POST /voice/join` - Join voice session
- `POST /voice/leave` - Leave voice session

### Content
- `GET /music` - Get music library
- `POST /music/upload` - Upload music track
- `GET /quotes` - Get inspirational quotes
- `GET /library` - Get content library

### User Data
- `GET /profile` - Get user profile
- `PUT /profile` - Update profile
- `GET /notes` - Get user notes
- `POST /notes` - Create note
- `GET /memories` - Get user memories

## 🔐 Environment Variables

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
TTS_PROVIDER=cloud_tts
CLOUD_TTS_VOICE=en-US-Studio-O

# ElevenLabs (optional)
ELEVEN_API_KEY=your_eleven_key
ELEVEN_VOICE_ID=your_voice_id
```

## 🧪 Testing

```bash
# Run all tests
npm test

# Run specific test file
npm test -- routes_voice_token.test.js

# Run with coverage
npm run test:coverage
```

## 🚀 Deployment

### Railway
```bash
railway login
railway link
railway up
```

### Docker
```bash
docker build -t mindsphere-backend .
docker run -p 8000:8000 mindsphere-backend
```

## 📊 Monitoring

- **Health Check**: `GET /health`
- **Logs**: Structured JSON logging
- **Metrics**: Request timing and error rates

## 🔧 Development

### Adding New Routes
1. Create route file: `routes_feature.js`
2. Add to `index.js`:
   ```javascript
   app.use('/api/feature', require('./routes_feature'));
   ```
3. Add tests in `__tests__/`
4. Update this README

### Error Logging Standards
```javascript
// Good error logging example
logger.error('Database connection failed', {
  service: 'mindsphere-backend',
  operation: 'user_authentication',
  userId: userId,
  correlationId: req.correlationId,
  error: error.message,
  stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
  timestamp: new Date().toISOString(),
  environment: process.env.NODE_ENV
});
```

### Database Migrations
- Located in `database/` folder
- Use Supabase CLI for migrations
- Test migrations before applying
- No fallback data - fail fast with clear errors

### Git Workflow
```bash
# Make changes
git add .
git commit -m "feat: add user authentication endpoint"
git push origin feature/user-auth
```

## 🐛 Troubleshooting

### Common Issues
1. **Database Connection**: Check Supabase credentials
2. **Voice Token**: Verify LiveKit configuration
3. **TTS Issues**: Check Google Cloud credentials
4. **CORS Errors**: Verify FRONTEND_ORIGIN setting

### Debug Mode
```bash
DEBUG=mindsphere:* npm run dev
```

## 📚 Dependencies

### Core
- `express` - Web framework
- `cors` - CORS middleware
- `helmet` - Security headers
- `morgan` - HTTP logging

### Database
- `@supabase/supabase-js` - Supabase client

### AI & Voice
- `openai` - OpenAI API
- `livekit-server-sdk` - LiveKit integration
- `@google-cloud/text-to-speech` - Google TTS

### Utilities
- `joi` - Data validation
- `winston` - Logging
- `dotenv` - Environment variables

## 📄 License

MIT License - see [LICENSE](../../LICENSE) for details.