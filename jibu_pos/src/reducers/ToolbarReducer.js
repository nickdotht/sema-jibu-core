
import { SHOW_REPORT, SHOW_MAIN, SET_LOGGED_IN} from "../actions/ToolBarActions"

let initialState = { showScreen :{showMain:true, showReport:false, isLoggedIn:false}};

const toolBarReducer = (state = initialState, action) => {
	let newState;
	console.log("toolBarReducer: " +action.type);
	switch (action.type) {
		case SHOW_REPORT:
			newState = { showScreen :{showMain:false, showReport:true, isLoggedIn:true}};
			return newState;

		case SHOW_MAIN:
			newState = { showScreen :{showMain:true, showReport:false, isLoggedIn:true}};
			return newState;

		case SET_LOGGED_IN:
			newState = { showScreen :{showMain:state.showScreen.showMain, showReport:state.showScreen.showReport, isLoggedIn:action.data.loggedIn}};
			return newState;

		default:
			return state;
	}
};

export default toolBarReducer;

