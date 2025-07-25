import {
    authRequest,
    stuffAdded,
    authSuccess,
    authFailed,
    authError,
    authLogout,
    doneSuccess,
    getDeleteSuccess,
    getRequest,
    getFailed,
    getError,
} from './userSlice';
import { login, register, getUserDetails as fetchUserDetails, 
         deleteUser as removeUser, updateUser as modifyUser, 
         addStuff as createStuff } from '../../api/userApi';
import { handleApiError } from '../../utils/errorHandler';

export const loginUser = (fields, role) => async (dispatch) => {
    dispatch(authRequest());

    try {
        const result = await login(fields, role);
        if (result.data.role) {
            dispatch(authSuccess(result.data));
        } else {
            dispatch(authFailed(result.data.message));
        }
    } catch (error) {
        const errorInfo = handleApiError(error, 'Login failed. Please try again.');
        dispatch(authError(errorInfo));
    }
};

export const registerUser = (fields, role) => async (dispatch) => {
    dispatch(authRequest());

    try {
        const result = await register(fields, role);
        if (result.data.schoolName) {
            dispatch(authSuccess(result.data));
        }
        else if (result.data.school) {
            dispatch(stuffAdded());
        }
        else {
            dispatch(authFailed(result.data.message));
        }
    } catch (error) {
        const errorInfo = handleApiError(error, 'Registration failed. Please try again.');
        dispatch(authError(errorInfo));
    }
};

export const logoutUser = () => (dispatch) => {
    dispatch(authLogout());
};

export const getUserDetails = (id, address) => async (dispatch) => {
    dispatch(getRequest());

    try {
        const result = await fetchUserDetails(id, address);
        if (result.data) {
            dispatch(doneSuccess(result.data));
        }
    } catch (error) {
        const errorInfo = handleApiError(error, 'Failed to fetch user details.');
        dispatch(getError(errorInfo));
    }
}

export const deleteUser = (id, address) => async (dispatch) => {
    dispatch(getRequest());

    try {
        const result = await removeUser(id, address);
        if (result.data.message) {
            dispatch(getFailed(result.data.message));
        } else {
            dispatch(getDeleteSuccess());
        }
    } catch (error) {
        const errorInfo = handleApiError(error, 'Failed to delete user.');
        dispatch(getError(errorInfo));
    }
}

// export const deleteUser = (id, address) => async (dispatch) => {
//     dispatch(getRequest());
//     dispatch(getFailed("Sorry the delete function has been disabled for now."));
// }

export const updateUser = (fields, id, address) => async (dispatch) => {
    dispatch(getRequest());

    try {
        const result = await modifyUser(fields, id, address);
        if (result.data.schoolName) {
            dispatch(authSuccess(result.data));
        }
        else {
            dispatch(doneSuccess(result.data));
        }
    } catch (error) {
        const errorInfo = handleApiError(error, 'Failed to update user.');
        dispatch(getError(errorInfo));
    }
}

export const addStuff = (fields, address) => async (dispatch) => {
    dispatch(authRequest());

    try {
        const result = await createStuff(fields, address);
        if (result.data.message) {
            dispatch(authFailed(result.data.message));
        } else {
            dispatch(stuffAdded(result.data));
        }
    } catch (error) {
        const errorInfo = handleApiError(error, 'Failed to add new entity.');
        dispatch(authError(errorInfo));
    }
};