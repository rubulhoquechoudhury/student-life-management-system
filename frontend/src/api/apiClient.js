/**
 * API Client
 * 
 * This file provides a centralized Axios client for making API requests.
 * It handles common configuration, authentication, and error handling.
 */

import axios from 'axios';
import { API_BASE_URL } from './config';

/**
 * Create an Axios instance with common configuration
 */
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

/**
 * Add request interceptor for authentication and logging
 */
apiClient.interceptors.request.use(
  (config) => {
    // Add authentication token if available
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    
    // Log request for debugging (only in development)
    if (process.env.NODE_ENV === 'development') {
      console.log(`API Request: ${config.method.toUpperCase()} ${config.baseURL}${config.url}`, {
        headers: config.headers,
        data: config.data,
        params: config.params
      });
    }
    
    return config;
  },
  (error) => {
    console.error('API Request Error:', error);
    return Promise.reject(error);
  }
);

/**
 * Add response interceptor for error handling and logging
 */
apiClient.interceptors.response.use(
  (response) => {
    // Log successful responses (only in development)
    if (process.env.NODE_ENV === 'development') {
      console.log(`API Response: ${response.status} ${response.config.method.toUpperCase()} ${response.config.url}`, {
        data: response.data
      });
    }
    return response;
  },
  (error) => {
    // Handle connection errors
    if (!error.response) {
      console.error('API Connection Error:', error.message);
      
      // Check if it's a connection refused error
      if (error.message.includes('Network Error') || error.code === 'ECONNREFUSED') {
        console.error('Server connection refused. Please ensure the backend server is running.');
        
        // You could dispatch to a global error state or show a notification here
        // For example:
        // store.dispatch(setGlobalError('Server connection refused. Please ensure the backend server is running.'));
        
        // You could also trigger a retry mechanism here
      }
    } else {
      // Log error responses (always log errors)
      console.error(`API Error ${error.response.status}:`, {
        url: error.config.url,
        method: error.config.method,
        data: error.response.data,
        headers: error.config.headers
      });
    }
    
    return Promise.reject(error);
  }
);

export default apiClient;