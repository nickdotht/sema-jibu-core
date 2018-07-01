import mock_customers from "../mock_data/customers";
import PosStorage from '../database/PosStorage';
import Communications from '../services/Communications';
import Events from "react-native-simple-events";

class Synchronization {
	initialize( lastCustomerSync){
		this.lastCustomerSync = lastCustomerSync;

	}
	scheduleSync( syncState, timeout, loadCustomersFn){
		let state = syncState;
		let loadCustomers = loadCustomersFn;
		setTimeout(() => {
			console.log("Synchronizing...");
			loadCustomers();
		}, timeout);
	}

	synchronize(){
		try {
			this.synchronizeCustomers();
		}catch( error ){
			console.log( error.message );
		}

	}
	synchronizeCustomers(){
		console.log( "Synchronization:synchronizeCustomers - Begin" );
		Communications.getCustomers()
			.then( web_customers => {
				if (web_customers.hasOwnProperty("customers")) {
					console.log( "Synchronization:synchronizeCustomers No of new remote customers: " + web_customers.customers.length);
					// Get the list of customers that need to be sent to the server
					let { pendingCustomers, updated} = PosStorage.mergeCustomers( web_customers.customers );
					console.log( "Synchronization:synchronizeCustomers No of local pending customers: " + pendingCustomers.length);
					pendingCustomers.forEach(customerKey => {
						PosStorage.getCustomerFromKey(customerKey)
							.then( customer => {
								if (customer != null) {
									if (customer.syncAction === "create") {
										console.log("Synchronization:synchronizeCustomers -creating customer - " + customer.contactName);
										Communications.createCustomer(customer)
											.then((createdCustomer) => {
												console.log("Synchronization:synchronizeCustomers - Removing customer from pending list - " + customer.contactName);
												PosStorage.removePendingCustomer(customerKey)
											})
											.catch(error => console.log("Synchronization:synchronizeCustomers Create Customer failed"));
									} else if (customer.syncAction === "delete") {
										console.log("Synchronization:synchronizeCustomers -deleting customer - " + customer.contactName);
										Communications.deleteCustomer(customer)
											.then((deleteCustomer) => {
												console.log("Synchronization:synchronizeCustomers - Removing customer from pending list - " + customer.contactName);
												PosStorage.removePendingCustomer(customerKey)
											})
											.catch(error => console.log("Synchronization:synchronizeCustomers Delete Customer failed " + error));

									}

								} else {
									PosStorage.removePendingCustomer(customerKey);
								}
							});
					});
					if( updated ){
						Events.trigger('CustomersUpdated', {} );
					}
				}
			})
			.catch(error => {
				console.log( "Communications.getCustomers - error " + error);
			});
	}
}
export default  new Synchronization();
