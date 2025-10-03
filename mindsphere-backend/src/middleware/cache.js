const logger = require('../logger');

/**
 * Caching middleware for Express.js
 */

/**
 * In-memory cache for API responses
 */
class ResponseCache {
  constructor(maxSize = 1000, defaultTTL = 5 * 60 * 1000) {
    this.cache = new Map();
    this.maxSize = maxSize;
    this.defaultTTL = defaultTTL;
    this.stats = {
      hits: 0,
      misses: 0,
      sets: 0,
      deletes: 0,
    };
  }

  generateKey(req) {
    const { method, url, query, body } = req;
    const keyData = {
      method,
      url,
      query: JSON.stringify(query),
      body: body ? JSON.stringify(body) : '',
    };
    return Buffer.from(JSON.stringify(keyData)).toString('base64');
  }

  get(req) {
    const key = this.generateKey(req);
    const entry = this.cache.get(key);

    if (!entry) {
      this.stats.misses++;
      return null;
    }

    // Check if expired
    if (Date.now() - entry.timestamp > entry.ttl) {
      this.cache.delete(key);
      this.stats.misses++;
      return null;
    }

    this.stats.hits++;
    return entry.data;
  }

  set(req, data, ttl) {
    const key = this.generateKey(req);
    
    // Remove oldest entries if cache is full
    if (this.cache.size >= this.maxSize) {
      const oldestKey = this.cache.keys().next().value;
      this.cache.delete(oldestKey);
    }

    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl: ttl || this.defaultTTL,
    });

    this.stats.sets++;
  }

  delete(pattern) {
    const keys = Array.from(this.cache.keys());
    let deleted = 0;

    keys.forEach(key => {
      if (key.includes(pattern)) {
        this.cache.delete(key);
        deleted++;
      }
    });

    this.stats.deletes += deleted;
    return deleted;
  }

  clear() {
    this.cache.clear();
    this.stats = {
      hits: 0,
      misses: 0,
      sets: 0,
      deletes: 0,
    };
  }

  getStats() {
    const total = this.stats.hits + this.stats.misses;
    return {
      ...this.stats,
      hitRate: total > 0 ? (this.stats.hits / total * 100).toFixed(2) + '%' : '0%',
      size: this.cache.size,
    };
  }
}

// Create cache instance
const responseCache = new ResponseCache();

/**
 * Cache middleware
 * @param {Object} options - Cache options
 * @returns {Function} Express middleware
 */
function cacheMiddleware(options = {}) {
  const {
    ttl = 5 * 60 * 1000, // 5 minutes
    skipIf = () => false,
    keyGenerator = null,
    vary = [],
  } = options;

  return (req, res, next) => {
    // Skip caching for certain requests
    if (skipIf(req, res)) {
      return next();
    }

    // Skip caching for non-GET requests by default
    if (req.method !== 'GET') {
      return next();
    }

    // Check cache
    const cached = responseCache.get(req);
    if (cached) {
      logger.debug('Cache hit', { url: req.url, method: req.method });
      
      // Set cache headers
      res.set('X-Cache', 'HIT');
      res.set('Cache-Control', `public, max-age=${Math.floor(ttl / 1000)}`);
      
      return res.json(cached);
    }

    // Override res.json to cache response
    const originalJson = res.json;
    res.json = function(data) {
      // Only cache successful responses
      if (res.statusCode >= 200 && res.statusCode < 300) {
        responseCache.set(req, data, ttl);
        logger.debug('Response cached', { url: req.url, method: req.method });
      }

      // Set cache headers
      res.set('X-Cache', 'MISS');
      res.set('Cache-Control', `public, max-age=${Math.floor(ttl / 1000)}`);

      // Call original json method
      return originalJson.call(this, data);
    };

    next();
  };
}

/**
 * ETag middleware for conditional requests
 */
function etagMiddleware() {
  return (req, res, next) => {
    const originalJson = res.json;
    
    res.json = function(data) {
      const etag = generateETag(data);
      
      // Check if client has the same version
      if (req.headers['if-none-match'] === etag) {
        res.status(304).end();
        return;
      }

      res.set('ETag', etag);
      return originalJson.call(this, data);
    };

    next();
  };
}

/**
 * Generate ETag for data
 */
function generateETag(data) {
  const crypto = require('crypto');
  const hash = crypto.createHash('md5').update(JSON.stringify(data)).digest('hex');
  return `"${hash}"`;
}

/**
 * Compression middleware
 */
function compressionMiddleware() {
  const compression = require('compression');
  
  return compression({
    level: 6,
    threshold: 1024, // Only compress responses larger than 1KB
    filter: (req, res) => {
      // Don't compress if client doesn't support it
      if (req.headers['x-no-compression']) {
        return false;
      }
      
      // Use compression filter
      return compression.filter(req, res);
    },
  });
}

/**
 * Static file caching middleware
 */
function staticCacheMiddleware(options = {}) {
  const {
    maxAge = 365 * 24 * 60 * 60 * 1000, // 1 year
    immutable = true,
  } = options;

  return (req, res, next) => {
    // Only apply to static files
    if (req.url.match(/\.(css|js|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$/)) {
      res.set('Cache-Control', `public, max-age=${Math.floor(maxAge / 1000)}${immutable ? ', immutable' : ''}`);
      res.set('Expires', new Date(Date.now() + maxAge).toUTCString());
    }
    
    next();
  };
}

/**
 * Cache invalidation middleware
 */
function cacheInvalidationMiddleware() {
  return (req, res, next) => {
    // Override res.json to invalidate cache on mutations
    const originalJson = res.json;
    
    res.json = function(data) {
      // Invalidate cache for mutations
      if (req.method !== 'GET' && res.statusCode >= 200 && res.statusCode < 300) {
        const pattern = req.baseUrl || req.url.split('?')[0];
        const deleted = responseCache.delete(pattern);
        
        if (deleted > 0) {
          logger.info('Cache invalidated', { pattern, deleted });
        }
      }

      return originalJson.call(this, data);
    };

    next();
  };
}

/**
 * Cache warming middleware
 */
function cacheWarmingMiddleware(routes = []) {
  return (req, res, next) => {
    // Warm cache for specified routes
    if (routes.includes(req.path)) {
      const originalJson = res.json;
      
      res.json = function(data) {
        // Warm cache with longer TTL
        responseCache.set(req, data, 30 * 60 * 1000); // 30 minutes
        logger.debug('Cache warmed', { url: req.url });
        
        return originalJson.call(this, data);
      };
    }

    next();
  };
}

/**
 * Cache statistics endpoint
 */
function getCacheStats(req, res) {
  const stats = responseCache.getStats();
  
  res.json({
    cache: stats,
    timestamp: new Date().toISOString(),
  });
}

/**
 * Clear cache endpoint
 */
function clearCache(req, res) {
  const { pattern } = req.query;
  
  if (pattern) {
    const deleted = responseCache.delete(pattern);
    res.json({
      message: `Cache cleared for pattern: ${pattern}`,
      deleted,
      timestamp: new Date().toISOString(),
    });
  } else {
    responseCache.clear();
    res.json({
      message: 'All cache cleared',
      timestamp: new Date().toISOString(),
    });
  }
}

module.exports = {
  cacheMiddleware,
  etagMiddleware,
  compressionMiddleware,
  staticCacheMiddleware,
  cacheInvalidationMiddleware,
  cacheWarmingMiddleware,
  getCacheStats,
  clearCache,
  responseCache,
};
