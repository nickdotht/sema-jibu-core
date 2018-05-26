export const CUSTOMER_SELECTED = 'CUSTOMER_SELECTED';
export const CUSTOMERS_LOADED = 'CUSTOMERS_LOADED';
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
			dispatch({type: CUSTOMERS_LOADED, data:mock_customers});
		}, 500);

	};
}
