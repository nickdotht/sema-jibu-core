
import { SHOW_REPORT, SHOW_MAIN} from "../actions/ToolBarActions"

let initialState = { showScreen :{showMain:true, showReport:false}};

const toolBarReducer = (state = initialState, action) => {
	let newState;
	console.log("toolBarReducer: " +action.type);
	switch (action.type) {
		case SHOW_REPORT:
			newState = { showScreen :{showMain:false, showReport:true}};
			return newState;

		case SHOW_MAIN:
			newState = { showScreen :{showMain:true, showReport:false}};
			return newState;

		default:
			return state;
	}
};

export default toolBarReducer;

