import * as allActions from './ActionTypes';

export function receiveSales(data) {
	console.log("receiveSales - ", data.toString());
	return {type: allActions.RECEIVE_SALES, data};
}

export function initializeSales() {
	return {
		totalProduction:"N/A",
		sitePressure:"N/A",
		flowRate:"N/A",
		production: createBlankChart(),
		chlorine: createBlankChart(),
		tds: createBlankChart()
	}
}

export function fetchSales( params ) {
	const urlParms = queryParams(params);
	const url = '/untapped/sales?' + urlParms;

	return (dispatch) => {
		return fetch(url, {credentials: 'include'})
			.then(response =>
				response.json().then(data => ({
					data:data,
					status: response.status
				}))
			)
			.then(response => {
				if(response.status === 200){
					dispatch(receiveSales(response.data))
				}else{
					dispatch(receiveSales(initializeSales()))

				}
			})
			.catch(function(){
				// This means the service isn't running.
				dispatch(receiveSales(initializeSales()))
			});
	};
}
const queryParams =(params) => {
	return Object.keys(params)
		.map(k => encodeURIComponent(k) + '=' + encodeURIComponent(params[k]))
		.join('&');
};

const createBlankChart = () => {
	return { labels: [], datasets: [ { label: "", data: [],},]}
};

