import initialState from './initialState';
import {FETCH_STUFF, RECEIVE_SEMA_USER} from 'actions/actionTypes';

export default function seamaUser(state = initialState.seamaUser, action) {
    let newState;
    switch (action.type) {
        case FETCH_STUFF:
            console.log('FETCH_STUFF Action')
            return action;
        case RECEIVE_SEMA_USER:
            newState = action.seamaUser;
            console.log('RECEIVE_SEMA_USER Action')
            return newState;
        default:
            return state;
    }
}

