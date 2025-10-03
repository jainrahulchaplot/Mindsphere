/** @type {import('jest').Config} */
module.exports = {
  // Test environment
  testEnvironment: 'node',
  
  // Setup files
  setupFilesAfterEnv: ['<rootDir>/src/test/setup.js'],
  
  // Module name mapping
  moduleNameMapping: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  
  // Transform files
  transform: {
    '^.+\\.(js)$': ['babel-jest', {
      presets: ['@babel/preset-env'],
    }],
  },
  
  // File extensions
  moduleFileExtensions: ['js', 'json'],
  
  // Test patterns
  testMatch: [
    '<rootDir>/src/**/__tests__/**/*.js',
    '<rootDir>/src/**/*.{test,spec}.js',
    '<rootDir>/__tests__/**/*.js',
  ],
  
  // Coverage configuration
  collectCoverageFrom: [
    'src/**/*.js',
    '!src/**/*.test.js',
    '!src/**/*.spec.js',
    '!src/test/**',
    '!src/**/__tests__/**',
    '!src/**/__mocks__/**',
  ],
  
  // Coverage thresholds
  coverageThreshold: {
    global: {
      branches: 60,
      functions: 60,
      lines: 60,
      statements: 60,
    },
  },
  
  // Coverage reporters
  coverageReporters: ['text', 'lcov', 'html', 'json'],
  
  // Test timeout
  testTimeout: 10000,
  
  // Clear mocks between tests
  clearMocks: true,
  
  // Restore mocks between tests
  restoreMocks: true,
  
  // Verbose output
  verbose: true,
  
  // Ignore patterns
  testPathIgnorePatterns: [
    '<rootDir>/node_modules/',
    '<rootDir>/logs/',
  ],
  
  // Module ignore patterns
  modulePathIgnorePatterns: [
    '<rootDir>/node_modules/',
    '<rootDir>/logs/',
  ],
  
  // Global setup
  globalSetup: '<rootDir>/src/test/globalSetup.js',
  
  // Global teardown
  globalTeardown: '<rootDir>/src/test/globalTeardown.js',
};
