/**
 * Global error handling middleware
 * Catches and formats all errors consistently
 */

const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  console.error(`[ERROR] ${statusCode} - ${message}`);
  if (err.stack) console.error(err.stack);

  res.status(statusCode).json({
    success: false,
    message,
    statusCode,
    // Only include stack in development
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

export default errorHandler;
