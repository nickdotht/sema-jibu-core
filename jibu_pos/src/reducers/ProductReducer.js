
import { PRODUCTS_LOADED } from "../actions/ProductActions"

let initialState = {products:[]};

const productReducer = (state = initialState, action) => {
	console.log("productReducer: " +action.type);
	let newState;
	switch (action.type) {
		case PRODUCTS_LOADED:
			newState = {...state};
			newState.products = action.data ;
			return newState;
		default:
			return state;
	}
};

export default productReducer;

