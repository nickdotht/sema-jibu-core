/*
This class contains the persistence implementation of the tablet business objects such as customers, sales, products

 */
const {React,AsyncStorage} = require('react-native');

const uuidv1 = require('uuid/v1');

const versionKey = '@Sema:VersionKey';
const customersKey = '@Sema:CustomersKey';
const customerItemKey = '@Sema:CustomerItemKey';
const salesKey = '@Sema:SalesKey';
const saleItemKey = '@Sema:SaleItemKey';
const productsKey = '@Sema:ProductsKey';
const productItemKey = '@Sema:ProductItemKey';
const lastCustomerSyncKey = '@Sema:LastCustomerSyncKey';
const lastSalesSyncKey = '@Sema:LastSalesSyncKey';
const lastProductsSyncKey = '@Sema:LastProductsSyncKey';

const pendingCustomersKey = '@Sema:PendingCustomersKey';
const pendingSalesKey = '@Sema:PendingSalesKey';

const settingsKey = '@Sema:SettingsKey';
// const configurationKey = '@Sema:ConfigurationKey';

class PosStorage {
	constructor() {
		// Version, major versions require the storage to be re-written
		this.version = null;

		// Customers are saved in the form customerItemKey + Customer.id
		// For example "@Sema:CustomerItemKey_ea6c365a-7338-11e8-a3c9-ac87a31a5361"
		this.customersKeys = [];  	// Array of customer keys
		this.customers = [];		// De-referenced customers

		// Sales are saved in the form {dateTime, salesItemKey} where dateTime is an ISO datetime string
		// and salestItemKey is a key to the sales item
		// For example '{"2018-05-01 00:00:00":"@Sema:SaleItemKey_2018-05-01 00:00:00"}'
		// Sales are stored most recent to oldest.
		this.salesKeys = [];

		// Products are saved in the form productItemKey + Product.sku
		// For example "@Sema:productItemKey_sku-100"
		this.productsKeys = [];  	// Array of product keys
		this.products = [];			// De-referenced products

		// Pending customers is the array of customers, stored locally but not yet sent to the server
		this.pendingCustomers = [];

		// Pending sales is the array of sales, stored locally but not yet sent to the server
		this.pendingSales = [];

		// Last sync DateTime is the last date time that items were synchronized with the server
		let firstSyncDate = new Date('November 7, 1973');
		this.lastCustomerSync = firstSyncDate;
		this.lastSalesSync = firstSyncDate;
		this.lastProductsSync = firstSyncDate;
		this.settings = {semaUrl:"Not Set", site:"Kampala", user:"", password:"", token:"", siteId:"", useMockData:true};
	}

	initialize( forceNew ) {
		console.log("PosStorage: initialize - forceNew=" + forceNew);
		return new Promise((resolve, reject) => {
			this.getKey(versionKey)
				.then((version) => {
					if (version == null || forceNew === true ) {
						console.log("Pos Storage: Not initialized");
						this.version = '1';
						let keyArray = [
							[versionKey, this.version],
							[customersKey, this.stringify(this.customersKeys)],
							[salesKey, this.stringify(this.salesKeys)],
							[productsKey, this.stringify(this.productsKeys)],
							[lastCustomerSyncKey,this.lastCustomerSync.toISOString()],
							[lastSalesSyncKey,this.lastSalesSync.toISOString()],
							[lastProductsSyncKey,this.lastProductsSync.toISOString()],
							[pendingCustomersKey, this.stringify(this.pendingCustomers)],
							[pendingSalesKey, this.stringify(this.pendingSales)],
							[settingsKey, this.stringify(this.settings)]];
						AsyncStorage.multiSet(keyArray ).then( error =>{
							console.log( "PosStorage:initialize: Error: " + error );
							resolve(false)})

					} else {
						console.log("Pos Storage: Version = " + version);
						this.version = version;
						let keyArray = [customersKey,salesKey,productsKey,lastCustomerSyncKey,
							lastSalesSyncKey,lastProductsSyncKey,
							pendingCustomersKey, pendingSalesKey,
							settingsKey];
						AsyncStorage.multiGet(keyArray ).then( function(results){
							console.log( "PosStorage Multi-Key" + results.length );
							for( let i = 0; i < results.length; i++ ){
								console.log(" key : " + results[i][0] + " Value : " +  results[i][1]);
							}
							this.customersKeys = this.parseJson(results[0][1]);	// Array of customer keys
							this.salesKeys = this.parseJson(results[1][1]);	// Array of sales keys
							this.productsKeys = this.parseJson(results[2][1]);	// Array of products keys
							this.lastCustomerSync = new Date(results[3][1]);	// Last customer sync time
							this.lastSalesSync = new Date(results[4][1]);	// Last sales sync time
							this.lastProductsSync = new Date(results[5][1]);	// Last products sync time
							this.pendingCustomers = this.parseJson(results[6][1]);	// Array of pending customers
							this.pendingSales = this.parseJson(results[7][1]);	// Array of pending sales
							this.settings = this.parseJson(results[8][1]);		// Settings
							this.loadCustomersFromKeys()
								.then(()=>{
									this.loadProductsFromKeys()
										.then(()=> resolve(true));

								})
								.catch((err) =>reject(err));

						}.bind(this));
					}})
				.catch(err => {
					console.log("Pos Storage: Exception " + err.message);
					reject(err);
				});
		});
	}

