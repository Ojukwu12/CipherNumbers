/**
 * Wrapper for async route handlers to catch errors and pass them to error handler
 * Eliminates need for try-catch blocks in controllers
 */
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

export default asyncHandler;
