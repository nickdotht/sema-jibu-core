export const PRODUCTS_LOADED = 'PRODUCTS_LOADED';

import mock_products from '../mock_data/products';

export function LoadProducts( ) {
	console.log("LoadProducts - action");

	return (dispatch) => {
		setTimeout(() => {
			console.log("LoadProducts - loaded!!!");
			let mock_copy = mock_products.slice();
			dispatch({type: PRODUCTS_LOADED, data:mock_copy});
		}, 10);

	};
}
