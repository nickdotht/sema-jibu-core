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
		this.lastCustomerSync = null;
		this.lastSalesSync = null;
		this.lastProductsSync = null;
		this.settings = {semaUrl:"Not Set", site:"", user:"", password:"", token:"", siteId:"", useMockData:true};
	}

	initialize() {
		console.log("PosStorage: initialize");
		return new Promise((resolve, reject) => {
			this.getKey(versionKey)
				.then((version) => {
					if (version == null) {
						console.log("Pos Storage: Not initialized");
						this.version = '1';
						let currentDateTime = new Date().toISOString();
						let keyArray = [
							[versionKey, this.version],
							[customersKey, this.stringify(this.customersKeys)],
							[salesKey, this.stringify(this.salesKeys)],
							[productsKey, this.stringify(this.productsKeys)],
							[lastCustomerSyncKey,currentDateTime],
							[lastSalesSyncKey,currentDateTime],
							[lastProductsSyncKey,currentDateTime],
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
							this.productsKey = this.parseJson(results[2][1]);	// Array of products keys
							this.lastCustomerSync = new Date(results[3][1]);	// Last customer sync time
							this.lastSalesSync = new Date(results[4][1]);	// Last sales sync time
							this.lastProductsSync = new Date(results[5][1]);	// Last products sync time
							this.pendingCustomers = this.parseJson(results[6][1]);	// Array of pending customers
							this.pendingSales = this.parseJson(results[7][1]);	// Array of pending sales
							this.settings = this.parseJson(results[8][1]);		// Settings
							this.loadCustomersFromKeys()
								.then(()=>{ resolve(true);})
								.catch((err) =>reject(err));

						}.bind(this));
					}})
				.catch(err => {
					console.log("Pos Storage: Exception " + err.message);
					reject(err);
				});
		});
	}


	ClearAll(){
		this.removeKey(salesKey );
		this.removeKey(customersKey );
		this.removeKey(versionKey );
		this.salesKeys = [];
		this.customers = [];
		this.settings = {semaUrl:"Not Set", site:"", user:"", password:"", token:"", siteId:"", useMockData:true};
	}
	clearDataOnly(){
		// Clear all data - leave config alone
		this.customersKeys = [];
		this.pendingCustomers = [];
		let keyArray = [
			[customersKey,  this.stringify(this.customersKeys)],				// Array of customer keys
			[pendingCustomersKey, this.stringify(this.pendingCustomers)]	// Array pending customer
		];
		AsyncStorage.multiSet( keyArray).then( error => {
			if( error ) {
				console.log("PosStorage:clearDataOnly: Error: " + error);
			}
		});
	}

	makeCustomerKey( customer ){
		return (customerItemKey + '_' + customer.customerId);
	}
	createCustomer(phone, name, address ){
		const newCustomer = { customerId:uuidv1(), contactName:name, phoneNumber:phone, address:address, due_amount:0 };
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
	addCustomers( customerArray ){
		if( this.customers.length > 0 ){
			console.log("PosStorage:addCustomers - need to merge...." + JSON.stringify(customerArray) );
			return null;
		}else{
			console.log("PosStorage:addCustomers: No existing customers no need to merge....");
			this.customers = customerArray;
			const keyValueArray = customerArray.map( (customer) => {
				return [ this.makeCustomerKey(customer), this.stringify(customer)];
			});
			const keyArray = customerArray.map( (customer) => {
				return this.makeCustomerKey(customer);
			});
			keyValueArray.push([ customersKey, this.stringify(keyArray) ] );
			AsyncStorage.multiSet(keyValueArray ).then( error => {
				if( error ) {
					console.log("PosStorage:addCustomers: Error: " + error);
				}
			});
			return this.customers;
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


	getCustomers(){
		console.log("PosStorage: getCustomers. Count " + this.customers.length);
		return this.customers;
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
	getSettings(){
		console.log("PosStorage: getSettings.");
		return this.settings;
	}

	saveSettings( url, site, user, password, token, siteId, useMockData ){
		let settings = {semaUrl:url, site:site, user:user, password:password, token:token, siteId:siteId, useMockData:useMockData};
		this.settings = settings;
		this.setKey( settingsKey, this.stringify( settings));

	}
	// getConfiguration(){
	// 	console.log("PosStorage: getConfiguration.");
	// 	return this.configuration;
	// }
  //
	// saveConfiguration( token, siteId ){
	// 	let configuration = {configuration:{token:token, siteId:siteId}};
	// 	this.configuration = configuration;
	// 	this.setKey( configurationKey, this.stringify( configuration));
  //
	// }

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
