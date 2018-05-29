const {React,AsyncStorage} = require('react-native');
// var SQLite = require('react-native-sqlite-storage');
// SQLite.DEBUG(true);
// SQLite.enablePromise(true);

const customerKey = '@Sema:CustomerKey';
const versionKey = '@Sema:VersionKey';

export default class PosStorage {
	constructor() {
		this.version = null;
		this.customers = [];
	}

	Initialize() {
		console.log("Pos Storage: Initialize");
		return new Promise((resolve, reject) => {
			this.getKey(versionKey).then((version) => {
				if (version == null) {
					console.log("Pos Storage: Not initialized");
					this.version = '1';
					this.setKey(versionKey, this.version);
					this.setKey(customerKey, this.stringify(this.customers)).then( () =>{
						resolve( false );
					});
				} else {
					console.log("Pos Storage: Version = " + version);
					this.version = version;
					this.getKey(customerKey).then(customers => {
						this.customers = this.parseJson(customers);
						resolve(true);
					});
					console.log("PosStorage - Data retreived");
				}

			}).catch(err => {
				console.log("Pos Storage: Exception " + err.message);
				reject(err);
			});
		});
	}
	ClearAll(){
		this.removeKey(customerKey );
		this.removeKey(versionKey );
	}

	AddCustomers( customerArray ){
		if( this.customers.length > 0 ){
			console.log("AddCustomers - need to merge....");
		}else{
			console.log("No existing customers no need to merge....");
			this.customers = customerArray;
			this.setKey(customerKey, this.stringify( this.customers ) );
		}
	}
	GetCustomers(){
		console.log("PosStorage: GetCustomers. Count " + this.customers.length);
		return this.customers;
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


