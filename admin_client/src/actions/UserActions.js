import {
  FETCH_USERS_REQUEST,
  FETCH_USERS_SUCCESS,
  FETCH_USERS_FAILURE,
  CREATE_USER,
  EDIT_USER,
  DELETE_USER
} from './ActionTypes';

import { axiosService } from 'services';

export const fetchUsersRequest = () => ({ type: FETCH_USERS_REQUEST });

export const fetchSuccess = (data) => ({ type: FETCH_USERS_SUCCESS, payload: data });

export const fetchFailure = (data) => ({ type: FETCH_USERS_FAILURE, payload: data });

export const fetchUsers = () =>  (dispatch) => {
    dispatch(fetchUsersRequest());
    return axiosService('/sema/users')
			.then((response) => { console.log("res", response);dispatch(fetchSuccess(response.data))})
			.catch((err) => { dispatch(fetchFailure(err))});
};
