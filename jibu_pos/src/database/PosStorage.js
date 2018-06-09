const {React,AsyncStorage} = require('react-native');
// var SQLite = require('react-native-sqlite-storage');
// SQLite.DEBUG(true);
// SQLite.enablePromise(true);

const customersKey = '@Sema:CustomersKey';
const versionKey = '@Sema:VersionKey';
const salesKey = '@Sema:SalesKey';
const saleItemKey = '@Sema:SaleItemKey';

class PosStorage {
	constructor() {
		this.version = null;
		this.customers = [];
		this.sales = [];
	}

	Initialize() {
		console.log("Pos Storage: Initialize");
		return new Promise((resolve, reject) => {
			this.getKey(versionKey)
				.then((version) => {
					if (version == null) {
						console.log("Pos Storage: Not initialized");
						this.version = '1';
						this.setKey(versionKey, this.version);
						this.setKey(customersKey, this.stringify(this.customers)).then( () =>{
							this.setKey(salesKey, this.stringify(this.sales)).then( () => {
								resolve(false);
							});
						});
					} else {
						console.log("Pos Storage: Version = " + version);
						this.version = version;
						this.getKey(customersKey)
							.then(customers => {
								this.customers = this.parseJson(customers);
								console.log("PosStorage - Data retreived");
								this.getKey(salesKey)
							.then( sales =>{
								this.sales = this.parseJson(sales);
								resolve(true);})
							})
							.catch(error =>{
								console.log("Pos Storage: Exception " + error.message);
								reject(error);
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
	}

	AddCustomers( customerArray ){
		if( this.customers.length > 0 ){
			console.log("AddCustomers - need to merge....");
		}else{
			console.log("No existing customers no need to merge....");
			this.customers = customerArray;
			this.setKey(customersKey, this.stringify( this.customers ) );
		}
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
		return JSON.parse(jsonString);
	}

	async getKey( key) {
		try {
			console.log("Pos Storage:GetKey()" + key);
			const value = await AsyncStorage.getItem(key );
			return value;
		} catch (error) {
			console.log("Pos Storage Error retrieving data");
		}
	}
	async setKey( key, stringValue ) {
		try {
			await AsyncStorage.setItem(key, stringValue);

		} catch (error) {
			console.log("Pos Storage Error retrieving data" + error);
		}
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
