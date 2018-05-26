
import { combineReducers } from 'redux';
import customerReducer from "./CustomerReducer";


// Combine all the reducers
const RootReducer = combineReducers({
	customerReducer

})

export default RootReducer;
