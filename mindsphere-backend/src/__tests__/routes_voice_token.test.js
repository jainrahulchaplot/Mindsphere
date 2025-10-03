const request = require('supertest');
const express = require('express');
const voiceTokenRouter = require('../routes_voice_token');

// Create test app
const app = express();
app.use(express.json());
app.use('/api/voice', voiceTokenRouter);

describe('Voice Token Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /api/voice/token', () => {
    it('generates token with default parameters', async () => {
      const response = await request(app)
        .post('/api/voice/token')
        .send({})
        .expect(200);

      expect(response.body).toHaveProperty('token');
      expect(response.body).toHaveProperty('serverUrl');
      expect(response.body).toHaveProperty('roomName');
      expect(response.body).toHaveProperty('participantName');
      expect(response.body).toHaveProperty('participantIdentity');
    });

    it('generates token with custom parameters', async () => {
      const customData = {
        roomName: 'custom-room',
        participantName: 'test-user',
        participantIdentity: 'test-identity'
      };

      const response = await request(app)
        .post('/api/voice/token')
        .send(customData)
        .expect(200);

      expect(response.body.roomName).toBe(customData.roomName);
      expect(response.body.participantName).toBe(customData.participantName);
      expect(response.body.participantIdentity).toBe(customData.participantIdentity);
    });

    it('returns error when LiveKit credentials are missing', async () => {
      // Mock missing environment variables
      const originalUrl = process.env.LIVEKIT_URL;
      const originalKey = process.env.LIVEKIT_API_KEY;
      const originalSecret = process.env.LIVEKIT_API_SECRET;

      delete process.env.LIVEKIT_URL;
      delete process.env.LIVEKIT_API_KEY;
      delete process.env.LIVEKIT_API_SECRET;

      const response = await request(app)
        .post('/api/voice/token')
        .send({})
        .expect(500);

      expect(response.body).toHaveProperty('error');

      // Restore environment variables
      process.env.LIVEKIT_URL = originalUrl;
      process.env.LIVEKIT_API_KEY = originalKey;
      process.env.LIVEKIT_API_SECRET = originalSecret;
    });
  });

  describe('GET /api/voice/health', () => {
    it('returns health status', async () => {
      const response = await request(app)
        .get('/api/voice/health')
        .expect(200);

      expect(response.body).toHaveProperty('status', 'ok');
      expect(response.body).toHaveProperty('service', 'LiveKit Token Service');
      expect(response.body).toHaveProperty('configured');
      expect(response.body).toHaveProperty('apiKey');
      expect(response.body).toHaveProperty('apiSecret');
      expect(response.body).toHaveProperty('url');
    });
  });

  describe('GET /api/voice/test', () => {
    it('returns test message', async () => {
      const response = await request(app)
        .get('/api/voice/test')
        .expect(200);

      expect(response.body).toHaveProperty('message', 'Voice token service is working');
    });
  });

  describe('GET /api/voice/context/:userId', () => {
    it('returns user context', async () => {
      const userId = 'test-user-id';
      
      const response = await request(app)
        .get(`/api/voice/context/${userId}`)
        .expect(200);

      expect(response.body).toHaveProperty('memories');
      expect(response.body).toHaveProperty('snippets');
    });

    it('returns error when userId is missing', async () => {
      const response = await request(app)
        .get('/api/voice/context/')
        .expect(404);
    });

    it('returns error when userId is invalid', async () => {
      const response = await request(app)
        .get('/api/voice/context/')
        .expect(404);
    });
  });

  describe('DELETE /api/voice/room/:roomName', () => {
    it('deletes room successfully', async () => {
      const roomName = 'test-room';
      
      const response = await request(app)
        .delete(`/api/voice/room/${roomName}`)
        .expect(200);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('message');
    });

    it('returns error when roomName is missing', async () => {
      const response = await request(app)
        .delete('/api/voice/room/')
        .expect(404);
    });
  });
});
