import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    branchesList: [],
    branchStudents: [],
    branchDetails: [],
    subjectsList: [],
    subjectDetails: [],
    loading: false,
    subloading: false,
    error: null,
    response: null,
    getresponse: null,
};

const branchSlice = createSlice({
    name: 'branch',
    initialState,
    reducers: {
        getRequest: (state) => {
            state.loading = true;
        },
        getSubDetailsRequest: (state) => {
            state.subloading = true;
        },
        getSuccess: (state, action) => {
            state.branchesList = action.payload;
            state.loading = false;
            state.error = null;
            state.getresponse = null;
        },
        getStudentsSuccess: (state, action) => {
            state.branchStudents = action.payload;
            state.loading = false;
            state.error = null;
            state.getresponse = null;
        },
        getSubjectsSuccess: (state, action) => {
            state.subjectsList = action.payload;
            state.loading = false;
            state.error = null;
            state.response = null;
        },
        getFailed: (state, action) => {
            state.subjectsList = [];
            state.response = action.payload;
            state.loading = false;
            state.error = null;
        },
        getFailedTwo: (state, action) => {
            state.branchesList = [];
            state.branchStudents = [];
            state.branchDetails = [];
            state.getresponse = action.payload;
            state.loading = false;
            state.error = null;
        },
        getError: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
        detailsSuccess: (state, action) => {
            state.branchDetails = action.payload;
            state.loading = false;
            state.error = null;
        },
        getSubDetailsSuccess: (state, action) => {
            state.subjectDetails = action.payload;
            state.subloading = false;
            state.error = null;
        },
        resetSubjects: (state) => {
            state.subjectsList = [];
            state.branchesList = [];
        },
    },
});

export const {
    getRequest,
    getSuccess,
    getFailed,
    getError,
    getStudentsSuccess,
    getSubjectsSuccess,
    detailsSuccess,
    getFailedTwo,
    resetSubjects,
    getSubDetailsSuccess,
    getSubDetailsRequest
} = branchSlice.actions;

export const branchReducer = branchSlice.reducer;