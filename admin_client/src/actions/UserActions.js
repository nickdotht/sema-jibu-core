import { axiosService } from 'services';
import {
  FETCH_USERS_REQUEST,
  FETCH_USERS_SUCCESS,
  FETCH_USERS_FAILURE,
  CREATE_USER_REQUEST,
  CREATE_USER_SUCCESS,
  CREATE_USER_FAILURE,
  DELETE_USER_REQUEST,
  DELETE_USER_SUCCESS,
  DELETE_USER_FAILURE
} from './ActionTypes';

export const fetchUsersRequest = () => ({ type: FETCH_USERS_REQUEST });

export const fetchSuccess = data => ({
  type: FETCH_USERS_SUCCESS,
  payload: data
});

export const fetchFailure = data => ({
  type: FETCH_USERS_FAILURE,
  payload: data
});

export const createUserRequest = () => ({ type: CREATE_USER_REQUEST });
export const createUserSuccess = data => ({
  type: CREATE_USER_SUCCESS,
  payload: data
});
export const createUserFailure = data => ({
  type: CREATE_USER_FAILURE,
  payload: data
});

export const deleteUserRequest = () => ({ type: DELETE_USER_REQUEST });
export const deleteUserSuccess = data => ({
  type: DELETE_USER_SUCCESS,
  payload: data
});
export const deleteUserFailure = data => ({
  type: DELETE_USER_FAILURE,
  payload: data
});

export const fetchUsers = () => dispatch => {
  dispatch(fetchUsersRequest());
  return axiosService
    .get('/sema/users')
    .then(response => dispatch(fetchSuccess(response.data)))
    .catch(err => dispatch(fetchFailure(err)));
};

export const createUser = data => dispatch => {
  dispatch(createUserRequest());
  return axiosService
    .post('/sema/users', { data })
    .then(response => dispatch(createUserSuccess(response.data)))
    .catch(err => dispatch(createUserFailure(err)));
};

export const deleteUser = id => dispatch => {
  dispatch(deleteUserRequest());
  return axiosService
    .delete(`/sema/users/${id}`)
    .then(response => dispatch(deleteUserSuccess(response.data)))
    .catch(err => dispatch(deleteUserFailure(err)));
};
