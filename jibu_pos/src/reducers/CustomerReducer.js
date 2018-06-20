
import { CUSTOMER_SELECTED, CUSTOMERS_LOADED, CUSTOMERS_SET, CUSTOMERS_SEARCH } from "../actions/CustomerActions"

let initialState = {selectedCustomer:{}, customers:[], searchString:""};

const customerReducer = (state = initialState, action) => {
	console.log("customerReducer: " +action.type);
	let newState;
	switch (action.type) {
		case CUSTOMER_SELECTED:
			newState = {...state};
			newState.selectedCustomer = action.data ;
			return newState;
		case CUSTOMERS_SET:
			newState = {...state};
			newState.customers = action.data ;
			return newState;
		case CUSTOMERS_SEARCH:
			newState = {...state};
			newState.searchString = action.data ;
			return newState;
		case CUSTOMERS_LOADED:
			return state;		// Customers need to be merged,,
		default:
			return state;
	}
};

export default customerReducer;

