export const ADD_PRODUCT_TO_ORDER = 'ADD_PRODUCT';
export const CLEAR_ORDER = 'CLEAR_ORDER';
export const REMOVE_PRODUCT = 'REMOVE_PRODUCT';
export const SET_PRODUCT_QUANTITY = 'SET_PRODUCT_QUANTITY';
export const SET_ORDER_CHANNEL = 'SET_CHANNEL';

export function AddProductToOrder( product, quantity ) {
	console.log("AddProductToOrder - action");
	return (dispatch) => { dispatch({type: ADD_PRODUCT_TO_ORDER, data:{product:product, quantity:quantity}})};
}

export function RemoveProductFromOrder( product ) {
	console.log("RemoveProductFromOrder - action");
	return (dispatch) => { dispatch({type: REMOVE_PRODUCT, data:{product:product}})};
}

export function SetProductQuantity( product, quantity ) {
	console.log("SetProductQuantity - action");
	return (dispatch) => { dispatch({type: SET_PRODUCT_QUANTITY, data:{product:product, quantity:quantity}})};
}

export function SetOrderChannel( channel) {
	console.log("SetOrderChannel - action");
	return (dispatch) => { dispatch({type: SET_ORDER_CHANNEL, data:{channel:channel}})};
}
