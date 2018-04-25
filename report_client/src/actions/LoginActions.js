import * as allActions from './ActionTypes';

export function receiveLogin(data) {
	console.log("receiveLogin - ", data.toString())
	return {type: allActions.RECEIVE_LOGIN, LogState: data};
}

export function setLogin( logInState) {
	console.log("setLogin")
	return {type: allActions.SET_LOGIN, LogState: logInState};
}

export function fetchLogin(user, password) {
	// Note user basic authentication for now
	const encodedCredentials = new Buffer(user + ':' + password).toString('base64');
	const authValue = "Basic "+ encodedCredentials;

	return (dispatch) => {
		return fetch('/untapped/login', {headers: new Headers({'Authorization':authValue})})
			.then(response =>
				response.json().then(data => ({
					data:data,
					status: response.status
				}))
			)
			.then(response => {
				if(response.status === 200){
					dispatch(receiveLogin(response.data))
				}else{
					var data = {LogState: "NoService" }
					dispatch(receiveLogin(data))

				}
			})
			.catch(function(error){
				var data = {LogState: "NoService" }
				dispatch(receiveLogin(data))
			});
		;
	};
}

