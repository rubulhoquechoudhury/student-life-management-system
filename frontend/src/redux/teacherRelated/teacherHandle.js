import {
    getRequest,
    getSuccess,
    getFailed,
    getError,
    postDone,
    doneSuccess
} from './teacherSlice';
import { 
    getAllTeachers as fetchAllTeachers,
    getTeacherDetails as fetchTeacherDetails,
    updateTeacherSubject
} from '../../api/teacherApi';
import { handleApiError } from '../../utils/errorHandler';

export const getAllTeachers = (id) => async (dispatch) => {
    dispatch(getRequest());

    try {
        const result = await fetchAllTeachers(id);
        if (result.data.message) {
            dispatch(getFailed(result.data.message));
        } else {
            dispatch(getSuccess(result.data));
        }
    } catch (error) {
        const errorInfo = handleApiError(error, 'Failed to fetch teachers.');
        dispatch(getError(errorInfo));
    }
}

export const getTeacherDetails = (id) => async (dispatch) => {
    dispatch(getRequest());

    try {
        const result = await fetchTeacherDetails(id);
        if (result.data) {
            dispatch(doneSuccess(result.data));
        }
    } catch (error) {
        const errorInfo = handleApiError(error, 'Failed to fetch teacher details.');
        dispatch(getError(errorInfo));
    }
}

export const updateTeachSubject = (teacherId, teachSubject) => async (dispatch) => {
    dispatch(getRequest());

    try {
        await updateTeacherSubject(teacherId, teachSubject);
        dispatch(postDone());
    } catch (error) {
        const errorInfo = handleApiError(error, 'Failed to update teacher subject.');
        dispatch(getError(errorInfo));
    }
}