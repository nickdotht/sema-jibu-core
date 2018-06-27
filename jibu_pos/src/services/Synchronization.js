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
		// const pendingCustomers = PosStorage.getPendingCustomers().slice();
		// for( let customer in pendingCustomers){
		// 	Communications.createCustomer( customer )
		// 		.then( (createdCustomer) =>{
		// 			PosStorage.removePendingCustomer(createdCustomer)
		// 		})
		// 		.catch(error => console.log("Synchronization:syncNowTemp Create Customer failed"))
    //
		// }
	}
};
