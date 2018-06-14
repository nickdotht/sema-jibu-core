import jwt from 'jsonwebtoken';
import { handleResponse } from './';

const login = (usernameOrEmail, password) =>
	fetch('/untapped/login', {
		headers: {
		  'Accept': 'application/json',
		  'Content-Type': 'application/json'
		},
		body: JSON.stringify({ usernameOrEmail , password }),
		method: 'post'
	})
	.then(response =>
		response.json().then(data => {
			return {
				data,
				status: response.status
			};
		})
	)
	.then(response => {
		if (response.data.token) {
			const user = jwt.decode(response.data.token);

			localStorage.setItem('currentUser', JSON.stringify(user));
		}

		return response;
	});

const logout = () => {
	localStorage.removeItem('currentUser');
};

export const authService = {
	login,
	logout
};
