import { RECEIVE_KIOSKS} from 'actions/ActionTypes';

export default function kiosk(state = {kiosks:[]}, action) {
	let newState;
	switch (action.type) {
		case RECEIVE_KIOSKS:
			newState = action.kiosks;
			console.log('RECEIVE_KIOSKS Action');
			return newState;
		default:
			return state;
	}
}
