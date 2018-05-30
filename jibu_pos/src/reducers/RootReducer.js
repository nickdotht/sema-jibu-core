
import { combineReducers } from 'redux';
import customerReducer from "./CustomerReducer";
import networkReducer from "./NetworkReducer";

// Combine all the reducers
const RootReducer = combineReducers({
	customerReducer,
	networkReducer

})

export default RootReducer;
