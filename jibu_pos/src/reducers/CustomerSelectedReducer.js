
import { CUSTOMER_SELECTED } from "../actions/CustomerSelected"

let initialState = {SelectedCustomer:{}};

const customerSelectedReducer = (state = initialState, action) => {
	console.log("customerSelectedReducer")
	switch (action.type) {
		case CUSTOMER_SELECTED:
			state = Object.assign({}, state, { SelectedCustomer: action.data });
			return state;
		default:
			return state;
	}
};

export default customerSelectedReducer;

