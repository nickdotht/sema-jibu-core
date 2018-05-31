export const PRODUCTS_LOADED = 'PRODUCTS_LOADED';

import mock_products from '../mock_data/products';

export function LoadProducts( ) {
	console.log("LoadProducts - action");

	return (dispatch) => {
		setTimeout(() => {
			console.log("LoadProducts - loaded!!!");
			dispatch({type: PRODUCTS_LOADED, data:mock_products});
		}, 10);

	};
}
