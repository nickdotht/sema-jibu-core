
import { CUSTOMER_SELECTED, CUSTOMERS_LOADED, CUSTOMERS_SET } from "../actions/CustomerActions"

let initialState = {SelectedCustomer:{}, customers:[]};

const customerReducer = (state = initialState, action) => {
	console.log("customerReducer");
	let newState;
	switch (action.type) {
		case CUSTOMER_SELECTED:
			newState = {...state};
			newState.SelectedCustomer = action.data ;
			return newState;
		case CUSTOMERS_LOADED:
		case CUSTOMERS_SET:
			newState = {...state};
			newState.customers = action.data ;
			return newState;

		default:
			return state;
	}
};

export default customerReducer;

