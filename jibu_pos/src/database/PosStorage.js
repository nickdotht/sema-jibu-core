/*
This class contains the persistence implementation of the tablet business objects such as customers, sales, products

 */
const {React,AsyncStorage} = require('react-native');

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

	}

	Initialize() {
		console.log("Pos Storage: Initialize");
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
							[lastProductsSyncKey,currentDateTime] ];
						AsyncStorage.multiSet(keyArray ).then( error =>{
							console.log( "Pos Storage Multi-Key set, Error: " + error );
							resolve(false)})

					} else {
						console.log("Pos Storage: Version = " + version);
						this.version = version;
						let keyArray = [customersKey,salesKey,productsKey,lastCustomerSyncKey,lastSalesSyncKey,lastProductsSyncKey];
						var that = this;
						AsyncStorage.multiGet(keyArray ).then( results =>{
							console.log( "Pos Storage Multi-Key" + results.length );
							for( let i = 0; i < results.length; i++ ){
								console.log(" key : " + results[i][0] + " Value : " +  results[i][1]);
							}
							that.customersKeys = that.parseJson(results[0][1]);	// Array of customer keys
							that.loadCustomersFromKeys().then(()=>{
								resolve(true);});

						});
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
		this.sales = [];
	}
	makeCustomerKey( customer ){
		return (customerItemKey + '_' + customer.id);
	}
	createCustomer(){

	}
	updateCustomer( customer, phone, name, address){
		let key = this.makeCustomerKey(customer);
		customer.contact_name = name; 	// FIXUP - Won't be contact_name forever
		customer.phone_number = phone; 	// FIXUP - Won't be phone_number forever
		customer.address = address; 	// FIXUP - Won't be phone_number forever
		// persist the changes
		AsyncStorage.setItem( key, this.stringify(customer));

	}
	addCustomers( customerArray ){
		if( this.customers.length > 0 ){
			console.log("AddCustomers - need to merge....");
		}else{
			console.log("No existing customers no need to merge....");
			this.customers = customerArray;
			const keyValueArray = customerArray.map( (customer) => {
				return [ this.makeCustomerKey(customer), this.stringify(customer)];
			});
			const keyArray = customerArray.map( (customer) => {
				return this.makeCustomerKey(customer);
			});
			keyValueArray.push([ customersKey, this.stringify(keyArray) ] );
			AsyncStorage.multiSet(keyValueArray ).then( error => {
				console.log("Pos Storage writing customers and keys: Error: " + error);
			});

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

	GetCustomers(){
		console.log("PosStorage: GetCustomers. Count " + this.customers.length);
		return this.customers;
	}

	GetSales(){
		console.log("PosStorage: GetSales. Count " + this.sales.length);
		return this.sales;
	}

	AddSale( sale){
		console.log("AddSale" );
		return new Promise((resolve, reject) => {
			let saleDateTime = new Date(Date.now());
			let saleDateKey = saleDateTime.toISOString();
			// Save the serialized sale
			this.setKey(saleItemKey + saleDateKey, this.stringify(sale))
				.then(() => {
					// Add the key to sales and serialize it
					this.sales.push({saleDateTime:saleDateKey, saleKey:saleItemKey + saleDateKey});
					this.setKey(salesKey, this.stringify(this.sales))
						.then(() => resolve(true))
						.catch(error => reject(error));
				})
		});
	}
	LoadSale( saleKey){
		console.log("LoadSale" );
		return new Promise((resolve, reject) => {
			this.getKey(saleKey.saleKey )
				.then( sale => {
					resolve( this.parseJson(sale));
				})
				.catch(err => reject(err))

		});
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
