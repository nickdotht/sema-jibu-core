
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
		case CUSTOMERS_LOADED:
		case CUSTOMERS_SET:
			newState = {...state};
			// Insert the dummy 'walkup customer
			const anonymous = { "id" : "9999999-9999-9999-9999-9999999",
					"version" : 3,
					"address" : "----------------------------",
					"contact_name" : "Walkup Client",
					"customer_type_id" : 120,
					"due_amount" : "---------------",
					"name" : "",
					"phone_number" : "----------------------------",
					"active" : "1",
					"sales_channel":"anonymous"};

			newState.customers = action.data ;
			// newState.customers.unshift(anonymous);
			return newState;
		case CUSTOMERS_SEARCH:
			newState = {...state};
			newState.searchString = action.data ;
			return newState;

		default:
			return state;
	}
};

export default customerReducer;

