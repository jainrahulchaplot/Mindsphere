const logger = require('../logger');

/**
 * Global error handler middleware
 * @param {Error} err - Error object
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
function errorHandler(err, req, res, next) {
  // Log the error
  logger.error('Unhandled error:', {
    message: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
    ip: req.ip,
    userAgent: req.get('User-Agent'),
    timestamp: new Date().toISOString(),
  });

  // Default error response
  let statusCode = 500;
  let message = 'Internal Server Error';
  let details = null;

  // Handle specific error types
  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = 'Validation Error';
    details = err.details || err.message;
  } else if (err.name === 'UnauthorizedError') {
    statusCode = 401;
    message = 'Unauthorized';
  } else if (err.name === 'ForbiddenError') {
    statusCode = 403;
    message = 'Forbidden';
  } else if (err.name === 'NotFoundError') {
    statusCode = 404;
    message = 'Not Found';
  } else if (err.name === 'ConflictError') {
    statusCode = 409;
    message = 'Conflict';
  } else if (err.name === 'RateLimitError') {
    statusCode = 429;
    message = 'Too Many Requests';
  } else if (err.name === 'DatabaseError') {
    statusCode = 500;
    message = 'Database Error';
  } else if (err.name === 'ExternalServiceError') {
    statusCode = 502;
    message = 'External Service Error';
  } else if (err.statusCode) {
    statusCode = err.statusCode;
    message = err.message;
  }

  // Don't expose internal errors in production
  if (process.env.NODE_ENV === 'production' && statusCode === 500) {
    message = 'Internal Server Error';
    details = null;
  }

  // Send error response
  res.status(statusCode).json({
    error: {
      message,
      statusCode,
      timestamp: new Date().toISOString(),
      path: req.url,
      method: req.method,
      ...(details && { details }),
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    },
  });
}

/**
 * 404 handler middleware
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
function notFoundHandler(req, res, next) {
  const error = new Error(`Route not found: ${req.method} ${req.url}`);
  error.name = 'NotFoundError';
  error.statusCode = 404;
  next(error);
}

/**
 * Async error wrapper
 * @param {Function} fn - Async function to wrap
 * @returns {Function} Wrapped function
 */
function asyncHandler(fn) {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

/**
 * Validation error handler
 * @param {Error} err - Validation error
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
function validationErrorHandler(err, req, res, next) {
  if (err.name === 'ValidationError' || err.isJoi) {
    const details = err.details || err.details?.map(detail => ({
      field: detail.path?.join('.'),
      message: detail.message,
    }));

    return res.status(400).json({
      error: {
        message: 'Validation Error',
        statusCode: 400,
        timestamp: new Date().toISOString(),
        path: req.url,
        method: req.method,
        details,
      },
    });
  }
  next(err);
}

/**
 * Rate limiting error handler
 * @param {Error} err - Rate limit error
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
function rateLimitErrorHandler(err, req, res, next) {
  if (err.name === 'RateLimitError') {
    return res.status(429).json({
      error: {
        message: 'Too Many Requests',
        statusCode: 429,
        timestamp: new Date().toISOString(),
        path: req.url,
        method: req.method,
        retryAfter: err.retryAfter || 60,
      },
    });
  }
  next(err);
}

module.exports = {
  errorHandler,
  notFoundHandler,
  asyncHandler,
  validationErrorHandler,
  rateLimitErrorHandler,
};
