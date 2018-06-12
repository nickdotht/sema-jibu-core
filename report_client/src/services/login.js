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
		response.json().then(data => ({
			data: data,
			status: response.status
		}))
	);

export const loginService = {
	login
};
