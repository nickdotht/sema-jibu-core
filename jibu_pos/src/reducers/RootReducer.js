
import { combineReducers } from 'redux';
import customerSelectedReducer from "./CustomerSelectedReducer";


// Combine all the reducers
const RootReducer = combineReducers({
	customerSelectedReducer

})

export default RootReducer;
