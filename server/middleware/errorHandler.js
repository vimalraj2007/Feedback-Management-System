import logger from '../utils/logger.js';

export const errorHandler = (err, req, res, next) => {
  logger.error(`Error on ${req.method} ${req.originalUrl}: ${err.message}`, { stack: err.stack });

  // Handle specific well-known errors if needed
  if (err.name === 'SqliteError') {
    return res.status(500).json({ error: 'Database error occurred' });
  }

  const status = err.status || 500;
  const message = err.message || 'Internal Server Error';

  res.status(status).json({ error: message });
};
