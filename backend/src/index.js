/**
 * CipherNumbers Backend
 * Demonstrates Zama FHE encrypted computation
 * 
 * Architecture:
 * - Express server with async/await handlers
 * - Custom error handling with AppError class
 * - FHE utilities for encryption/decryption operations
 * - CORS-enabled for frontend communication
 */

import express from 'express';
import dotenv from 'dotenv';
import corsMiddleware from './middleware/corsMiddleware.js';
import errorHandler from './middleware/errorHandler.js';
import fheRoutes from './routes/fheRoutes.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(express.json());
app.use(corsMiddleware);

// Routes
app.use('/api/fhe', fheRoutes);

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    name: 'CipherNumbers Backend',
    version: '1.0.0',
    description: 'FHE encrypted computation demo',
    endpoints: {
      health: 'GET /api/fhe/health',
      init: 'POST /api/fhe/init',
      encrypt: 'POST /api/fhe/encrypt',
      compute_add: 'POST /api/fhe/compute/add',
      compute_multiply: 'POST /api/fhe/compute/multiply',
      decrypt: 'POST /api/fhe/decrypt'
    }
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Endpoint not found'
  });
});

// Global error handler (must be last)
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════╗
║     CipherNumbers Backend              ║
║     Running on port ${PORT}              ║
║     FHE Demo Server                    ║
╚════════════════════════════════════════╝
  `);
  console.log(`📡 Server ready: http://localhost:${PORT}`);
  console.log(`🔐 FHE API: http://localhost:${PORT}/api/fhe/health`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  process.exit(0);
});
