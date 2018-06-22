import React from 'react';

export default class Communications {
	constructor( url, site, user, password ){
		this._url = url;
		this._site = site;
		this._user = user;
		this._password= password;

	}
	// login() {
	// 	console.log("logging into " + this._url + '/untapped/login');
	// 	return new Promise( (resolve, reject) =>{
	// 		try {
	// 			fetch(this._url + 'untapped/login', {
	// 				method: 'POST',
	// 				headers: {
	// 					Accept: 'application/json',
	// 					'Content-Type': 'application/json',
	// 				},
	// 				body: JSON.stringify({
	// 					usernameOrEmail: this._user,
	// 					password: this._password,
	// 				}),
	// 			})
	// 				.then((response) => response.json())
	// 				.then((responseJson) => {
	// 					resolve(responseJson);
	// 				})
	// 				.catch((error) => {
	// 					console.log(error);
	// 					reject(error);
	// 				});
	// 		}catch( error ){
	// 			reject(error);
	// 		}
	// 	})console.log(  JSON.stringify(response));
	// }
	login(){
		var foo = null;
		return fetch('http://facebook.github.io/react-native/movies.json')
			.then((response) => response.json())
			.then((responseJson) => {
				console.log(">>>>>>" + JSON.stringify(responseJson));
				return [response, responseJson];
			})

			.catch((error) => {
				console.log("=======================================================" + JSON.stringify(error));
				return error;
			});
	}
	login2(){
		return new Promise( (resolve, reject ) => {
			fetch(this._url + 'untapped/login')
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
					reject({status:418, response:error});	// This is the I'm a teapot error
				});
		})
	}
};
