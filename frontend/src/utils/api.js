/**
 * API client for communicating with backend
 * Handles all FHE operations
 */

// Prefer deployed URL when available; fall back to same-origin/proxy in dev
const API_BASE_URL = import.meta.env?.VITE_API_URL || '';

/**
 * Generic fetch wrapper with error handling
 */
const apiCall = async (endpoint, method = 'GET', data = null) => {
  try {
    const options = {
      method,
      headers: {
        'Content-Type': 'application/json',
      }
    };

    if (data) {
      options.body = JSON.stringify(data);
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, options);
    
    if (!response.ok) {
      // Try to parse structured error; fallback to text/html
      let message;
      try {
        const error = await response.json();
        message = error.message;
      } catch (_) {
        message = await response.text();
      }
      throw new Error(message || `HTTP ${response.status}`);
    }

    // Some hosts return HTML on errors; guard JSON parsing
    try {
      return await response.json();
    } catch (parseErr) {
      const bodyText = await response.text();
      throw new Error(`Unexpected response format: ${bodyText?.slice(0, 200) || 'empty'}`);
    }
  } catch (error) {
    console.error(`API Error: ${endpoint}`, error);
    throw error;
  }
};

/**
 * Initialize encryption session
 */
export const initializeSession = async () => {
  return apiCall('/api/fhe/init', 'POST');
};

/**
 * Encrypt a number
 */
export const encryptNumber = async (plaintext, sessionId) => {
  return apiCall('/api/fhe/encrypt', 'POST', {
    plaintext,
    sessionId
  });
};

/**
 * Perform homomorphic addition
 */
export const performAddition = async (encryptedNumber, operand) => {
  return apiCall('/api/fhe/compute/add', 'POST', {
    encryptedNumber,
    operand
  });
};

/**
 * Perform homomorphic multiplication
 */
export const performMultiplication = async (encryptedNumber, operand) => {
  return apiCall('/api/fhe/compute/multiply', 'POST', {
    encryptedNumber,
    operand
  });
};

/**
 * Decrypt result
 */
export const decryptResult = async (encryptedResult, originalPlaintext) => {
  return apiCall('/api/fhe/decrypt', 'POST', {
    encryptedResult,
    originalPlaintext
  });
};

/**
 * Health check
 */
export const healthCheck = async () => {
  return apiCall('/api/fhe/health', 'GET');
};
