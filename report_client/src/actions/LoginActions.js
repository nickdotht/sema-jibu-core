import * as allActions from './ActionTypes';
import { loginService } from '../services';

export const receiveLogin = data => {
	console.log(`receiveLogin - ${JSON.stringify(data)}`);
	return {type: allActions.RECEIVE_LOGIN, logState: data};
}

export const fetchLogin = () => {
	console.log('fetchLogin - loading');
	return {type: allActions.FETCH_LOGIN, logState: 'loading'};
};

export function login(usernameOrEmail, password) {
	return dispatch => {
		dispatch(fetchLogin());

		loginService.login(usernameOrEmail, password)
			.then(response => {
				if (response.status === 200) {
					dispatch(receiveLogin(response.data))
				} else {
					const data = { logState: "NoService" };
					dispatch(receiveLogin(data))
				}
			})
			.catch(function(error){
				const data = { logState: "NoService" };
				dispatch(receiveLogin(data))
			});
	};
}

