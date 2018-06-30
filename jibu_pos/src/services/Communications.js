import React from 'react';

class Communications {
	constructor(  ){
		this._url = "";
		this._site = "";
		this._user = "";
		this._password= "";
		this._token = "";
		this._siteId ="";
	}
	initialize( url, site, user, password){
		if( ! url.endsWith('/')){
			url = url + '/';
		}
		this._url = url;
		this._site = site;
		this._user = user;
		this._password= password;
		this._token = "not set";
	}
	setToken( token ){
		this._token = token;
	}
	setSiteId( siteId ){
		this._siteId = siteId;
	}
	login(){
		let options = {
			method: 'POST',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				usernameOrEmail: this._user,
				password: this._password,
			}),
		}

		return new Promise( (resolve, reject ) => {
			fetch(this._url + 'untapped/login', options)
				.then((response) => {
					console.log( response.status);
					response.json()
						.then((responseJson) => {
							resolve({status:response.status, response:responseJson});
						})
						.catch( (error )=>{
							console.log(error + " INNER " + JSON.stringify(error));
							reject({status:response.status, response:error});
						})
				})
				.catch((error) => {
					console.log(error + " OUTER " + JSON.stringify(error));
					reject({status:418, response:error});	// This is the "I'm a teapot error"
				});
		})
	}
	getSiteId( token, siteName){
		let options = {
			method: 'GET',
			headers: {
				Authorization : 'Bearer ' + token
			},
		}

		return new Promise( (resolve, reject ) => {
			fetch(this._url + 'untapped/kiosks', options)
				.then((response) => {
					console.log( response.status);
					response.json()
						.then((responseJson) => {
							let result = -1;
							for( let i = 0; i < responseJson.kiosks.length; i++){
								if( responseJson.kiosks[i].name === siteName ){
									result = responseJson.kiosks[i].id;
									break;
								}
							}
							resolve(result);
						})
						.catch( (error )=>{
							resolve(-1);
						})
				})
				.catch((error) => {
					resolve(-1);
				});
		})

	}
	getCustomers() {
		let options = {
			method: 'GET',
			headers: { Authorization: 'Bearer ' + this._token }
		}
		return fetch(this._url + 'sema/site/customers?site-id=' + this._siteId, options)
			.then((response) => response.json())
			.then((responseJson) => {
				return responseJson
			})
			.catch((error) => {
				console.log("Communications:getCustomers: " + error);
				return {}
			});
	}

	createCustomer( customer ) {
		let options = {
			method: 'POST',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
				Authorization: 'Bearer ' + this._token
			},
			body: JSON.stringify(customer )

		}
		return new Promise( (resolve, reject ) => {
			fetch(this._url + 'sema/site/customers', options)
				.then((response) => {
					if (response.status === 200) {
						response.json()
							.then((responseJson) => {
								resolve(responseJson)
							})
							.catch((error) => {
								console.log("createCustomer - Parse JSON: " + error.message);
								reject();
							});
					}else {
						console.log("createCustomer - Fetch status: " + response.status);
						reject();
					}
				})
				.catch((error) => {
					console.log("createCustomer - Fetch: " + error.message);
					reject();
				});
		});
	}
	deleteCustomer( customer ) {
		let options = {
			method: 'DELETE',
			headers: {
				Authorization: 'Bearer ' + this._token
			},
		}
		return new Promise( (resolve, reject ) => {
			fetch(this._url + 'sema/site/customers/' + customer.customerId, options)
				.then((response) => {
					if (response.status === 200) {
						resolve();
					}else {
						console.log("createCustomer - Fetch status: " + response.status);
						reject();
					}
				})
				.catch((error) => {
					console.log("createCustomer - Fetch: " + error.message);
					reject();
				});
		});
	}

};
export default new Communications();
