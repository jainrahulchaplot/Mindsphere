const compression = require('compression');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const logger = require('../logger');

/**
 * Performance optimization middleware
 */

/**
 * Compression middleware with optimization
 */
function optimizedCompression() {
  return compression({
    level: 6, // Compression level (1-9)
    threshold: 1024, // Only compress responses larger than 1KB
    filter: (req, res) => {
      // Don't compress if client doesn't support it
      if (req.headers['x-no-compression']) {
        return false;
      }
      
      // Don't compress already compressed files
      if (req.url.match(/\.(jpg|jpeg|png|gif|svg|woff|woff2|ttf|eot)$/)) {
        return false;
      }
      
      // Use compression filter
      return compression.filter(req, res);
    },
  });
}

/**
 * Security headers middleware
 */
function securityHeaders() {
  return helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
        fontSrc: ["'self'", "https://fonts.gstatic.com"],
        imgSrc: ["'self'", "data:", "https:"],
        scriptSrc: ["'self'"],
        connectSrc: ["'self'", "wss:", "https:"],
        mediaSrc: ["'self'"],
        objectSrc: ["'none'"],
        frameSrc: ["'none'"],
      },
    },
    crossOriginEmbedderPolicy: false,
    hsts: {
      maxAge: 31536000,
      includeSubDomains: true,
      preload: true,
    },
  });
}

/**
 * Rate limiting middleware
 */
function createRateLimit(options = {}) {
  const {
    windowMs = 15 * 60 * 1000, // 15 minutes
    max = 100, // Limit each IP to 100 requests per windowMs
    message = 'Too many requests from this IP, please try again later.',
    skipSuccessfulRequests = false,
    skipFailedRequests = false,
  } = options;

  return rateLimit({
    windowMs,
    max,
    message: {
      error: message,
      retryAfter: Math.ceil(windowMs / 1000),
    },
    standardHeaders: true,
    legacyHeaders: false,
    skipSuccessfulRequests,
    skipFailedRequests,
    handler: (req, res) => {
      logger.warn('Rate limit exceeded', {
        ip: req.ip,
        url: req.url,
        userAgent: req.get('User-Agent'),
      });
      
      res.status(429).json({
        error: message,
        retryAfter: Math.ceil(windowMs / 1000),
      });
    },
  });
}

/**
 * API rate limiting
 */
function apiRateLimit() {
  return createRateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 1000, // 1000 requests per 15 minutes
    message: 'API rate limit exceeded',
  });
}

/**
 * Auth rate limiting
 */
function authRateLimit() {
  return createRateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // 5 login attempts per 15 minutes
    message: 'Too many authentication attempts',
    skipSuccessfulRequests: true,
  });
}

/**
 * Upload rate limiting
 */
function uploadRateLimit() {
  return createRateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 10, // 10 uploads per hour
    message: 'Upload rate limit exceeded',
  });
}

/**
 * Request size limiting
 */
function requestSizeLimit(maxSize = '10mb') {
  return (req, res, next) => {
    const contentLength = parseInt(req.get('content-length') || '0');
    const maxBytes = parseSize(maxSize);
    
    if (contentLength > maxBytes) {
      logger.warn('Request size limit exceeded', {
        contentLength,
        maxBytes,
        url: req.url,
        ip: req.ip,
      });
      
      return res.status(413).json({
        error: 'Request entity too large',
        maxSize,
      });
    }
    
    next();
  };
}

/**
 * Parse size string to bytes
 */
function parseSize(size) {
  const units = {
    b: 1,
    kb: 1024,
    mb: 1024 * 1024,
    gb: 1024 * 1024 * 1024,
  };
  
  const match = size.toLowerCase().match(/^(\d+(?:\.\d+)?)\s*(b|kb|mb|gb)$/);
  if (!match) return 10 * 1024 * 1024; // Default 10MB
  
  const value = parseFloat(match[1]);
  const unit = match[2];
  
  return Math.floor(value * units[unit]);
}

/**
 * Response time optimization
 */
function responseTimeOptimization() {
  return (req, res, next) => {
    const startTime = Date.now();
    
    // Override res.end to add timing headers
    const originalEnd = res.end;
    res.end = function(chunk, encoding) {
      const responseTime = Date.now() - startTime;
      
      // Add timing headers
      res.set('X-Response-Time', `${responseTime}ms`);
      res.set('X-Process-Time', `${responseTime}ms`);
      
      // Log slow responses
      if (responseTime > 1000) {
        logger.warn('Slow response detected', {
          url: req.url,
          method: req.method,
          responseTime,
          statusCode: res.statusCode,
        });
      }
      
      // Call original end
      originalEnd.call(this, chunk, encoding);
    };
    
    next();
  };
}

