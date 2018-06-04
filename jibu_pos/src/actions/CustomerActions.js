export const CUSTOMER_SELECTED = 'CUSTOMER_SELECTED';
export const CUSTOMERS_LOADED = 'CUSTOMERS_LOADED';
export const CUSTOMERS_SET = 'CUSTOMERS_SET';
export const CUSTOMERS_SEARCH = 'CUSTOMERS_SEARCH';

import mock_customers from '../mock_data/customers';

export function CustomerSelected( customer){
	console.log("CustomerSelected - action");
	const data = customer;
	return (dispatch) => {
		dispatch({type: CUSTOMER_SELECTED, data:data});
	};
}
export function LoadCustomers( ) {
	console.log("LoadCustomers - action");

	return (dispatch) => {
		setTimeout(() => {
			console.log("LoadCustomers - loaded!!!");
			dispatch({type: CUSTOMERS_LOADED, data:mock_customers});
		}, 200);

	};
}

export function SetCustomers( customers ) {
	console.log("SetCustomers - action. No of customers " + customers.length);

	return (dispatch) => {dispatch({type: CUSTOMERS_SET, data:customers})};

}

export function SearchCustomers( searchString ) {
	console.log("SearchCustomers - action. Search is " + searchString);

	return (dispatch) => {dispatch({type: CUSTOMERS_SEARCH, data: searchString})};
}
