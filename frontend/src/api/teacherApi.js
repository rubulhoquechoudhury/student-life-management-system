/**
 * Teacher API Service
 * 
 * This file provides API functions for teacher-related operations
 * using the centralized API client.
 */

import apiClient from './apiClient';

/**
 * Get all teachers for a school
 * 
 * @param {string} id - School ID
 * @returns {Promise} Promise that resolves with the teachers list
 */
export const getAllTeachers = (id) => {
  return apiClient.get(`/Teachers/${id}`);
};

/**
 * Get teacher details
 * 
 * @param {string} id - Teacher ID
 * @returns {Promise} Promise that resolves with the teacher details
 */
export const getTeacherDetails = (id) => {
  return apiClient.get(`/Teacher/${id}`);
};

/**
 * Update teacher subject
 * 
 * @param {string} teacherId - Teacher ID
 * @param {Object} teachSubject - Subject data
 * @returns {Promise} Promise that resolves with the update response
 */
export const updateTeacherSubject = (teacherId, teachSubject) => {
  return apiClient.put(`/TeacherSubject`, { teacherId, teachSubject });
};