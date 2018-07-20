import mock_customers from "../mock_data/customers";
import PosStorage from '../database/PosStorage';
import Communications from '../services/Communications';
import Events from "react-native-simple-events";

class Synchronization {
	initialize( lastCustomerSync, lastProductSync){
		this.lastCustomerSync = lastCustomerSync;
		this.lastProductSync = lastProductSync;

	}
	scheduleSync( syncState, timeout, loadCustomersFn){
		let state = syncState;
		let loadCustomers = loadCustomersFn;
		setTimeout(() => {
			console.log("Synchronizing...");
			loadCustomers();
		}, timeout);
	}
	updateLastCustomerSync(){
		this.lastCustomerSync = new Date();
		PosStorage.setLastCustomerSync( this.lastCustomerSync );
	}
	updateLastProductSync(){
		this.lastProductSync = new Date();
		PosStorage.setLastProductSync( this.lastProductSync );
	}

	synchronize(){
		try {
			this.refreshToken().then( ()=>{
				this.synchronizeCustomers();
				this.synchronizeProducts();
			});
		}catch( error ){
			console.log( error.message );
		}

	}
	synchronizeCustomers(){
		console.log( "Synchronization:synchronizeCustomers - Begin" );
		Communications.getCustomers( this.lastCustomerSync )
			.then( web_customers => {
				if (web_customers.hasOwnProperty("customers")) {
					this.updateLastCustomerSync();
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
											.then(() => {
												console.log("Synchronization:synchronizeCustomers - Removing customer from pending list - " + customer.contactName);
												PosStorage.removePendingCustomer(customerKey)
											})
											.catch(error => console.log("Synchronization:synchronizeCustomers Create Customer failed"));
									} else if (customer.syncAction === "delete") {
										console.log("Synchronization:synchronizeCustomers -deleting customer - " + customer.contactName);
										Communications.deleteCustomer(customer)
											.then(() => {
												console.log("Synchronization:synchronizeCustomers - Removing customer from pending list - " + customer.contactName);
												PosStorage.removePendingCustomer(customerKey)
											})
											.catch(error => console.log("Synchronization:synchronizeCustomers Delete Customer failed " + error));

									} else if (customer.syncAction === "update") {
										console.log("Synchronization:synchronizeCustomers -updating customer - " + customer.contactName);
										Communications.updateCustomer(customer)
											.then(() => {
												console.log("Synchronization:synchronizeCustomers - Removing customer from pending list - " + customer.contactName);
												PosStorage.removePendingCustomer(customerKey)
											})
											.catch(error => console.log("Synchronization:synchronizeCustomers Update Customer failed " + error));

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
	synchronizeProducts(){
		console.log( "Synchronization:synchronizeProducts - Begin" );
		Communications.getProducts( this.lastProductSync )
			.then( products => {
				if (products.hasOwnProperty("products")) {
					this.updateLastProductSync();
					console.log( "Synchronization:synchronizeProducts. No of new remote products: " + products.products.length);
					const updated = PosStorage.mergeProducts( products.products );
					if( updated ){
						Events.trigger('ProductsUpdated', {} );
					}

				}
			})
			.catch(error => {
				console.log( "Communications.getProducts - error " + error);
			});
	}

	refreshToken(){
		// Check if token exists or has expired
		return new Promise((resolve ) => {
			let settings = PosStorage.getSettings();
			let tokenExpirationDate = PosStorage.getTokenExpiration();
			let currentDateTime = new Date();

			if( settings.token.length == 0 ||currentDateTime > tokenExpirationDate ){
				// Either user has previously logged out or its time for a new token
				console.log("No token or token has expired - Getting a new one");
				Communications.login()
					.then(result => {
						if (result.status === 200) {
							console.log("New token Acquired");
							PosStorage.saveSettings( settings.semaUrl, settings.site, settings.user,
								settings.password, result.response.token, settings.siteId );
							Communications.setToken(result.response.token);
							PosStorage.setTokenExpiration();
						}
						resolve();
					});

			}else{
				console.log("Existing token is valid");
				resolve();
			}
		});
	}

}
export default  new Synchronization();
