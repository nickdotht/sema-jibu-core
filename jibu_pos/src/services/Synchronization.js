import mock_customers from "../mock_data/customers";
import PosStorage from '../database/PosStorage';
import Communications from '../services/Communications';

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

	static syncNowTemp(){
		try {
			const pendingCustomers = PosStorage.getPendingCustomers().slice();
			pendingCustomers.forEach(customerKey => {
				const customer = PosStorage.getCustomerFromKey(customerKey);
				if (customer != null) {
					if( customer.syncAction === "create") {
						Communications.createCustomer(customer)
							.then((createdCustomer) => {
								console.log("Synchronization:syncNowTemp - Removing customer from pending list - " + customerKey);
								PosStorage.removePendingCustomer(customerKey) })
							.catch(error => console.log("Synchronization:syncNowTemp Create Customer failed"));
					}
				}
			})
		}catch( error ){
			console.log( error.message );
		}

	}
};
