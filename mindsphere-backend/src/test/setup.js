// Backend test setup
const { jest } = require('@jest/globals');

// Mock environment variables
process.env.NODE_ENV = 'test';
process.env.PORT = '8001';
process.env.SUPABASE_URL = 'https://test-project.supabase.co';
process.env.SUPABASE_SERVICE_ROLE_KEY = 'test_service_role_key';
process.env.SUPABASE_ANON_KEY = 'test_anon_key';
process.env.OPENAI_API_KEY = 'test_openai_key';
process.env.LIVEKIT_URL = 'wss://test-livekit.com';
process.env.LIVEKIT_API_KEY = 'test_livekit_key';
process.env.LIVEKIT_API_SECRET = 'test_livekit_secret';

// Mock console methods to reduce noise in tests
const originalConsoleLog = console.log;
const originalConsoleError = console.error;
const originalConsoleWarn = console.warn;

// Suppress console output during tests unless explicitly enabled
if (process.env.VERBOSE_TESTS !== 'true') {
  console.log = jest.fn();
  console.error = jest.fn();
  console.warn = jest.fn();
}

beforeEach(() => {
  // Reset all mocks before each test
  jest.clearAllMocks();
});

afterEach(() => {
  // Restore console methods
  console.log = originalConsoleLog;
  console.error = originalConsoleError;
  console.warn = originalConsoleWarn;
});

// Global test utilities
global.mockFetch = (response, ok = true) => {
  global.fetch = jest.fn().mockResolvedValueOnce({
    ok,
    json: async () => response,
    text: async () => JSON.stringify(response),
  });
};

global.mockFetchError = (error) => {
  global.fetch = jest.fn().mockRejectedValueOnce(new Error(error));
};

// Mock Supabase client
jest.mock('@supabase/supabase-js', () => ({
  createClient: jest.fn(() => ({
    from: jest.fn(() => ({
      select: jest.fn().mockReturnThis(),
      insert: jest.fn().mockReturnThis(),
      update: jest.fn().mockReturnThis(),
      delete: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      single: jest.fn(),
      then: jest.fn(),
    })),
    auth: {
      getUser: jest.fn(),
      getSession: jest.fn(),
      signInWithPassword: jest.fn(),
      signUp: jest.fn(),
      signOut: jest.fn(),
    },
  })),
}));

// Mock OpenAI
jest.mock('openai', () => {
  return jest.fn().mockImplementation(() => ({
    chat: {
      completions: {
        create: jest.fn().mockResolvedValue({
          choices: [{
            message: {
              content: 'Test response'
            }
          }]
        })
      }
    }
  }));
});

// Mock LiveKit
jest.mock('livekit-server-sdk', () => ({
  AccessToken: jest.fn().mockImplementation(() => ({
    addGrant: jest.fn(),
    toJwt: jest.fn().mockReturnValue('mock-jwt-token')
  }))
}));

// Mock Google Cloud TTS
jest.mock('@google-cloud/text-to-speech', () => ({
  TextToSpeechClient: jest.fn().mockImplementation(() => ({
    synthesizeSpeech: jest.fn().mockResolvedValue({
      audioContent: Buffer.from('mock-audio-data')
    })
  }))
}));

// Mock fs module
jest.mock('fs', () => ({
  existsSync: jest.fn(),
  readFileSync: jest.fn(),
  writeFileSync: jest.fn(),
  mkdirSync: jest.fn(),
}));

// Mock path module
jest.mock('path', () => ({
  join: jest.fn((...args) => args.join('/')),
  resolve: jest.fn((...args) => args.join('/')),
  dirname: jest.fn(),
  basename: jest.fn(),
}));

// Test timeout
jest.setTimeout(10000);
