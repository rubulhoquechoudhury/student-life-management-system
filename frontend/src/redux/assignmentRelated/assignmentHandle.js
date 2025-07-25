import axios from 'axios';
import {
    assignmentRequest,
    assignmentSuccess,
    assignmentFailed,
    submissionRequest,
    submissionSuccess,
    submissionFailed,
    submissionsRequest,
    submissionsSuccess,
    submissionsFailed,
} from './assignmentSlice';

const REACT_APP_BASE_URL = process.env.REACT_APP_BASE_URL || "http://localhost:5000";

export const fetchAssignments = (params) => async (dispatch) => {
    dispatch(assignmentRequest());
    try {
        const res = await axios.get(`${REACT_APP_BASE_URL}/Assignments`, { params });
        dispatch(assignmentSuccess(res.data));
    } catch (error) {
        dispatch(assignmentFailed(error.message));
    }
};

export const createAssignment = (fields) => async (dispatch) => {
    dispatch(assignmentRequest());
    try {
        const result = await axios.post(`${REACT_APP_BASE_URL}/AssignmentCreate`, fields);
        if (result.data.message) {
            dispatch(assignmentFailed(result.data.message));
            return { error: result.data.message };
        } else {
            dispatch(assignmentSuccess([result.data]));
            return result.data;
        }
    } catch (error) {
        dispatch(assignmentFailed(error));
        return { error };
    }
};

export const submitAssignment = (assignmentId, fields) => async (dispatch) => {
    dispatch(submissionRequest());
    try {
        const formData = new FormData();
        
        // Add student ID
        formData.append('student', fields.student);
        
        // Add text if provided
        if (fields.text) {
            formData.append('text', fields.text);
        }
        
        // Add file if provided
        if (fields.file) {
            formData.append('file', fields.file);
        }
        
        console.log('Submitting assignment with formData:', {
            assignmentId,
            hasStudent: !!fields.student,
            hasText: !!fields.text,
            hasFile: !!fields.file
        });
        
        const res = await axios.post(
            `${REACT_APP_BASE_URL}/AssignmentSubmit/${assignmentId}`,
            formData,
            { headers: { 'Content-Type': 'multipart/form-data' } }
        );
        
        console.log('Assignment submission response:', res.data);
        dispatch(submissionSuccess(res.data));
        return res.data;
    } catch (error) {
        console.error('Assignment submission error:', error.response?.data || error.message);
        dispatch(submissionFailed(error.response?.data?.message || error.message));
        throw error;
    }
};

export const deleteAssignment = (assignmentId) => async (dispatch) => {
    dispatch(assignmentRequest());
    try {
        const result = await axios.delete(`${REACT_APP_BASE_URL}/Assignment/${assignmentId}`);
        if (result.data.message) {
            dispatch(assignmentSuccess([])); // Clear the assignments list to trigger refresh
            return { success: result.data.message };
        } else {
            dispatch(assignmentFailed('Failed to delete assignment'));
            return { error: 'Failed to delete assignment' };
        }
    } catch (error) {
        dispatch(assignmentFailed(error.message));
        return { error: error.message };
    }
};

export const fetchSubmissions = (assignmentId) => async (dispatch) => {
    dispatch(submissionsRequest());
    try {
        const res = await axios.get(`${REACT_APP_BASE_URL}/AssignmentSubmissions/${assignmentId}`);
        dispatch(submissionsSuccess(res.data));
        return res.data;
    } catch (error) {
        dispatch(submissionsFailed(error.message));
        return { error: error.message };
    }
};