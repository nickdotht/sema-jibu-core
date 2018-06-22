import { SET_SETTINGS} from "../actions/SettingsActions"

let initialState = {settings:{semaUrl:"XX", site:"", user:"", password:""}};

const settingsReducer = (state = initialState, action) => {
	let newState;
	console.log("settingsReducer: " +action.type);
	switch (action.type) {
		case SET_SETTINGS:
			newState = {settings:action.data.settings};
			console.log( JSON.stringify(newState));
			return newState;

		default:
			return state;
	}
};

export default settingsReducer;
