import { SET_SETTINGS, SET_CONFIGURATION} from "../actions/SettingsActions"

let initialState = {settings:{semaUrl:"XX", site:"", user:"", password:""}, configuration:{token:"", siteId:""}};

const settingsReducer = (state = initialState, action) => {
	let newState;
	console.log("settingsReducer: " +action.type);
	switch (action.type) {
		case SET_SETTINGS:
			newState = {...state};
			newState.settings = action.data.settings ;
			console.log( JSON.stringify(newState));
			return newState;
		case SET_CONFIGURATION:
			newState = {...state};
			newState.configuration = action.data.configuration ;
			console.log( JSON.stringify(newState));
			return newState;

		default:
			return state;
	}
};

export default settingsReducer;
