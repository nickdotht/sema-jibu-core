import * as allActions from './ActionTypes';

export function receiveKiosks(data) {
	console.log("receiveSeamaKiosks - ", data.toString())
	return {type: allActions.RECEIVE_KIOSKS, kiosks: data};
}


export function fetchKiosks() {
	return (dispatch) => {
		return fetch('/untapped/kiosks', {credentials: 'include'})
			.then(response =>
				response.json().then(data => ({
					data:data,
					status: response.status
				}))
			)
			.then(response => {
				if(response.status === 200){
					dispatch(receiveKiosks(response.data))
				}else{
					dispatch(receiveKiosks({kiosks: []}))

				}
			})
			.catch(function(error){
				// This means the service isn't running.
				dispatch(receiveKiosks({kiosks: []}))
			});
		;
	};
}

