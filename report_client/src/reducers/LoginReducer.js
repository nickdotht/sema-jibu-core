import {FETCH_LOGIN, RECEIVE_LOGIN, SET_LOGIN} from 'actions/ActionTypes';

export default function login(state = {LogState:"NotLoggedIn"}, action) {
	let newState;
	switch (action.type) {
		case FETCH_LOGIN:
			console.log('FETCH_LOGIN Action');
			return action;
		case RECEIVE_LOGIN:
			newState = action.LogState;
			console.log('RECEIVE_LOGIN Action');
			return newState;
		case SET_LOGIN:
			newState = {LogState:action.LogState};
			console.log('SET_LOGIN Action');
			return newState;
		default:
			return state;
	}
}
