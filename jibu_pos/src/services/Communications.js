import React from 'react';

export default class Communications {
	constructor( url, site, user, password ){
		this._url = url;
		this._site = site;
		this._user = user;
		this._password= password;

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
};
