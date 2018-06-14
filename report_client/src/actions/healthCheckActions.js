import { RECEIVE_HEALTHCHECK } from 'actions';

const receiveHealthCheck = data => {
	console.log("receiveHealthCheck - ", data.toString())
	return {type: RECEIVE_HEALTHCHECK, healthCheck: data};
}

export const fetchHealthCheck = () => {
	return (dispatch) => {
		fetch('/untapped/health-check')
			.then(response =>
				response.json().then(data => ({
					data:data,
					status: response.status
				}))
			)
			.then(response => {
				if(response.status === 200){
					dispatch(receiveHealthCheck(response.data))
				}else{
					var data = {server: "failed", database: "n/a"};
					dispatch(receiveHealthCheck(data))
				}
			})
			.catch(function(error){
				// This means the service isn't running.
				var data = {server: "failed", database: "n/a"};
				dispatch(receiveHealthCheck(data))
			});
		;
	};
}

