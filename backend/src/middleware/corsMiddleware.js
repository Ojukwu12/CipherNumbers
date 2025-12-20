/**
 * CORS configuration middleware
 * Allows frontend to communicate with backend
 */

import cors from 'cors';

const corsOptions = {
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

const corsMiddleware = cors(corsOptions);

export default corsMiddleware;