/**
 * Connection optimization
 */
function connectionOptimization() {
  return (req, res, next) => {
    // Enable keep-alive
    res.set('Connection', 'keep-alive');
    res.set('Keep-Alive', 'timeout=5, max=1000');
    
    // Add cache headers for static resources
    if (req.url.match(/\.(css|js|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$/)) {
      res.set('Cache-Control', 'public, max-age=31536000, immutable');
      res.set('Expires', new Date(Date.now() + 31536000000).toUTCString());
    }
    
    next();
  };
}

/**
 * Database query optimization
 */
function databaseOptimization() {
  return (req, res, next) => {
    req.dbStartTime = Date.now();
    req.dbQueries = [];
    
    // Override res.end to log database performance
    const originalEnd = res.end;
    res.end = function(chunk, encoding) {
      const dbTime = Date.now() - req.dbStartTime;
      
      if (req.dbQueries.length > 0) {
        // Log database performance
        logger.logPerformance('database', dbTime, {
          queryCount: req.dbQueries.length,
          queries: req.dbQueries,
          url: req.url,
          method: req.method,
        });
        
        // Add database headers
        res.set('X-DB-Queries', req.dbQueries.length);
        res.set('X-DB-Time', `${dbTime}ms`);
      }
      
      // Call original end
      originalEnd.call(this, chunk, encoding);
    };
    
    next();
  };
}

/**
 * Memory optimization
 */
function memoryOptimization() {
  return (req, res, next) => {
    const startMemory = process.memoryUsage();
    
    // Override res.end to monitor memory usage
    const originalEnd = res.end;
    res.end = function(chunk, encoding) {
      const endMemory = process.memoryUsage();
      const memoryDelta = endMemory.heapUsed - startMemory.heapUsed;
      
      // Log high memory usage
      if (memoryDelta > 10 * 1024 * 1024) { // 10MB
        logger.warn('High memory usage detected', {
          memoryDelta,
          heapUsed: endMemory.heapUsed,
          heapTotal: endMemory.heapTotal,
          url: req.url,
          method: req.method,
        });
      }
      
      // Add memory headers
      res.set('X-Memory-Delta', `${memoryDelta} bytes`);
      res.set('X-Memory-Used', `${Math.round(endMemory.heapUsed / 1024 / 1024)}MB`);
      
      // Call original end
      originalEnd.call(this, chunk, encoding);
    };
    
    next();
  };
}

/**
 * CPU optimization
 */
function cpuOptimization() {
  return (req, res, next) => {
    const startUsage = process.cpuUsage();
    
    // Override res.end to monitor CPU usage
    const originalEnd = res.end;
    res.end = function(chunk, encoding) {
      const endUsage = process.cpuUsage(startUsage);
      const cpuTime = (endUsage.user + endUsage.system) / 1000; // Convert to milliseconds
      
      // Log high CPU usage
      if (cpuTime > 100) { // 100ms
        logger.warn('High CPU usage detected', {
          userTime: endUsage.user / 1000,
          systemTime: endUsage.system / 1000,
          totalTime: cpuTime,
          url: req.url,
          method: req.method,
        });
      }
      
      // Add CPU headers
      res.set('X-CPU-Time', `${cpuTime.toFixed(2)}ms`);
      
      // Call original end
      originalEnd.call(this, chunk, encoding);
    };
    
    next();
  };
}

/**
 * Error optimization
 */
function errorOptimization() {
  return (req, res, next) => {
    // Override res.end to optimize error responses
    const originalEnd = res.end;
    res.end = function(chunk, encoding) {
      // Optimize error responses
      if (res.statusCode >= 400) {
        // Add error headers
        res.set('X-Error-Type', 'application_error');
        res.set('X-Error-Time', new Date().toISOString());
        
        // Log error performance
        logger.logPerformance('error', Date.now() - req.startTime, {
          statusCode: res.statusCode,
          url: req.url,
          method: req.method,
          error: res.error || 'Unknown error',
        });
      }
      
      // Call original end
      originalEnd.call(this, chunk, encoding);
    };
    
    next();
  };
}

module.exports = {
  optimizedCompression,
  securityHeaders,
  createRateLimit,
  apiRateLimit,
  authRateLimit,
  uploadRateLimit,
  requestSizeLimit,
  responseTimeOptimization,
  connectionOptimization,
  databaseOptimization,
  memoryOptimization,
  cpuOptimization,
  errorOptimization,
};
