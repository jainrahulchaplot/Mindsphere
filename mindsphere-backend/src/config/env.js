const Joi = require('joi');
const logger = require('../logger');

// Environment validation schema
const envSchema = Joi.object({
  // Server Configuration
  NODE_ENV: Joi.string()
    .valid('development', 'production', 'test')
    .default('development'),
  PORT: Joi.number()
    .port()
    .default(8000),
  FRONTEND_ORIGIN: Joi.string()
    .default('*'),

  // Supabase Configuration
  SUPABASE_URL: Joi.string()
    .uri()
    .required()
    .messages({
      'string.uri': 'SUPABASE_URL must be a valid URL',
      'any.required': 'SUPABASE_URL is required'
    }),
  SUPABASE_SERVICE_ROLE_KEY: Joi.string()
    .min(20)
    .required()
    .messages({
      'string.min': 'SUPABASE_SERVICE_ROLE_KEY must be at least 20 characters',
      'any.required': 'SUPABASE_SERVICE_ROLE_KEY is required'
    }),
  SUPABASE_ANON_KEY: Joi.string()
    .min(20)
    .required()
    .messages({
      'string.min': 'SUPABASE_ANON_KEY must be at least 20 characters',
      'any.required': 'SUPABASE_ANON_KEY is required'
    }),
  SUPABASE_AUTH_ENABLED: Joi.boolean()
    .default(false),

  // OpenAI Configuration
  OPENAI_API_KEY: Joi.string()
    .min(20)
    .required()
    .messages({
      'string.min': 'OPENAI_API_KEY must be at least 20 characters',
      'any.required': 'OPENAI_API_KEY is required'
    }),
  OPENAI_MODEL: Joi.string()
    .default('gpt-4o-realtime-preview-2024-10-01'),

  // Google Cloud TTS Configuration
  GOOGLE_APPLICATION_CREDENTIALS: Joi.string()
    .when('TTS_PROVIDER', {
      is: 'cloud_tts',
      then: Joi.required(),
      otherwise: Joi.optional()
    }),
  TTS_PROVIDER: Joi.string()
    .valid('cloud_tts', 'local')
    .default('cloud_tts'),
  CLOUD_TTS_VOICE: Joi.string()
    .default('en-US-Studio-O'),
  CLOUD_TTS_RATE: Joi.number()
    .min(0.25)
    .max(4.0)
    .default(0.85),
  CLOUD_TTS_PITCH: Joi.number()
    .min(-20.0)
    .max(20.0)
    .default(-2.0),
  CLOUD_TTS_DEVICE_PROFILE: Joi.string()
    .default('small-bluetooth-speaker-class-device'),

  // LiveKit Configuration
  LIVEKIT_URL: Joi.string()
    .uri()
    .required()
    .messages({
      'string.uri': 'LIVEKIT_URL must be a valid WebSocket URL',
      'any.required': 'LIVEKIT_URL is required'
    }),
  LIVEKIT_API_KEY: Joi.string()
    .min(10)
    .required()
    .messages({
      'string.min': 'LIVEKIT_API_KEY must be at least 10 characters',
      'any.required': 'LIVEKIT_API_KEY is required'
    }),
  LIVEKIT_API_SECRET: Joi.string()
    .min(20)
    .required()
    .messages({
      'string.min': 'LIVEKIT_API_SECRET must be at least 20 characters',
      'any.required': 'LIVEKIT_API_SECRET is required'
    }),

  // Gemini Configuration (Optional)
  GEMINI_API_KEY: Joi.string()
    .min(20)
    .optional(),

  // Logging Configuration
  LOG_LEVEL: Joi.string()
    .valid('error', 'warn', 'info', 'http', 'verbose', 'debug', 'silly')
    .default('info'),
  LOG_FORMAT: Joi.string()
    .valid('json', 'simple', 'combined')
    .default('json'),
  LOG_FILE: Joi.string()
    .default('backend.log'),

  // Security Configuration
  JWT_SECRET: Joi.string()
    .min(32)
    .default('your-jwt-secret-change-in-production'),
  SESSION_SECRET: Joi.string()
    .min(32)
    .default('your-session-secret-change-in-production'),
  CORS_ORIGIN: Joi.string()
    .default('http://localhost:5173'),

  // Performance Configuration
  MAX_REQUEST_SIZE: Joi.string()
    .default('10mb'),
  REQUEST_TIMEOUT: Joi.number()
    .min(1000)
    .default(30000),
  KEEP_ALIVE_TIMEOUT: Joi.number()
    .min(1000)
    .default(5000),
});

/**
 * Validate environment variables
 * @returns {Object} Validated environment configuration
 */
function validateEnv() {
  try {
    const { error, value } = envSchema.validate(process.env, {
      allowUnknown: true,
      stripUnknown: true,
      abortEarly: false
    });

    if (error) {
      const errorMessages = error.details.map(detail => detail.message).join('\n');
      logger.error('Environment validation failed:', errorMessages);
      throw new Error(`Environment validation failed:\n${errorMessages}`);
    }

    logger.info('Environment validation successful');
    return value;
  } catch (err) {
    logger.error('Failed to validate environment:', err.message);
    throw err;
  }
}

/**
 * Check if running in production
 * @returns {boolean}
 */
function isProduction() {
  return process.env.NODE_ENV === 'production';
}

/**
 * Check if running in development
 * @returns {boolean}
 */
function isDevelopment() {
  return process.env.NODE_ENV === 'development';
}

/**
 * Check if running in test
 * @returns {boolean}
 */
function isTest() {
  return process.env.NODE_ENV === 'test';
}

/**
 * Get environment-specific configuration
 * @returns {Object}
 */
function getEnvConfig() {
  const config = validateEnv();
  
  return {
    ...config,
    isProduction: isProduction(),
    isDevelopment: isDevelopment(),
    isTest: isTest(),
  };
}

module.exports = {
  validateEnv,
  isProduction,
  isDevelopment,
  isTest,
  getEnvConfig,
  envSchema
};