	getLastCustomerSync(){
		return this.lastCustomerSync;
	}
	getLastProductSync(){
		return this.lastProductsSync;
	}

	// clearAll(){
	// 	this.removeKey(salesKey );
	// 	this.removeKey(customersKey );
	// 	this.removeKey(versionKey );
	// 	this.salesKeys = [];
	// 	this.customers = [];
	// 	this.settings = {semaUrl:"Not Set", site:"Kampala", user:"", password:"", token:"", siteId:"", useMockData:true};
	// }
	clearDataOnly(){
		// Clear all data - leave config alone
		this.customers = [];
		this.customersKeys = [];
		this.pendingCustomers = [];
		this.salesKeys = [];
		this.pendingSales = [];

		this.products = [];
		this.productsKeys = [];

		let firstSyncDate = new Date('November 7, 1973');
		this.lastCustomerSync = firstSyncDate;
		this.lastSalesSync = firstSyncDate;
		this.lastProductsSync = firstSyncDate;

		let keyArray = [
			[customersKey,  this.stringify(this.customersKeys)],
			[productsKey,  this.stringify(this.productsKeys)],
			[pendingCustomersKey, this.stringify(this.pendingCustomers)],
			[salesKey,  this.stringify(this.salesKeys)],
			[pendingSalesKey, this.stringify(this.pendingSales)],
			[lastCustomerSyncKey,this.lastCustomerSync.toISOString()],
			[lastSalesSyncKey,this.lastSalesSync.toISOString()],
			[lastProductsSyncKey,this.lastProductsSync.toISOString()]];
		AsyncStorage.multiSet( keyArray).then( error => {
			if( error ) {
				console.log("PosStorage:clearDataOnly: Error: " + error);
			}
		});
	}

	makeCustomerKey( customer ){
		return (customerItemKey + '_' + customer.customerId);
	}
	customerIdFromKey( customerKey ){
		const prefix = customerItemKey + '_';
		return customerKey.slice( prefix.length );
	}

