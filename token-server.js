import express from 'express';
import { AccessToken } from 'livekit-server-sdk';
import cors from 'cors';

// LiveKit credentials
const LIVEKIT_API_KEY = 'APIb8zqSRy4wpfd';
const LIVEKIT_API_SECRET = 'hGwWNh1HSphPBWOAukRw6z7g5idUJUNNWPLIKzdQK9J';

async function createToken({ roomName, participantName, participantIdentity }) {
  const at = new AccessToken(LIVEKIT_API_KEY, LIVEKIT_API_SECRET, {
    identity: participantIdentity || participantName,
    name: participantName,
    ttl: '15m',
  });
  
  at.addGrant({
    roomJoin: true,
    room: roomName,
    canPublish: true,
    canPublishData: true,
    canSubscribe: true,
    canUpdateOwnMetadata: true,
  });
  
  return at.toJwt();
}

const app = express();
const port = 3001;

// Enable CORS for all origins
app.use(cors());
app.use(express.json());

app.post('/token', async (req, res) => {
  try {
    const { 
      roomName = `voice_assistant_room_${Math.floor(Math.random() * 10_000)}`, 
      participantName = 'user',
      participantIdentity = `voice_assistant_user_${Math.floor(Math.random() * 10_000)}`
    } = req.body || {};
    
    const token = await createToken({ roomName, participantName, participantIdentity });
    
    res.json({
      token,
      serverUrl: 'wss://mindsphere-1613vohm.livekit.cloud',
      roomName,
      participantName,
      participantIdentity
    });
  } catch (error) {
    console.error('Token generation error:', error);
    res.status(500).json({ error: 'Failed to generate token' });
  }
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'LiveKit Token Server' });
});

app.listen(port, () => {
  console.log(`🚀 LiveKit Token Server running on port ${port}`);
  console.log(`🔗 Health check: http://localhost:${port}/health`);
  console.log(`🎫 Token endpoint: http://localhost:${port}/token`);
});
