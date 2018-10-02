import {
  FETCH_USERS_REQUEST,
  FETCH_USERS_SUCCESS,
  FETCH_USERS_FAILURE
} from "actions";

const initialState = {
  users: [],
  loading: false
};

const userReducer = (state = initialState, action) => {
  switch(action.type) {
    case FETCH_USERS_REQUEST:
      return {
        ...state,
        loading: true
      }
    case FETCH_USERS_SUCCESS:
      return {
        ...state,
        loading: false,
        users: [...state.users, action.payload.users]
      }
    case FETCH_USERS_FAILURE:
      return {
        ...state,
        loading: false,
        users: []
      }
    default:
     return state;
  }
}

export default userReducer;
