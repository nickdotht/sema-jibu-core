import * as allActions from './ActionTypes';
import { loginService } from '../services';

export const receiveLogin = data => {
	console.log(`receiveLogin - ${JSON.stringify(data)}`);
	return {type: allActions.RECEIVE_LOGIN, data};
}

export const fetchLogin = data => {
	console.log(`fetchLogin - ${JSON.stringify(data)}`);
	return {type: allActions.FETCH_LOGIN, data};
};

export function login(usernameOrEmail, password) {
	return dispatch => {
		dispatch(fetchLogin({ logState: 'loading' }));

		loginService.login(usernameOrEmail, password)
			.then(response => {
				if (response.status === 200) {
					const data = {...response.data, logState: 'success' };
					dispatch(receiveLogin(data))
				} else if (response.status === 401) {
					const data = { logState: "badCredentials" };
					dispatch(receiveLogin(data))
				} else {
					const data = { logState: "noService" };
					dispatch(receiveLogin(data))
				}
			})
			.catch(function(error){
				const data = { logState: "noService" };
				dispatch(receiveLogin(data))
			});
	};
}

