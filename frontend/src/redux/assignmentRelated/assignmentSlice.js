import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    assignmentsList: [],
    submissionsList: [],
    loading: false,
    submissionsLoading: false,
    error: null,
    submissionsError: null,
    response: null,
    submissionStatus: null,
};

const assignmentSlice = createSlice({
    name: 'assignment',
    initialState,
    reducers: {
        assignmentRequest: (state) => {
            state.loading = true;
        },
        assignmentSuccess: (state, action) => {
            state.loading = false;
            state.assignmentsList = action.payload;
            state.error = null;
        },
        assignmentFailed: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
        submissionRequest: (state) => {
            state.submissionStatus = 'loading';
        },
        submissionSuccess: (state, action) => {
            state.submissionStatus = 'success';
            state.error = null;
        },
        submissionFailed: (state, action) => {
            state.submissionStatus = 'failed';
            state.error = action.payload;
        },
        submissionsRequest: (state) => {
            state.submissionsLoading = true;
        },
        submissionsSuccess: (state, action) => {
            state.submissionsLoading = false;
            state.submissionsList = action.payload;
            state.submissionsError = null;
        },
        submissionsFailed: (state, action) => {
            state.submissionsLoading = false;
            state.submissionsError = action.payload;
        },
        clearError: (state) => {
            state.error = null;
            state.submissionsError = null;
        },
    },
});

export const {
    assignmentRequest,
    assignmentSuccess,
    assignmentFailed,
    submissionRequest,
    submissionSuccess,
    submissionFailed,
    submissionsRequest,
    submissionsSuccess,
    submissionsFailed,
    clearError,
} = assignmentSlice.actions;

export default assignmentSlice.reducer;