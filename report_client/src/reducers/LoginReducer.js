import {FETCH_LOGIN, RECEIVE_LOGIN, SET_LOGIN} from 'actions/ActionTypes';

export default (state = {logState: 'idle'}, action) => {
	let newState;

	switch (action.type) {
		case FETCH_LOGIN:
			console.log('FETCH_LOGIN Action');
			return action;
		case RECEIVE_LOGIN:
			newState = action.logState;
			console.log('RECEIVE_LOGIN Action');
			return newState;
		case SET_LOGIN:
			newState = {logState: action.logState};
			console.log('SET_LOGIN Action');
			return newState;
		default:
			return state;
	}
}
