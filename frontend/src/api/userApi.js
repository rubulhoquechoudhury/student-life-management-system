/**
 * User API Service
 * 
 * This file provides API functions for user-related operations
 * using the centralized API client.
 */

import apiClient from './apiClient';
import { retryApiCall } from '../utils/apiRetry';

/**
 * Login a user
 * 
 * @param {Object} fields - Login credentials
 * @param {string} role - User role (Admin, Student, Teacher)
 * @returns {Promise} Promise that resolves with the login response
 */
export const login = (fields, role) => {
  return retryApiCall(() => 
    apiClient.post(`/${role}Login`, fields)
  );
};

/**
 * Register a new user
 * 
 * @param {Object} fields - Registration data
 * @param {string} role - User role (Admin, Student, Teacher)
 * @returns {Promise} Promise that resolves with the registration response
 */
export const register = (fields, role) => {
  return retryApiCall(() => 
    apiClient.post(`/${role}Reg`, fields)
  );
};

/**
 * Get user details
 * 
 * @param {string} id - User ID
 * @param {string} address - API endpoint address
 * @returns {Promise} Promise that resolves with the user details
 */
export const getUserDetails = (id, address) => {
  return apiClient.get(`/${address}/${id}`);
};

/**
 * Delete a user
 * 
 * @param {string} id - User ID
 * @param {string} address - API endpoint address
 * @returns {Promise} Promise that resolves with the deletion response
 */
export const deleteUser = (id, address) => {
  return apiClient.delete(`/${address}/${id}`);
};

/**
 * Update a user
 * 
 * @param {Object} fields - Updated user data
 * @param {string} id - User ID
 * @param {string} address - API endpoint address
 * @returns {Promise} Promise that resolves with the update response
 */
export const updateUser = (fields, id, address) => {
  return apiClient.put(`/${address}/${id}`, fields);
};

/**
 * Add a new entity (student, teacher, etc.)
 * 
 * @param {Object} fields - Entity data
 * @param {string} address - API endpoint address
 * @returns {Promise} Promise that resolves with the creation response
 */
export const addStuff = (fields, address) => {
  return apiClient.post(`/${address}Create`, fields);
};