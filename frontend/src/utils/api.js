/**
 * API client for communicating with backend
 * Handles all FHE operations
 */

// Use empty string to leverage Vite's proxy configuration
const API_BASE_URL = '';

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
      const error = await response.json();
      throw new Error(error.message || `HTTP ${response.status}`);
    }

    return await response.json();
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