	createCustomer(phone, name, address, siteId ){
		const now = new Date();
		this.createCustomerFull( phone, name, address, siteId, now, now)
	}
	createCustomerFull(phone, name, address, siteId, createdDate, updatedDate ){
		const newCustomer = {
			customerId:uuidv1(),
			contactName:name,
			phoneNumber:phone,
			address:address,
			siteId:siteId,
			customerType:128,	// TODO - Hard coded - very fragile
			createdDate:createdDate,
			updatedDate:updatedDate

		};
		let key = this.makeCustomerKey(newCustomer);
		this.customers.push( newCustomer );
		newCustomer.syncAction = "create";
		this.customersKeys.push( key );
		this.pendingCustomers.push( key );
		let keyArray = [
			[customersKey,  this.stringify(this.customersKeys)],				// Array of customer keys
			[key, this.stringify(newCustomer) ],								// The new customer
			[pendingCustomersKey, this.stringify(this.pendingCustomers)]	// Array pending customer
		];
		AsyncStorage.multiSet( keyArray).then( error => {
			console.log("PosStorage:createCustomer: Error: " + error);
			if( error ) {
				console.log("PosStorage:createCustomer: Error: " + error);
			}
		});
		return newCustomer;
	}
	deleteCustomer( customer ){
		let key = this.makeCustomerKey(customer);
		let index = this.customers.indexOf(customer);
		if (index > -1) {
			let customer = this.customers[index];
			customer.syncAction = "delete";
			this.customers.splice(index, 1);
			index = this.customersKeys.indexOf(key);
			if (index > -1) {
				this.customersKeys.splice(index, 1);
			}
			this.pendingCustomers.push( key );
			let keyArray = [
				[customersKey,  this.stringify(this.customersKeys)],			// Array of customer keys
				[key, this.stringify(customer) ],								// The customer being deleted
				[pendingCustomersKey, this.stringify(this.pendingCustomers)]	// Array pending customer
			];
			AsyncStorage.multiSet( keyArray).then( error => {
				if( error ) {
					console.log("PosStorage:deleteCustomer: Error: " + error);
				}
			});
		}
	}
	updateCustomer( customer, phone, name, address){
		let key = this.makeCustomerKey(customer);
		customer.contactName = name; 	// FIXUP - Won't be contactName forever
		customer.phoneNumber = phone; 	// FIXUP - Won't be phone_number forever
		customer.address = address; 	// FIXUP - Won't be address forever
		customer.updatedDate = new Date();
		customer.syncAction = "update";

		this.pendingCustomers.push( key );

		let keyArray = [
			[key, this.stringify(customer) ],								// Array of customer keys
			[pendingCustomersKey, this.stringify(this.pendingCustomers)]	// Array pending customer
		];
		AsyncStorage.multiSet( keyArray).then( error => {
			if( error ) {
				console.log("PosStorage:updateCustomer: Error: " + error);
			}
		});

	}
	addRemoteCustomers(customerArray ){
		console.log("PosStorage:addCustomers: No existing customers no need to merge....");
		this.customers = customerArray;
		const keyValueArray = customerArray.map( (customer) => {
			return [ this.makeCustomerKey(customer), this.stringify(customer)];
		});
		const keyArray = customerArray.map( (customer) => {
			return this.makeCustomerKey(customer);
		});
		this.customersKeys  = keyArray;
		keyValueArray.push([ customersKey, this.stringify(keyArray) ] );
		AsyncStorage.multiSet(keyValueArray ).then( error => {
			if( error ) {
				console.log("PosStorage:addCustomers: Error: " + error);
			}
		});
	}

