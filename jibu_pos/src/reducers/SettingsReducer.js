import { SET_SETTINGS} from "../actions/SettingsActions"

let initialState = {settings:{semaUrl:"XX", site:"", user:"", password:"", token:"", sitedId:"",useMockData:true}};

const settingsReducer = (state = initialState, action) => {
	let newState;
	console.log("settingsReducer: " +action.type);
	switch (action.type) {
		case SET_SETTINGS:
			newState = {...state};
			newState.settings = action.data ;
			console.log( JSON.stringify(newState));
			return newState;

		default:
			return state;
	}
};

export default settingsReducer;
