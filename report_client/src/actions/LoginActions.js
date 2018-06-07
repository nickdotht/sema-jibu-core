import * as allActions from './ActionTypes';

export function receiveLogin(data) {
	console.log("receiveLogin - ", data.toString())
	return {type: allActions.RECEIVE_LOGIN, LogState: data};
}

export function setLogin( logInState) {
	console.log("setLogin")
	return {type: allActions.SET_LOGIN, LogState: logInState};
}

export function fetchLogin(usernameOrEmail, password) {
	return (dispatch) => {
		return fetch('/untapped/login', {
			headers: {
			  'Accept': 'application/json',
			  'Content-Type': 'application/json'
			},
			body: JSON.stringify({ usernameOrEmail , password }),
			method: 'post'
		})
		.then(response =>
			response.json().then(data => ({
				data:data,
				status: response.status
			}))
		)
		.then(response => {
			if (response.status === 200) {
				dispatch(receiveLogin(response.data))
			} else {
				const data = {LogState: "NoService" }
				dispatch(receiveLogin(data))
			}
		})
		.catch(function(error){
			var data = {LogState: "NoService" }
			dispatch(receiveLogin(data))
		});
	};
}

