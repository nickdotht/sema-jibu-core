
import { CUSTOMER_SELECTED, CUSTOMERS_LOADED } from "../actions/CustomerActions"

let initialState = {SelectedCustomer:{}, customers:[]};

const customerReducer = (state = initialState, action) => {
	console.log("customerReducer");
	let newState;
	switch (action.type) {
		case CUSTOMER_SELECTED:
			newState = {...state};
			state.SelectedCustomer = action.data ;
			return newState;
		case CUSTOMERS_LOADED:
			newState = {...state};
			state.customers = action.data ;
			return newState;

		default:
			return state;
	}
};

export default customerReducer;

