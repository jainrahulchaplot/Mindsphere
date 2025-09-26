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
    configured: !!(LIVEKIT_API_KEY && LIVEKIT_API_SECRET && LIVEKIT_URL),
    apiKey: LIVEKIT_API_KEY ? 'Set' : 'Missing',
    apiSecret: LIVEKIT_API_SECRET ? 'Set' : 'Missing',
    url: LIVEKIT_URL ? 'Set' : 'Missing'
  });
});

// Test endpoint
router.get('/test', (req, res) => {
  res.json({ message: 'Voice token service is working' });
});

// Delete room endpoint
router.delete('/room/:roomName', async (req, res) => {
  try {
    const { roomName } = req.params;
    
    if (!roomName) {
      return res.status(400).json({ error: 'Room name is required' });
    }

    // Import RoomServiceClient dynamically to avoid issues
    const { RoomServiceClient } = require('livekit-server-sdk');
    
    const roomServiceClient = new RoomServiceClient(
      LIVEKIT_URL,
      LIVEKIT_API_KEY,
      LIVEKIT_API_SECRET
    );

    await roomServiceClient.deleteRoom(roomName);
    
    res.json({ 
      success: true, 
      message: `Room ${roomName} deleted successfully` 
    });
  } catch (error) {
    console.error('Error deleting room:', error);
    res.status(500).json({ error: 'Failed to delete room' });
  }
});

// Get user context for voice agent
router.get('/context/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    
    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }

    // Get personalization context from vector database using existing service
    const vectorDB = require('./vector-db-service');
    const personalizationContext = await vectorDB.getPersonalizationContext(
      userId, 
      'meditation', 
      'calm', 
      'voice session'
    );

    // Return the same format as the existing system
    res.json(personalizationContext);
  } catch (error) {
    console.error('Error getting user context:', error);
    res.status(500).json({ error: 'Failed to get user context' });
  }
});

module.exports = router;
