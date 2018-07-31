export const PRODUCTS_LOADED = 'PRODUCTS_LOADED';
export const PRODUCTS_SET = 'PRODUCTS_SET';

import mock_products from '../mock_data/products';

// export function LoadProducts( ) {
// 	console.log("LoadProducts - action");
//
// 	return (dispatch) => {
// 		setTimeout(() => {
// 			console.log("LoadProducts - loaded!!!");
// 			let mock_copy = mock_products.slice();
// 			dispatch({type: PRODUCTS_LOADED, data:mock_copy});
// 		}, 10);
//
// 	};
// }

export function setProducts( products ) {
	console.log("setProducts - action. No of products " + products.length);

	return (dispatch) => {dispatch({type: PRODUCTS_SET, data:products})};

}
