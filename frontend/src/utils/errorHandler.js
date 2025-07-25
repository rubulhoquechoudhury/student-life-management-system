/**
 * Error Handler Utilities
 * 
 * This file provides utility functions for handling API errors
 * and displaying user-friendly error messages.
 */

/**
 * Handles API errors and returns user-friendly error messages
 * 
 * @param {Error} error - The error object from an API call
 * @param {string} defaultMessage - Default message to show if error can't be determined
 * @returns {Object} Object containing message and details
 */
export const handleApiError = (error, defaultMessage = 'An error occurred') => {
  // Network error or server not running
  if (!error.response) {
    if (error.message.includes('Network Error') || error.code === 'ECONNREFUSED') {
      return {
        message: 'Unable to connect to the server. Please check if the server is running.',
        details: error.message,
        code: 'CONNECTION_REFUSED'
      };
    }
    
    if (error.message.includes('timeout')) {
      return {
        message: 'The server is taking too long to respond. Please try again later.',
        details: error.message,
        code: 'TIMEOUT'
      };
    }
    
    return {
      message: 'Unable to connect to the server. Please check your internet connection.',
      details: error.message,
      code: 'NETWORK_ERROR'
    };
  }
  
  // Server returned an error response
  const status = error.response.status;
  
  switch (status) {
    case 400:
      return {
        message: error.response.data.message || 'Invalid request. Please check your input.',
        details: error.response.data,
        code: 'BAD_REQUEST'
      };
    case 401:
      return {
        message: 'Your session has expired. Please log in again.',
        details: error.response.data,
        code: 'UNAUTHORIZED'
      };
    case 403:
      return {
        message: 'You do not have permission to perform this action.',
        details: error.response.data,
        code: 'FORBIDDEN'
      };
    case 404:
      return {
        message: 'The requested resource was not found.',
        details: error.response.data,
        code: 'NOT_FOUND'
      };
    case 500:
      return {
        message: 'Server error. Please try again later or contact support.',
        details: error.response.data,
        code: 'SERVER_ERROR'
      };
    default:
      return {
        message: defaultMessage,
        details: error.response.data,
        code: `HTTP_${status}`
      };
  }
};

/**
 * Displays an error message to the user
 * 
 * @param {Object} error - Error object from handleApiError
 * @param {Function} setError - State setter function for error message
 */
export const displayError = (error, setError) => {
  if (typeof setError === 'function') {
    setError(error.message);
  } else {
    // Fallback to alert if no error state setter is provided
    alert(`Error: ${error.message}`);
  }
  
  // Log the error details for debugging
  console.error('Error details:', error.details);
};

/**
 * Checks if an error is a connection error
 * 
 * @param {Error} error - The error object from an API call
 * @returns {boolean} True if it's a connection error
 */
export const isConnectionError = (error) => {
  return !error.response || 
    error.message.includes('Network Error') || 
    error.code === 'ECONNREFUSED' ||
    error.message.includes('timeout');
};