import axios from 'axios';
import {
    timetableRequest,
    timetableSuccess,
    timetableFailed,
    timetableStatus,
} from './timetableSlice';

const REACT_APP_BASE_URL = process.env.REACT_APP_BASE_URL || "http://localhost:5000";

export const fetchTimetables = (params) => async (dispatch) => {
    dispatch(timetableRequest());
    try {
        const res = await axios.get(`${REACT_APP_BASE_URL}/Timetables`, { params });
        dispatch(timetableSuccess(res.data));
    } catch (error) {
        dispatch(timetableFailed(error.message));
    }
};

export const createTimetable = (fields) => async (dispatch) => {
    dispatch(timetableRequest());
    try {
        await axios.post(`${REACT_APP_BASE_URL}/TimetableCreate`, fields);
        dispatch(timetableStatus('created'));
    } catch (error) {
        dispatch(timetableFailed(error.message));
    }
};

export const updateTimetable = (id, fields) => async (dispatch) => {
    dispatch(timetableRequest());
    try {
        await axios.put(`${REACT_APP_BASE_URL}/Timetable/${id}`, fields);
        dispatch(timetableStatus('updated'));
    } catch (error) {
        dispatch(timetableFailed(error.message));
    }
};

export const deleteTimetable = (id) => async (dispatch) => {
    dispatch(timetableRequest());
    try {
        await axios.delete(`${REACT_APP_BASE_URL}/Timetable/${id}`);
        dispatch(timetableStatus('deleted'));
    } catch (error) {
        dispatch(timetableFailed(error.message));
    }
}; 