/**
 * CORS configuration middleware
 * Allows frontend to communicate with backend
 */

import cors from 'cors';

const corsOptions = {
  origin: (origin, callback) => {
    if (process.env.CORS_ORIGIN === '*') {
      callback(null, true);
    } else {
      const allowedOrigin = process.env.CORS_ORIGIN || 'http://localhost:3000';
      callback(null, origin === allowedOrigin ? true : false);
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

const corsMiddleware = cors(corsOptions);

export default corsMiddleware;
