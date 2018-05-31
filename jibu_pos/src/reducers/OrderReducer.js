
import { ADD_PRODUCT_TO_ORDER, CLEAR_ORDER } from "../actions/OrderActions"

let initialState = {products:[]};

const orderReducer = (state = initialState, action) => {
	console.log("productReducer: " +action.type);
	let newState;
	switch (action.type) {
		case ADD_PRODUCT_TO_ORDER:
			newState = {...state};
			// Check if product exists
			for( let product of newState.products ){
				if( product.product.id ===  action.data.product.id){
					product.quantity += action.data.quantity;
					newState.products = newState.products.slice();
					return newState;
				}
			}
			newState.products = newState.products.concat( action.data) ;
			return newState;
		case CLEAR_ORDER:
			newState = {...state};
			newState.products = [];
			return newState;
		default:
			return state;
	}
};

export default orderReducer;

