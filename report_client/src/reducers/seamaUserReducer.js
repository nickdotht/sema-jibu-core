import initialState from './initialState';
import {RECEIVE_SEMA_USER} from 'actions/actionTypes';

export default function seamaUser(state = initialState.seamaUser, action) {
    let newState;
    switch (action.type) {
        case RECEIVE_SEMA_USER:
            newState = action.seamaUser;
            console.log('RECEIVE_SEMA_USER Action')
            return newState;
        default:
            return state;
    }
}

