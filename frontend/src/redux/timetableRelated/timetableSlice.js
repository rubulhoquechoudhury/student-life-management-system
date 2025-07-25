import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    timetables: [],
    loading: false,
    error: null,
    status: null,
};

const timetableSlice = createSlice({
    name: 'timetable',
    initialState,
    reducers: {
        timetableRequest: (state) => {
            state.loading = true;
            state.error = null;
        },
        timetableSuccess: (state, action) => {
            state.loading = false;
            state.timetables = action.payload;
            state.error = null;
        },
        timetableFailed: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
        timetableStatus: (state, action) => {
            state.status = action.payload;
        },
    },
});

export const {
    timetableRequest,
    timetableSuccess,
    timetableFailed,
    timetableStatus,
} = timetableSlice.actions;

export default timetableSlice.reducer; 