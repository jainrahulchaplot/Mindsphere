const request = require('supertest');
const express = require('express');

/**
 * Create a test Express app
 * @param {Object} routes - Routes to mount
 * @returns {Object} Express app instance
 */
function createTestApp(routes = {}) {
  const app = express();
  
  // Middleware
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  
  // Mount routes
  Object.entries(routes).forEach(([path, router]) => {
    app.use(path, router);
  });
  
  return app;
}

/**
 * Mock Supabase client for tests
 * @param {Object} overrides - Override default mock behavior
 * @returns {Object} Mocked Supabase client
 */
function mockSupabaseClient(overrides = {}) {
  const defaultMock = {
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
  };

  return { ...defaultMock, ...overrides };
}

/**
 * Mock OpenAI client for tests
 * @param {Object} overrides - Override default mock behavior
 * @returns {Object} Mocked OpenAI client
 */
function mockOpenAIClient(overrides = {}) {
  const defaultMock = {
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
  };

  return { ...defaultMock, ...overrides };
}

/**
 * Mock LiveKit client for tests
 * @param {Object} overrides - Override default mock behavior
 * @returns {Object} Mocked LiveKit client
 */
function mockLiveKitClient(overrides = {}) {
  const defaultMock = {
    AccessToken: jest.fn().mockImplementation(() => ({
      addGrant: jest.fn(),
      toJwt: jest.fn().mockReturnValue('mock-jwt-token')
    }))
  };

  return { ...defaultMock, ...overrides };
}

/**
 * Mock Google Cloud TTS client for tests
 * @param {Object} overrides - Override default mock behavior
 * @returns {Object} Mocked TTS client
 */
function mockTTSClient(overrides = {}) {
  const defaultMock = {
    synthesizeSpeech: jest.fn().mockResolvedValue({
      audioContent: Buffer.from('mock-audio-data')
    })
  };

  return { ...defaultMock, ...overrides };
}

/**
 * Create test data factories
 */
const testDataFactories = {
  createMockUser: (overrides = {}) => ({
    id: 'test-user-id',
    email: 'test@example.com',
    name: 'Test User',
    created_at: new Date().toISOString(),
    ...overrides,
  }),

  createMockSession: (overrides = {}) => ({
    id: 'test-session-id',
    user_id: 'test-user-id',
    mood: 'calm',
    duration: 10,
    style: 'breathwork',
    notes: 'Test session notes',
    created_at: new Date().toISOString(),
    ...overrides,
  }),

  createMockJournal: (overrides = {}) => ({
    id: 'test-journal-id',
    user_id: 'test-user-id',
    content: 'Test journal entry',
    mood: 'happy',
    created_at: new Date().toISOString(),
    ...overrides,
  }),

  createMockMemory: (overrides = {}) => ({
    id: 'test-memory-id',
    user_id: 'test-user-id',
    content: 'Test memory',
    type: 'session',
    created_at: new Date().toISOString(),
    ...overrides,
  }),

  createMockSnippet: (overrides = {}) => ({
    id: 'test-snippet-id',
    user_id: 'test-user-id',
    content: 'Test snippet',
    type: 'meditation',
    created_at: new Date().toISOString(),
    ...overrides,
  }),
};

/**
 * Mock environment variables for tests
 * @param {Object} envVars - Environment variables to set
 */
function mockEnvVars(envVars = {}) {
  const defaultEnv = {
    NODE_ENV: 'test',
    PORT: '8001',
    SUPABASE_URL: 'https://test-project.supabase.co',
    SUPABASE_SERVICE_ROLE_KEY: 'test_service_role_key',
    SUPABASE_ANON_KEY: 'test_anon_key',
    OPENAI_API_KEY: 'test_openai_key',
    LIVEKIT_URL: 'wss://test-livekit.com',
    LIVEKIT_API_KEY: 'test_livekit_key',
    LIVEKIT_API_SECRET: 'test_livekit_secret',
  };

  const envToSet = { ...defaultEnv, ...envVars };
  
  Object.entries(envToSet).forEach(([key, value]) => {
    process.env[key] = value;
  });

  return envToSet;
}

/**
 * Clean up environment variables
 * @param {Array} keys - Keys to clean up
 */
function cleanupEnvVars(keys = []) {
  keys.forEach(key => {
    delete process.env[key];
  });
}

/**
 * Wait for async operations
 * @param {number} ms - Milliseconds to wait
 * @returns {Promise} Promise that resolves after delay
 */
function waitFor(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Test assertion helpers
 */
const testAssertions = {
  expectSuccessResponse: (response) => {
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('success', true);
  },

  expectErrorResponse: (response, statusCode = 400) => {
    expect(response.status).toBe(statusCode);
    expect(response.body).toHaveProperty('error');
  },

  expectValidationError: (response) => {
    expect(response.status).toBe(400);
    expect(response.body.error).toHaveProperty('message', 'Validation Error');
  },

  expectUnauthorizedError: (response) => {
    expect(response.status).toBe(401);
    expect(response.body.error).toHaveProperty('message', 'Unauthorized');
  },

  expectNotFoundError: (response) => {
    expect(response.status).toBe(404);
    expect(response.body.error).toHaveProperty('message', 'Not Found');
  },
};

module.exports = {
  createTestApp,
  mockSupabaseClient,
  mockOpenAIClient,
  mockLiveKitClient,
  mockTTSClient,
  testDataFactories,
  mockEnvVars,
  cleanupEnvVars,
  waitFor,
  testAssertions,
};
