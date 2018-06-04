export const ADD_PRODUCT_TO_ORDER = 'ADD_PRODUCT';
export const CLEAR_ORDER = 'CLEAR_ORDER';

export function AddProductToOrder( product, quantity ) {
	console.log("AddProductToOrder - action");

	return (dispatch) => { dispatch({type: ADD_PRODUCT_TO_ORDER, data:{product:product, quantity:quantity}})};
}
