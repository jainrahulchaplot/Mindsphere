const logger = require('../logger');

/**
 * Performance monitoring middleware
 */

/**
 * Request timing middleware
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
function requestTiming(req, res, next) {
  const startTime = Date.now();
  const startMemory = process.memoryUsage();
  
  // Store timing info on request
  req.startTime = startTime;
  req.startMemory = startMemory;
  
  // Override res.end to capture response time
  const originalEnd = res.end;
  res.end = function(chunk, encoding) {
    const endTime = Date.now();
    const endMemory = process.memoryUsage();
    
    const responseTime = endTime - startTime;
    const memoryDelta = endMemory.heapUsed - startMemory.heapUsed;
    
    // Log performance metrics
    logger.logPerformance('request', responseTime, {
      method: req.method,
      url: req.url,
      statusCode: res.statusCode,
      memoryDelta: memoryDelta,
      userAgent: req.get('User-Agent'),
      ip: req.ip,
    });
    
    // Add performance headers
    res.set('X-Response-Time', `${responseTime}ms`);
    res.set('X-Memory-Usage', `${memoryDelta} bytes`);
    
    // Call original end
    originalEnd.call(this, chunk, encoding);
  };
  
  next();
}

/**
 * Memory usage monitoring middleware
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
function memoryMonitoring(req, res, next) {
  const memoryUsage = process.memoryUsage();
  
  // Log memory usage if it's high
  if (memoryUsage.heapUsed > 100 * 1024 * 1024) { // 100MB
    logger.warn('High memory usage detected', {
      heapUsed: memoryUsage.heapUsed,
      heapTotal: memoryUsage.heapTotal,
      external: memoryUsage.external,
      rss: memoryUsage.rss,
    });
  }
  
  // Add memory info to response headers
  res.set('X-Memory-Heap-Used', `${Math.round(memoryUsage.heapUsed / 1024 / 1024)}MB`);
  res.set('X-Memory-Heap-Total', `${Math.round(memoryUsage.heapTotal / 1024 / 1024)}MB`);
  
  next();
}

/**
 * CPU usage monitoring middleware
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
function cpuMonitoring(req, res, next) {
  const startUsage = process.cpuUsage();
  
  // Override res.end to capture CPU usage
  const originalEnd = res.end;
  res.end = function(chunk, encoding) {
    const endUsage = process.cpuUsage(startUsage);
    const cpuTime = (endUsage.user + endUsage.system) / 1000; // Convert to milliseconds
    
    // Log CPU usage if it's high
    if (cpuTime > 100) { // 100ms
      logger.warn('High CPU usage detected', {
        userTime: endUsage.user / 1000,
        systemTime: endUsage.system / 1000,
        totalTime: cpuTime,
        method: req.method,
        url: req.url,
      });
    }
    
    // Add CPU info to response headers
    res.set('X-CPU-Time', `${cpuTime.toFixed(2)}ms`);
    
    // Call original end
    originalEnd.call(this, chunk, encoding);
  };
  
  next();
}

/**
 * Database query performance monitoring
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
function databaseMonitoring(req, res, next) {
  req.dbQueries = [];
  req.dbStartTime = Date.now();
  
  // Override res.end to log database performance
  const originalEnd = res.end;
  res.end = function(chunk, encoding) {
    const totalTime = Date.now() - req.dbStartTime;
    
    if (req.dbQueries.length > 0) {
      logger.logPerformance('database', totalTime, {
        queryCount: req.dbQueries.length,
        queries: req.dbQueries,
        method: req.method,
        url: req.url,
      });
      
      // Add database info to response headers
      res.set('X-DB-Queries', req.dbQueries.length);
      res.set('X-DB-Time', `${totalTime}ms`);
    }
    
    // Call original end
    originalEnd.call(this, chunk, encoding);
  };
  
  next();
}

/**
 * API response time monitoring
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
function apiResponseTime(req, res, next) {
  const startTime = Date.now();
  
  // Override res.end to capture API response time
  const originalEnd = res.end;
  res.end = function(chunk, encoding) {
    const responseTime = Date.now() - startTime;
    
    // Log slow API responses
    if (responseTime > 1000) { // 1 second
      logger.warn('Slow API response detected', {
        method: req.method,
        url: req.url,
        responseTime: responseTime,
        statusCode: res.statusCode,
      });
    }
    
    // Add response time to headers
    res.set('X-Response-Time', `${responseTime}ms`);
    
    // Call original end
    originalEnd.call(this, chunk, encoding);
  };
  
  next();
}

/**
 * Error performance monitoring
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
function errorPerformanceMonitoring(req, res, next) {
  // Override res.end to capture error performance
  const originalEnd = res.end;
  res.end = function(chunk, encoding) {
    if (res.statusCode >= 400) {
      const responseTime = Date.now() - req.startTime;
      
      logger.logPerformance('error', responseTime, {
        method: req.method,
        url: req.url,
        statusCode: res.statusCode,
        error: res.error || 'Unknown error',
      });
    }
    
    // Call original end
    originalEnd.call(this, chunk, encoding);
  };
  
  next();
}

/**
 * Performance metrics collection
 */
