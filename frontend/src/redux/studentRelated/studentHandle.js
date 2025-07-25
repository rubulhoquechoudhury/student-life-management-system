import {
    getRequest,
    getSuccess,
    getFailed,
    getError,
    stuffDone
} from './studentSlice';
import { 
    getAllStudents as fetchAllStudents,
    updateStudentAttendance,
    updateStudentMarks
} from '../../api/studentApi';
import { handleApiError } from '../../utils/errorHandler';

export const getAllStudents = (id) => async (dispatch) => {
    dispatch(getRequest());

    try {
        const result = await fetchAllStudents(id);
        if (result.data.message) {
            dispatch(getFailed(result.data.message));
        } else {
            dispatch(getSuccess(result.data));
        }
    } catch (error) {
        const errorInfo = handleApiError(error, 'Failed to fetch students.');
        dispatch(getError(errorInfo));
    }
}

export const updateStudentFields = (id, fields, address) => async (dispatch) => {
    dispatch(getRequest());

    try {
        const result = await updateStudentAttendance(fields, id, address);
        if (result.data.message) {
            dispatch(getFailed(result.data.message));
        } else {
            dispatch(stuffDone());
        }
    } catch (error) {
        const errorInfo = handleApiError(error, 'Failed to update student fields.');
        dispatch(getError(errorInfo));
    }
}

export const removeStuff = (id, address) => async (dispatch) => {
    dispatch(getRequest());

    try {
        const result = await updateStudentMarks(id, address);
        if (result.data.message) {
            dispatch(getFailed(result.data.message));
        } else {
            dispatch(stuffDone());
        }
    } catch (error) {
        const errorInfo = handleApiError(error, 'Failed to remove student data.');
        dispatch(getError(errorInfo));
    }
}