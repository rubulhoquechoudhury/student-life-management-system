import axios from 'axios';
import {
    getRequest,
    getSuccess,
    getFailed,
    getError
} from './complainSlice';

const REACT_APP_BASE_URL = process.env.REACT_APP_BASE_URL || "http://localhost:5000";

export const getAllComplains = (id, address) => async (dispatch) => {
    dispatch(getRequest());

    try {
        const result = await axios.get(`${REACT_APP_BASE_URL}/${address}List/${id}`);
        if (result.data.message) {
            dispatch(getFailed(result.data.message));
        } else {
            dispatch(getSuccess(result.data));
        }
    } catch (error) {
        dispatch(getError(error));
    }
}

export const getStudentComplains = (schoolId, studentId) => async (dispatch) => {
    dispatch(getRequest());

    try {
        const result = await axios.get(`${REACT_APP_BASE_URL}/ComplainList/${schoolId}`);
        if (result.data.message) {
            dispatch(getFailed(result.data.message));
        } else {
            // Filter complaints for the specific student and only include items of type 'complaint' (not 'query')
            const studentComplaints = result.data.filter(complaint => 
                complaint.user && 
                complaint.user._id === studentId && 
                (complaint.type === 'complaint' || complaint.type === undefined) // Include undefined for backward compatibility
            );
            dispatch(getSuccess(studentComplaints));
        }
    } catch (error) {
        dispatch(getError(error));
    }
}