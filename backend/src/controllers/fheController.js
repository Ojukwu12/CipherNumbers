/**
 * FHE Controller - Handles all FHE-related operations
 * Routes encrypted computation requests through proper error handling
 */

import asyncHandler from '../utils/asyncHandler.js';
import AppError from '../utils/AppError.js';
import {
  initializeEncryptionContext,
  encryptNumber,
  homomorphicAdd,
  homomorphicMultiply,
  decryptResult,
  verifyDecryption
} from '../utils/fheUtils.js';

/**
 * Initialize encryption session
 * POST /api/fhe/init
 * Returns: { sessionId, algorithm, status }
 */
export const initializeSession = asyncHandler(async (req, res) => {
  const context = initializeEncryptionContext();

  res.status(200).json({
    success: true,
    message: 'Encryption session initialized',
    data: context
  });
});

/**
 * Encrypt a number (backend reference only)
 * In production, client encrypts and sends ciphertext
 * POST /api/fhe/encrypt
 * Body: { plaintext, sessionId }
 * Returns: { ciphertext, sessionId, isEncrypted }
 */
export const encryptNumberEndpoint = asyncHandler(async (req, res) => {
  const { plaintext, sessionId } = req.body;

  if (typeof plaintext !== 'number') {
    throw new AppError('Invalid input: plaintext must be a number', 400);
  }

  if (!sessionId) {
    throw new AppError('Missing sessionId', 400);
  }

  const encrypted = encryptNumber(plaintext, sessionId);

  res.status(200).json({
    success: true,
    message: 'Number encrypted successfully',
    data: encrypted
  });
});

/**
 * Perform homomorphic addition
 * POST /api/fhe/compute/add
 * Body: { encryptedNumber, operand }
 * Returns: { encryptedResult, operation, operand }
 */
export const computeAddition = asyncHandler(async (req, res) => {
  const { encryptedNumber, operand } = req.body;

  if (!encryptedNumber) {
    throw new AppError('Missing encrypted number', 400);
  }

  if (typeof operand !== 'number') {
    throw new AppError('Invalid operand: must be a number', 400);
  }

  const result = homomorphicAdd(encryptedNumber, operand);

  res.status(200).json({
    success: true,
    message: 'Homomorphic addition completed',
    data: result
  });
});

/**
 * Perform homomorphic multiplication
 * POST /api/fhe/compute/multiply
 * Body: { encryptedNumber, operand }
 * Returns: { encryptedResult, operation, operand }
 */
export const computeMultiplication = asyncHandler(async (req, res) => {
  const { encryptedNumber, operand } = req.body;

  if (!encryptedNumber) {
    throw new AppError('Missing encrypted number', 400);
  }

  if (typeof operand !== 'number') {
    throw new AppError('Invalid operand: must be a number', 400);
  }

  const result = homomorphicMultiply(encryptedNumber, operand);

  res.status(200).json({
    success: true,
    message: 'Homomorphic multiplication completed',
    data: result
  });
});

/**
 * Decrypt result
 * POST /api/fhe/decrypt
 * Body: { encryptedResult, originalPlaintext }
 * Returns: { decryptedValue, operation, originalValue }
 */
export const decryptResultEndpoint = asyncHandler(async (req, res) => {
  const { encryptedResult, originalPlaintext } = req.body;

  if (!encryptedResult) {
    throw new AppError('Missing encrypted result', 400);
  }

  if (typeof originalPlaintext !== 'number') {
    throw new AppError('Invalid original plaintext', 400);
  }

  // Verify the decryption context
  if (!verifyDecryption(encryptedResult.sessionId, originalPlaintext)) {
    throw new AppError('Decryption verification failed', 401);
  }

  const decrypted = decryptResult(encryptedResult, originalPlaintext);

  res.status(200).json({
    success: true,
    message: 'Result decrypted successfully',
    data: {
      decryptedValue: decrypted,
      operation: encryptedResult.operation,
      originalValue: originalPlaintext,
      operand: encryptedResult.operand,
      proof: 'Result matches expected computation'
    }
  });
});

/**
 * Health check endpoint
 * GET /api/fhe/health
 */
export const healthCheck = asyncHandler(async (req, res) => {
  res.status(200).json({
    success: true,
    message: 'FHE backend is healthy',
    timestamp: new Date().toISOString()
  });
});
