# MindSphere AI Agent

> LiveKit voice agent for real-time AI conversations in MindSphere

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- LiveKit account
- OpenAI API key

### Installation
```bash
npm install
cp env.example .env
# Edit .env with your credentials
```

### Development
```bash
npm start          # Start voice agent
npm run dev        # Development mode
npm test           # Run tests
```

## 📁 Project Structure

```
src/
├── voice-agent.ts     # Main agent implementation
├── livekit.toml       # LiveKit configuration
└── package.json       # Dependencies
```

## 🎯 Features

### Voice Processing
- Real-time audio streaming
- Speech-to-text conversion
- Text-to-speech synthesis
- Audio quality optimization

### AI Conversation
- OpenAI GPT-4 integration
- Context-aware responses
- Session state management
- Conversation history

### LiveKit Integration
- Room management
- Participant handling
- Audio/video streaming
- Real-time communication

## 🔧 Environment Variables

```env
# LiveKit
LIVEKIT_URL=your_livekit_url
LIVEKIT_API_KEY=your_api_key
LIVEKIT_API_SECRET=your_api_secret

# OpenAI
OPENAI_API_KEY=your_openai_key

# Backend API
BACKEND_URL=http://localhost:8000

# Agent Configuration
PORT=3000
NODE_ENV=development
```

## 🎙️ Voice Agent Features

### Audio Processing
- **Input**: Real-time speech recognition
- **Output**: Natural voice synthesis
- **Quality**: High-fidelity audio
- **Latency**: Low-latency processing

### AI Capabilities
- **Context**: Maintains conversation context
- **Personality**: Empathetic and supportive
- **Knowledge**: Mental wellness expertise
- **Adaptation**: Learns from user interactions

### Session Management
- **State**: Tracks session progress
- **History**: Maintains conversation log
- **Persistence**: Saves important insights
- **Recovery**: Handles disconnections

## 🔧 Configuration

### LiveKit Setup
1. Create LiveKit project
2. Get API credentials
3. Configure room settings
4. Set up webhooks (optional)

### OpenAI Integration
1. Get API key from OpenAI
2. Configure model settings
3. Set up rate limiting
4. Monitor usage

### Backend Integration
1. Ensure backend is running
2. Configure API endpoints
3. Set up authentication
4. Test connectivity

## 🧪 Testing

```bash
# Run tests
npm test

# Test voice functionality
npm run test:voice

# Test AI responses
npm run test:ai
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
docker build -t mindsphere-agent .
docker run -p 3000:3000 mindsphere-agent
```

## 🔧 Development

### Adding New Features
1. Update `voice-agent.ts`
2. Add configuration if needed
3. Update tests
4. Test with LiveKit

### Voice Customization
- Adjust audio quality settings
- Modify speech recognition parameters
- Customize voice synthesis
- Optimize for different devices

### AI Behavior
- Customize response patterns
- Add domain-specific knowledge
- Implement conversation flows
- Handle edge cases

### Error Handling
- No fallback data - fail fast with clear errors
- Comprehensive error logging with correlation IDs
- Service-specific error tracking
- Environment-aware logging levels

### Git Workflow
```bash
# Make changes
git add .
git commit -m "fix: improve voice processing latency"
git push origin fix/voice-latency
```

## 📊 Monitoring

### Health Checks
- Agent status monitoring
- Connection health
- Performance metrics
- Error tracking

### Logging
- Structured logging
- Conversation logs
- Error tracking
- Performance metrics

## 🐛 Troubleshooting

### Common Issues
1. **Connection**: Check LiveKit credentials
2. **Audio**: Verify microphone permissions
3. **AI**: Check OpenAI API key
4. **Backend**: Verify API connectivity

### Debug Mode
```bash
DEBUG=mindsphere:* npm start
```

## 📚 Dependencies

### Core
- `livekit-server-sdk` - LiveKit integration
- `openai` - OpenAI API client
- `typescript` - Type safety

### Voice Processing
- `@livekit/voice-agent` - Voice agent framework
- `node-wav` - Audio processing

### Utilities
- `dotenv` - Environment variables
- `winston` - Logging

## 🔒 Security

### API Keys
- Store securely in environment variables
- Rotate keys regularly
- Monitor usage
- Implement rate limiting

### Voice Data
- Process audio locally when possible
- Encrypt sensitive data
- Follow privacy regulations
- Implement data retention policies

## 📄 License

MIT License - see [LICENSE](../../LICENSE) for details.