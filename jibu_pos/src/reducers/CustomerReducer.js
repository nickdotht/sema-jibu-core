
import { CUSTOMER_SELECTED, CUSTOMERS_LOADED, CUSTOMERS_SET, CUSTOMERS_SEARCH } from "../actions/CustomerActions"
import PosStorage from "../database/PosStorage";

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
			let updatedCustomers = PosStorage.addCustomers(action.data);
			if(updatedCustomers ){
				newState = {...state};
				newState.customers = updatedCustomers ;
				return newState;
			}else{
				return state;
			}


		default:
			return state;
	}
};

export default customerReducer;