class PerformanceCollector {
  constructor() {
    this.metrics = new Map();
    this.startTime = Date.now();
  }

  /**
   * Record a performance metric
   * @param {string} name - Metric name
   * @param {number} value - Metric value
   * @param {Object} metadata - Additional metadata
   */
  record(name, value, metadata = {}) {
    if (!this.metrics.has(name)) {
      this.metrics.set(name, []);
    }
    
    this.metrics.get(name).push({
      value,
      timestamp: Date.now(),
      metadata,
    });
  }

  /**
   * Get metric statistics
   * @param {string} name - Metric name
   * @returns {Object} Statistics
   */
  getStats(name) {
    const values = this.metrics.get(name) || [];
    
    if (values.length === 0) {
      return null;
    }
    
    const numbers = values.map(v => v.value).sort((a, b) => a - b);
    
    return {
      count: numbers.length,
      min: numbers[0],
      max: numbers[numbers.length - 1],
      avg: numbers.reduce((a, b) => a + b, 0) / numbers.length,
      median: numbers[Math.floor(numbers.length / 2)],
      p95: numbers[Math.floor(numbers.length * 0.95)],
      p99: numbers[Math.floor(numbers.length * 0.99)],
    };
  }

  /**
   * Get all metrics
   * @returns {Object} All metrics
   */
  getAllMetrics() {
    const result = {};
    
    for (const [name, values] of this.metrics) {
      result[name] = {
        stats: this.getStats(name),
        values: values.slice(-100), // Keep last 100 values
      };
    }
    
    return result;
  }

  /**
   * Reset metrics
   */
  reset() {
    this.metrics.clear();
    this.startTime = Date.now();
  }
}

// Create global performance collector
const performanceCollector = new PerformanceCollector();

/**
 * Get performance metrics endpoint
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
function getPerformanceMetrics(req, res) {
  const metrics = performanceCollector.getAllMetrics();
  const uptime = Date.now() - performanceCollector.startTime;
  
  res.json({
    uptime,
    metrics,
    memory: process.memoryUsage(),
    cpu: process.cpuUsage(),
    timestamp: new Date().toISOString(),
  });
}

/**
 * Reset performance metrics endpoint
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
function resetPerformanceMetrics(req, res) {
  performanceCollector.reset();
  
  res.json({
    message: 'Performance metrics reset successfully',
    timestamp: new Date().toISOString(),
  });
}

module.exports = {
  requestTiming,
  memoryMonitoring,
  cpuMonitoring,
  databaseMonitoring,
  apiResponseTime,
  errorPerformanceMonitoring,
  performanceCollector,
  getPerformanceMetrics,
  resetPerformanceMetrics,
};
