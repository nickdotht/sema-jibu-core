
import { NETWORK_CONNECTION} from "../actions/NetworkActions"

let initialState = {isNWConnected:true};

const networkReducer = (state = initialState, action) => {
	let newState;
	console.log("networkReducer: " +action.type);
	switch (action.type) {
		case NETWORK_CONNECTION:
			newState = {...state};
			newState.isNWConnected = action.data ;
			return newState;


		default:
			return state;
	}
};

export default networkReducer;

