import {FETCH_LOGIN, RECEIVE_LOGIN, SET_LOGIN} from 'actions/ActionTypes';

/*
 * logState can be any of the following:
 * - idle
 * - loading
 * - success
 * - noService
 * - badCredentials
 */

export default (state = {logState: 'idle'}, action) => {
	let newState;

	switch (action.type) {
		case FETCH_LOGIN:
			console.log(JSON.stringify(action));
			newState = {logState: action.data.logState};
			console.log('FETCH_LOGIN Action');
			return newState;
		case RECEIVE_LOGIN:
			newState = {logState: action.data.logState};
			console.log('RECEIVE_LOGIN Action');
			return newState;
		default:
			return state;
	}
}
