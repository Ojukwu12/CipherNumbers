/**
 * FHE Routes - API endpoints for encrypted computation
 */

import express from 'express';
import {
  initializeSession,
  encryptNumberEndpoint,
  computeAddition,
  computeMultiplication,
  decryptResultEndpoint,
  healthCheck
} from '../controllers/fheController.js';

const router = express.Router();

// Health check
router.get('/health', healthCheck);

// Session management
router.post('/init', initializeSession);

// Encryption
router.post('/encrypt', encryptNumberEndpoint);

// Computation
router.post('/compute/add', computeAddition);
router.post('/compute/multiply', computeMultiplication);

// Decryption
router.post('/decrypt', decryptResultEndpoint);

export default router;
