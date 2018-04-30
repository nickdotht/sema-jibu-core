import * as allActions from './ActionTypes';

export function receiveSales(data) {
	console.log("receiveSales - ", data.toString());
	return {type: allActions.RECEIVE_SALES, data};
}

export function initializeSales() {
	return {
		loaded:false,
		newCustomers: {period:"N/A", thisPeriod:"N/A", lastPeriod:"N/A"},
		totalRevenue: {total:"N/A", period:"N/A", thisPeriod: "N/A", lastPeriod: "N/A"},
		netIncome: {total:"N/A", period:"N/A", thisPeriod: "N/A", lastPeriod: "N/A"},
		retailSales: [

		],
		totalCustomers:"N/A",
		litersPerCustomer:{period:"N/A", value:"N/A"},
		salesByChannel: createBlankChart()
	}
}

export function fetchSales( params ) {
	const urlParms = queryParams(params);
	const url = '/untapped/sales?' + urlParms;
	return (dispatch) => {
		dispatch(receiveSales(createDummySales()))
	};
	// return (dispatch) => {
	// 	return fetch(url, {credentials: 'include'})
	// 		.then(response =>
	// 			response.json().then(data => ({
	// 				data:data,
	// 				status: response.status
	// 			}))
	// 		)
	// 		.then(response => {
	// 			if(response.status === 200){
	// 				dispatch(receiveSales(response.data))
	// 			}else{
	// 				dispatch(receiveSales(initializeSales()))
    //
	// 			}
	// 		})
	// 		.catch(function(){
	// 			// This means the service isn't running.
	// 			dispatch(receiveSales(initializeSales()))
	// 		});
	// };
}
const queryParams =(params) => {
	return Object.keys(params)
		.map(k => encodeURIComponent(k) + '=' + encodeURIComponent(params[k]))
		.join('&');
};

const createBlankChart = () => {
	return { labels: [], datasets: [ { label: "", data: [],},]}
};


const createDummySales = () => {
	return {
		loaded:true,
		newCustomers: {period:"month", thisPeriod:120, lastPeriod:130},
		totalRevenue: {total:76320, period:"month", thisPeriod: 3000, lastPeriod: 2600},
		netIncome: {total:9123, period:"month", thisPeriod: 1000, lastPeriod: 1600},
		retailSales: [
			{name:"Celine S", id:"abc123", total:9123, period:"month", thisPeriod: 1000, lastPeriod: 1600, gps:"18.59737,-72.32735"},
			{name:"St Piere Tom", id:"def123", total:8233, period:"month", thisPeriod: 1500, lastPeriod: 1400, gps:"18.59537,-72.32335"}

		],

		totalCustomers: 12345,
		litersPerCustomer:{period:"month", value:13.5},
		salesByChannel: createBlankChart()
	}
}
