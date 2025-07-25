/**
 * API Retry Utilities
 * 
 * This file provides utility functions for retrying failed API calls
 * with exponential backoff.
 */

import { isConnectionError } from './errorHandler';

/**
 * Default retry configuration
 */
const DEFAULT_RETRY_CONFIG = {
  maxRetries: 3,
  initialDelayMs: 1000,
  maxDelayMs: 10000,
  factor: 2,
  retryableErrors: ['ECONNREFUSED', 'ETIMEDOUT', 'ECONNRESET', 'NETWORK_ERROR']
};

/**
 * Calculates the delay for the next retry attempt using exponential backoff
 * 
 * @param {number} attempt - The current attempt number (0-based)
 * @param {Object} config - Retry configuration
 * @returns {number} Delay in milliseconds
 */
const calculateDelay = (attempt, config) => {
  const { initialDelayMs, maxDelayMs, factor } = config;
  const delay = initialDelayMs * Math.pow(factor, attempt);
  return Math.min(delay, maxDelayMs);
};

/**
 * Determines if an error is retryable based on configuration
 * 
 * @param {Error} error - The error object
 * @param {Object} config - Retry configuration
 * @returns {boolean} True if the error is retryable
 */
const isRetryableError = (error, config) => {
  // Always retry connection errors
  if (isConnectionError(error)) {
    return true;
  }
  
  // Check if error code is in the list of retryable errors
  if (error.code && config.retryableErrors.includes(error.code)) {
    return true;
  }
  
  // Check if error response status is retryable (5xx errors)
  if (error.response && error.response.status >= 500 && error.response.status < 600) {
    return true;
  }
  
  return false;
};

/**
 * Retries an API call with exponential backoff
 * 
 * @param {Function} apiCall - Function that returns a promise for the API call
 * @param {Object} config - Retry configuration (optional)
 * @returns {Promise} Promise that resolves with the API response or rejects with an error
 */
export const retryApiCall = async (apiCall, customConfig = {}) => {
  const config = { ...DEFAULT_RETRY_CONFIG, ...customConfig };
  let lastError;
  
  for (let attempt = 0; attempt <= config.maxRetries; attempt++) {
    try {
      // First attempt or retry
      return await apiCall();
    } catch (error) {
      lastError = error;
      
      // Check if we should retry
      if (attempt < config.maxRetries && isRetryableError(error, config)) {
        const delay = calculateDelay(attempt, config);
        
        console.log(`API call failed, retrying in ${delay}ms (attempt ${attempt + 1}/${config.maxRetries})`, {
          error: error.message,
          attempt: attempt + 1,
          maxRetries: config.maxRetries
        });
        
        // Wait before retrying
        await new Promise(resolve => setTimeout(resolve, delay));
        // Continue to next iteration (retry)
      } else {
        // We've exhausted retries or error is not retryable
        break;
      }
    }
  }
  
  // If we get here, all retries failed
  throw lastError;
};

/**
 * Creates a wrapped version of an API client method with retry functionality
 * 
 * @param {Function} apiMethod - The API method to wrap
 * @param {Object} config - Retry configuration (optional)
 * @returns {Function} Wrapped API method with retry functionality
 */
export const withRetry = (apiMethod, customConfig = {}) => {
  return (...args) => {
    return retryApiCall(() => apiMethod(...args), customConfig);
  };
};