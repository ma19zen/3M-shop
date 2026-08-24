const logger = require('../utils/logger');

const requestLogger = (req, res, next) => {
  const start = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - start;
    const logEntry = {
      timestamp: new Date().toISOString(),
      severity: res.statusCode >= 400 ? 'ERROR' : 'INFO',
      type: 'REQUEST',
      method: req.method,
      url: req.originalUrl,
      statusCode: res.statusCode,
      duration: `${duration}ms`,
      ip: req.ip,
      userAgent: req.get('user-agent'),
    };

    if (res.statusCode >= 400) {
      logger.error('Request failed', logEntry);
    } else {
      logger.info('Request completed', logEntry);
    }
  });

  next();
};

module.exports = requestLogger;
