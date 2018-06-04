
import { combineReducers } from 'redux';
import customerReducer from "./CustomerReducer";
import networkReducer from "./NetworkReducer";
import customerBarReducer from "./CustomerBarReducer";
import productReducer from "./ProductReducer";
import orderReducer from "./OrderReducer";

// Combine all the reducers
const RootReducer = combineReducers({
	customerReducer,
	networkReducer,
	customerBarReducer,
	productReducer,
	orderReducer

})

export default RootReducer;