	// Merge new customers into existing ones
	mergeCustomers( remoteCustomers){
		let newCustomersAdded = remoteCustomers.length > 0 ? true : false;
		if( this.customers.length  == 0 ){
			this.addRemoteCustomers( remoteCustomers);
			return { pendingCustomers:this.pendingCustomers.slice(), updated:newCustomersAdded};
		}else{
			// Need to merge webCustomers with existing and pending customers
			console.log( "PosStorage:mergeCustomers. Merging " +  remoteCustomers.length + " web Customers into existing and pending customers" );
			let webCustomersToUpdate = [];
			let isPendingModified = false;
			remoteCustomers.forEach( remoteCustomer => {
				const webCustomerKey = this.makeCustomerKey(remoteCustomer);
				const pendingIndex = this.pendingCustomers.indexOf(webCustomerKey);
				if (pendingIndex != -1) {
					let localCustomer = this.getLocalCustomer(remoteCustomer.customerId );
					if(localCustomer ) {
						console.log("PostStorage - mergeCustomers. Local Date " + new Date(localCustomer.updatedDate) +
							" Remote Date " + remoteCustomer.updatedDate );
					}
					if( localCustomer &&  remoteCustomer.updatedDate > new Date(localCustomer.updatedDate) ){
						// remoteCustomer is the latest
						console.log("PostStorage - mergeCustomers. Remote customer " + remoteCustomer.contactName + " is later:")
						webCustomersToUpdate.push( remoteCustomer );
						this.pendingCustomers.splice(pendingIndex, 1);
						isPendingModified = true;
					}else{
						console.log("PostStorage - mergeCustomers. Local customer " + localCustomer.contactName + " is later:")
					}

				}else{
					webCustomersToUpdate.push( remoteCustomer );
				}
			});
			if( isPendingModified ){
				this.setKey( pendingCustomersKey, this.stringify(this.pendingCustomers));
			}
			this.mergeRemoteCustomers( webCustomersToUpdate );
			return { pendingCustomers:this.pendingCustomers.slice(), updated:newCustomersAdded};
		}
	}
	mergeRemoteCustomers( remoteCustomers){
		let isNewCustomers = false;
		remoteCustomers.forEach( function(customer){
			let customerKey = this.makeCustomerKey(customer);
			let keyIndex = this.customersKeys.indexOf(customerKey);
			if( keyIndex == -1 ){
				isNewCustomers = true;
				this.customersKeys.push(customerKey );
				this.customers.push(customer);
				this.setKey( customerKey,this.stringify(customer));
			}else{
				this.setKey( customerKey,this.stringify(customer));		// Just update the existing customer
				this.setLocalCustomer(customer)
			}
		}.bind(this));
		if( isNewCustomers ){
			this.setKey( customersKey,this.stringify(this.customersKeys));
		}

	}
	getLocalCustomer( customerId ){
		for( let index = 0; index < this.customers.length; index++ ){
			if(this.customers[index].customerId ===  customerId){
				return this.customers[index];
			}
		}
		return null;
	}

	setLocalCustomer( customer ){
		for( let index = 0; index < this.customers.length; index++ ){
			if(this.customers[index].customerId ===  customer.customerId){
				this.customers[index] = customer;
				return;
			}
		}
	}

	loadCustomersFromKeys(){
		console.log("loadCustomersFromKeys. No of customers: " + this.customersKeys.length );
		return new Promise((resolve, reject) => {
			try {
				let that = this;
				AsyncStorage.multiGet(this.customersKeys).then(results => {
					that.customers = results.map(result => {
						return that.parseJson(result[1]);
					});
					resolve();
				});
			}catch( error){
				reject(error);
			}
		});
	}

	removePendingCustomer( customerKey ){
		console.log("PostStorage:removePendingCustomer" );
		const index = this.pendingCustomers.indexOf(customerKey);
		if (index > -1) {
			let deletedItems = this.pendingCustomers.splice(index, 1);
			let keyArray = [[pendingCustomersKey, this.stringify(this.pendingCustomers)]];
			AsyncStorage.multiSet( keyArray).then( error => {
				if( error ) {
					console.log("PosStorage:removePendingCustomer: Error: " + error);
				}
			});

		}

	}

	getCustomerFromKey( customerKey ){
		return new Promise( resolve => {
			this.getKey( customerKey )
				.then( customer => {
					resolve( this.parseJson(customer)) } )
				.catch( error =>{

				 	resolve(null)});
		})
	}

	getCustomers(){
		console.log("PosStorage: getCustomers. Count " + this.customers.length);
		return this.customers;
	}
	getPendingCustomers(){
		console.log("PosStorage: getPendingCustomers. Count " + this.pendingCustomers.length);
		return this.pendingCustomers;
	}

	getSales(){
		console.log("PosStorage: getSales. Count " + this.salesKeys.length);
		return this.salesKeys;
	}

	addSale( sale){
		console.log("PosStorage: addSale" );
		return new Promise((resolve, reject) => {
			let saleDateTime = new Date(Date.now());
			let saleDateKey = saleDateTime.toISOString();
			this.salesKeys.push({saleDateTime:saleDateKey, saleKey:saleItemKey + saleDateKey});
			this.pendingSales.push(saleItemKey + saleDateKey);
			let keyArray = [
				[ saleItemKey + saleDateKey, this.stringify(sale)],		// The sale
				[ salesKey, this.stringify(this.salesKeys)],			// Array of date/time sales keys
				[ pendingSalesKey, this.stringify(this.pendingSales)]];	// Pending sales keys
			AsyncStorage.multiSet(keyArray ).then( error =>{
				if( error ){
					reject(error);
				}else{
					resolve(true);
				}
			});
		});
	}
	loadSale( saleKey){
		console.log("PosStorage:loadSale" );
		return new Promise((resolve, reject) => {
			this.getKey(saleKey.saleKey )
				.then( sale => {
					resolve( this.parseJson(sale));
				})
				.catch(err => reject(err))

		});
	}

