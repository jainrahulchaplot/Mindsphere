const logger = require('../logger');

describe('Logger', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('creates logger instance', () => {
    expect(logger).toBeDefined();
    expect(logger.info).toBeInstanceOf(Function);
    expect(logger.error).toBeInstanceOf(Function);
    expect(logger.warn).toBeInstanceOf(Function);
    expect(logger.debug).toBeInstanceOf(Function);
  });

  it('logs info messages', () => {
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
    
    logger.info('Test info message');
    
    expect(consoleSpy).toHaveBeenCalled();
    consoleSpy.mockRestore();
  });

  it('logs error messages', () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
    
    logger.error('Test error message');
    
    expect(consoleSpy).toHaveBeenCalled();
    consoleSpy.mockRestore();
  });

  it('logs warning messages', () => {
    const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();
    
    logger.warn('Test warning message');
    
    expect(consoleSpy).toHaveBeenCalled();
    consoleSpy.mockRestore();
  });

  it('logs debug messages', () => {
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
    
    logger.debug('Test debug message');
    
    expect(consoleSpy).toHaveBeenCalled();
    consoleSpy.mockRestore();
  });

  it('logs errors with context', () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
    const error = new Error('Test error');
    const context = { userId: '123', action: 'test' };
    
    logger.logError(error, context);
    
    expect(consoleSpy).toHaveBeenCalled();
    consoleSpy.mockRestore();
  });

  it('logs performance metrics', () => {
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
    
    logger.logPerformance('test-operation', 100, { details: 'test' });
    
    expect(consoleSpy).toHaveBeenCalled();
    consoleSpy.mockRestore();
  });

  it('logs security events', () => {
    const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();
    
    logger.logSecurity('test-event', { details: 'test' });
    
    expect(consoleSpy).toHaveBeenCalled();
    consoleSpy.mockRestore();
  });

  it('creates request logging middleware', () => {
    const middleware = logger.logRequest;
    expect(middleware).toBeInstanceOf(Function);
    
    const req = {
      method: 'GET',
      url: '/test',
      ip: '127.0.0.1',
      get: jest.fn().mockReturnValue('test-agent'),
    };
    
    const res = {
      statusCode: 200,
      on: jest.fn(),
    };
    
    const next = jest.fn();
    
    middleware(req, res, next);
    
    expect(next).toHaveBeenCalled();
    expect(res.on).toHaveBeenCalledWith('finish', expect.any(Function));
  });
});
