import {
  FETCH_USERS_REQUEST,
  FETCH_USERS_SUCCESS,
  FETCH_USERS_FAILURE,
  DELETE_USER_REQUEST,
  DELETE_USER_SUCCESS,
  DELETE_USER_FAILURE
} from 'actions';

const userReducer = (state = [], action) => {
  switch (action.type) {
    case FETCH_USERS_REQUEST:
      return state;
    case FETCH_USERS_FAILURE:
      return state;
    case FETCH_USERS_SUCCESS:
      return action.payload.users;

    case DELETE_USER_REQUEST:
      return state;
    case DELETE_USER_FAILURE:
      return state;

    case DELETE_USER_SUCCESS:
      const userId = parseInt(action.payload.id, 10);
      return state.filter(user => user.id !== userId);

    default:
      return state;
  }
};

export default userReducer;
