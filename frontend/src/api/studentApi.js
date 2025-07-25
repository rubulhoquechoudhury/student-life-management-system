/**
 * Student API Service
 * 
 * This file provides API functions for student-related operations
 * using the centralized API client.
 */

import apiClient from './apiClient';

/**
 * Get all students for a school
 * 
 * @param {string} id - School ID
 * @returns {Promise} Promise that resolves with the students list
 */
export const getAllStudents = (id) => {
  return apiClient.get(`/Students/${id}`);
};

/**
 * Update student attendance
 * 
 * @param {Object} fields - Attendance data
 * @param {string} id - Student ID
 * @param {string} address - API endpoint address
 * @returns {Promise} Promise that resolves with the update response
 */
export const updateStudentAttendance = (fields, id, address) => {
  return apiClient.put(`/${address}/${id}`, fields);
};

/**
 * Update student marks
 * 
 * @param {string} id - Student ID
 * @param {string} address - API endpoint address
 * @returns {Promise} Promise that resolves with the update response
 */
export const updateStudentMarks = (id, address) => {
  return apiClient.put(`/${address}/${id}`);
};