import * as allActions from './ActionTypes';
import moment from "moment/moment";

export function receiveSales(data) {
	console.log("receiveSales - ", data.toString());
	return {type: allActions.RECEIVE_SALES, data};
}

export function receiveSalesByChannel(data) {
	console.log("receiveSales - ", data.toString());
	return {type: allActions.RECEIVE_SALES_BY_CHANNEL, data};
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
	// TODO - May want to fix up how period is passed
	let startEndDate = getStartEndDates( params );
	if( startEndDate ){
		params.firstdate=startEndDate[0];
		params.lastdate=startEndDate[1];
	}
	const urlParms = queryParams(params);
	const url = '/untapped/sales?' + urlParms;
	// return (dispatch) => {
	// 	dispatch(receiveSales(createDummySales()))
	// };
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
					dispatch(receiveSales(response.data));
					var salesByChannelUrl = '/untapped/sales-by-channel?' + urlParms;
					return fetch(salesByChannelUrl, {credentials: 'include'})
						.then(response =>
							response.json().then(data => ({
								data:data,
								status: response.status
							}))
						)
						.then(response => {
							if(response.status === 200){
								formatChartData(response.data);
								dispatch(receiveSalesByChannel(response.data));
							}else{
								dispatch(receiveSalesByChannel( createBlankChart()));
							}
						})
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
const getStartEndDates = parms =>{
	if( parms.hasOwnProperty("period")){
		switch( parms.period ){
			case "month":		// Last 30 days...
				let now = Date.now();
				let lastDate = new Date(now + (24 *60 *60 *1000));	// Round to next day..
				lastDate = new Date( lastDate.getFullYear(),lastDate.getMonth(), lastDate.getDate() );
				let firstDate = new Date( lastDate.getTime() - (30*24 *60 *60 *1000) );
				return [firstDate, lastDate];
			default:
				break;
		}
	}
	return null;
}
const colors = [
	"rgb(0, 179, 0)",
	"rgb(0, 0, 230)",
	"rgb(204, 0, 0)",
	"rgb(230, 138, 0)",
	"rgb(230, 230, 0)",
	"rgb(230, 0, 230)",
	"rgb(0, 179, 179)"
];

const formatChartData = (chartData) =>{
	chartData.salesByChannel.datasets.forEach( (dataSet, index) => {
		dataSet.pointRadius = 0;
		// dataSet.cubicInterpolationMode = "monotone";
		dataSet.borderColor=colors[index];
		dataSet.borderWidth=2;
		dataSet.type = "line";
		dataSet.lineTension = 0;
		// chartData.salesByChannel.datasets[index].data = dataSet.data.map( item =>{
		// 	return {x:moment(item.x).format("MMM Do YY"), y:item.y}
		// })
	});
}

export function forceUpdate() {
	console.log("forceUpdate - ");
	return {type: allActions.FORCE_SALES_UPDATE};
}

const queryParams =(params) => {
	return Object.keys(params)
		.map(k => encodeURIComponent(k) + '=' + encodeURIComponent(params[k]))
		.join('&');
};

const createBlankChart = () => {
	return { labels: [], datasets: [ { label: "", data: [],},]}
};


// const createDummySales = () => {
// 	return {
// 		loaded:true,
// 		newCustomers: {period:"month", thisPeriod:120, lastPeriod:130},
// 		totalRevenue: {total:76320, period:"month", thisPeriod: 3000, lastPeriod: 2600},
// 		netIncome: {total:9123, period:"month", thisPeriod: 1000, lastPeriod: 1600},
// 		retailSales: [
// 			{name:"Celine S", id:"abc123", total:9123, period:"month", thisPeriod: 1000, lastPeriod: 1600, gps:"18.59737,-72.32735"},
// 			{name:"St Piere Tom", id:"def123", total:8233, period:"month", thisPeriod: 1500, lastPeriod: 1400, gps:"18.6035165,-72.2583092"},
// 			{name:"Stevenson M", id:"defd123", total:6233, period:"month", thisPeriod: 1300, lastPeriod: 1100, gps:"18.82680, -72.55183"},
// 			{name:"Ysmail Millien", id:"defd123", total:5300, period:"month", thisPeriod: 900, lastPeriod: 10000, gps:"18.72928,-72.41854"}
//
// 		],
//
// 		totalCustomers: 12345,
// 		litersPerCustomer:{period:"month", value:13.5},
// 		salesByChannel: createBlankChart()
// 	}
// };
