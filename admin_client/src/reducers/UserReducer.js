import {
  FETCH_USERS_SUCCESS,
  CREATE_USER_SUCCESS,
  DELETE_USER_SUCCESS
} from 'actions';

const userReducer = (state = [], action) => {
  switch (action.type) {
    case FETCH_USERS_SUCCESS:
      return action.payload.users;
    case CREATE_USER_SUCCESS:
      const user = action.payload.user;
      return [...state, { ...user }];
    case DELETE_USER_SUCCESS:
      const userId = parseInt(action.payload.id, 10);
      return state.filter(user => user.id !== userId);

    default:
      return state;
  }
};

export default userReducer;
