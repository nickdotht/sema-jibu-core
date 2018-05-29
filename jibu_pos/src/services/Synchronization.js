import mock_customers from "../mock_data/customers";
import {CUSTOMERS_LOADED} from "../actions/CustomerActions";

export default class Synchronization {
	static scheduleSync( syncState, timeout, loadCustomersFn){
		let state = syncState;
		let loadCustomers = loadCustomersFn;
		setTimeout(() => {
			console.log("Synchronizing...");
			state.customersLoaded = false;
			loadCustomers();
		}, timeout);
	}


};