	getProducts(){
		console.log("PosStorage: getProducts. Count " + this.products.length);
		return this.products;
	}

	loadProductsFromKeys(){
		console.log("loadProductsFromKeys. No of products: " + this.productsKeys.length );
		return new Promise((resolve, reject) => {
			try {
				let that = this;
				AsyncStorage.multiGet(this.productsKeys).then(results => {
					that.products = results.map(result => {
						return that.parseJson(result[1]);
					});
					resolve();
				});
			}catch( error){
				reject(error);
			}
		});
	}

	makeProductKey( product ){
		return (productItemKey + '_' + product.productId);
	}

	mergeProducts( remoteProducts){
		let isNewProducts = false;
		remoteProducts.forEach( function(product){
			let productKey = this.makeProductKey(product);
			let keyIndex = this.productsKeys.indexOf(productKey);
			if( keyIndex == -1 ){
				isNewProducts = true;
				this.productsKeys.push(productKey );
				this.products.push(product);
				this.setKey( productKey,this.stringify(product));
			}else{
				this.setKey( productKey,this.stringify(product));		// Just update the existing customer
				this.setLocalProduct(product)
			}
		}.bind(this));
		if( isNewProducts ){
			this.setKey( productsKey,this.stringify(this.productsKeys));
		}
		if(remoteProducts.length > 0 ){
			return true;
		}else{
			return false;
		}

	}
	setLocalProduct( product ){
		for( let index = 0; index < this.products.length; index++ ){
			if(this.products[index].productId ===  product.productId){
				this.products[index] = product;
				return;
			}
		}
	}

	getSettings(){
		console.log("PosStorage: getSettings.");
		return this.settings;
	}

	saveSettings( url, site, user, password, token, siteId, useMockData ){
		let settings = {semaUrl:url, site:site, user:user, password:password, token:token, siteId:siteId, useMockData:useMockData};
		this.settings = settings;
		this.setKey( settingsKey, this.stringify( settings));

	}

	setLastCustomerSync( lastSyncTime ){
		this.lastCustomerSync = lastSyncTime;
		this.setKey( lastCustomerSyncKey,this.lastCustomerSync.toISOString());
	}

	setLastProductSync( lastSyncTime ){
		this.lastProductsSync = lastSyncTime;
		this.setKey( lastProductsSyncKey,this.lastProductsSync.toISOString());
	}

	stringify( jsObject){
		return JSON.stringify(jsObject);
	}
	parseJson( jsonString){
		if( typeof jsonString === 'string' ) {
			return JSON.parse(jsonString);
		}
		return null;
	}

	// async getKey( key) {
	// 	try {
	// 		console.log("Pos Storage:getKey()" + key);
	// 		const value = await AsyncStorage.getItem(key );
	// 		return value;
	// 	} catch (error) {
	// 		console.log("Pos Storage Error retrieving data");
	// 	}
	// }
	// async setKey( key, stringValue ) {
	// 	try {
	// 		console.log("Pos Storage:setKey() Key: " + key + " Value: " + stringValue);
	// 		await AsyncStorage.setItem(key, stringValue);
  //
	// 	} catch (error) {
	// 		console.log("Pos Storage Error saving data" + error);
	// 	}
	// }

	getKey( key) {
		return AsyncStorage.getItem(key );
	}
	setKey( key, stringValue ) {
		console.log("Pos Storage:setKey() Key: " + key + " Value: " + stringValue);
		return AsyncStorage.setItem(key, stringValue);
	}

	async removeKey( key ) {
		try {
			await AsyncStorage.removeItem(key );

		} catch (error) {
			console.log("Pos Storage Error removing data" + error);
		}
	}

}
// Storage is a singleton

export default  new PosStorage();
