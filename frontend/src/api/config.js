/**
 * API Configuration
 * 
 * This file centralizes API configuration settings to ensure consistent
 * API base URL usage across the application.
 */

/**
 * Determines the appropriate API base URL based on the environment
 * 
 * @returns {string} The API base URL to use for all API requests
 */
export const getApiBaseUrl = () => {
  // First check for REACT_APP_BASE_URL which is used in the codebase
  if (process.env.REACT_APP_BASE_URL) {
    return process.env.REACT_APP_BASE_URL;
  }
  
  // Then check for REACT_APP_API_URL which is defined in .env
  if (process.env.REACT_APP_API_URL) {
    return process.env.REACT_APP_API_URL;
  }
  
  // For local development
  if (process.env.NODE_ENV === 'development') {
    return 'http://localhost:5000';
  }
  
  // For production (fallback)
  return 'https://studentlifemanagementsystem.onrender.com';
};

/**
 * The base URL to use for all API requests
 */
export const API_BASE_URL = getApiBaseUrl();

/**
 * Check if the API is available
 * 
 * @returns {Promise<boolean>} True if the API is available, false otherwise
 */
export const checkApiAvailability = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/health`, { 
      method: 'HEAD',
      timeout: 5000
    });
    return response.ok;
  } catch (error) {
    console.error('API availability check failed:', error);
    return false;
  }
};