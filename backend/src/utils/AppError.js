/**
 * Custom error class for application-specific errors
 * Allows better error handling and HTTP status code mapping
 */
class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;

    Error.captureStackTrace(this, this.constructor);
  }
}

export default AppError;
