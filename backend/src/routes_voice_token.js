const express = require('express');
const { AccessToken } = require('livekit-server-sdk');
const router = express.Router();

// LiveKit credentials from environment
const LIVEKIT_API_KEY = process.env.LIVEKIT_API_KEY;
const LIVEKIT_API_SECRET = process.env.LIVEKIT_API_SECRET;
const LIVEKIT_URL = process.env.LIVEKIT_URL;

async function createToken({ roomName, participantName, participantIdentity }) {
  if (!LIVEKIT_API_KEY || !LIVEKIT_API_SECRET || !LIVEKIT_URL) {
    throw new Error('LiveKit credentials not configured');
  }

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

// Generate LiveKit token for voice sessions
router.post('/token', async (req, res) => {
  try {
    const { 
      roomName = `voice_assistant_room_${Math.floor(Math.random() * 10_000)}`, 
      participantName = 'user',
      participantIdentity = `voice_assistant_user_${Math.floor(Math.random() * 10_000)}`
    } = req.body || {};
    
    const token = await createToken({ roomName, participantName, participantIdentity });
    
    res.json({
      token,
      serverUrl: LIVEKIT_URL,
      roomName,
      participantName,
      participantIdentity
    });
  } catch (error) {
    console.error('Token generation error:', error);
    res.status(500).json({ error: 'Failed to generate token' });
  }
});

// Health check for voice token service
router.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    service: 'LiveKit Token Service',
    configured: !!(LIVEKIT_API_KEY && LIVEKIT_API_SECRET && LIVEKIT_URL)
  });
});

module.exports = router;
