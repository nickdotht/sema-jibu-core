import * as allActions from './ActionTypes';
import { axiosService } from 'services';

function receiveSales(data) {
	console.log("receiveSales - ", data.toString());
	data = updateSales(data);
	return {type: allActions.RECEIVE_SALES, data};
}

function receiveSalesByChannel(data) {
	console.log("receiveSales - ", data.toString());
	return {type: allActions.RECEIVE_SALES_BY_CHANNEL, data};
}

function initializeSales() {
	return {
		loaded:false,
		salesInfo: {
			newCustomers: {period: null, periods: PeriodData.init3Periods()},
			totalRevenue: {total: null, period: null, periods: PeriodData.init3Periods()},
			netIncome: {total: null, period: null, periods: PeriodData.init3Periods()},
			retailSales: [],
			totalCustomers: null,
			gallonsPerCustomer: {period: null, value: null},
			salesByChannel: {beginDate: null, endDate: null, datasets: []}
		}
	}
}

function fetchSales( params ) {
	let startEndDate = getStartEndDates( params );
	if( startEndDate ){
		params.firstdate=startEndDate[0];
		params.lastdate=startEndDate[1];
	}
	return (dispatch) => {
		return axiosService.get('/untapped/sales', { params })
			.then(response => {
				if(response.status === 200){
					dispatch(receiveSales(response.data));
					// return axiosService.get('/untapped/sales-by-channel', { params })
					// 	.then(response => {
					// 		if(response.status === 200){
					// 			formatChartData(response.data);
					// 			dispatch(receiveSalesByChannel(response.data));
					// 		}else{
					// 			dispatch(receiveSalesByChannel( createBlankChart()));
					// 		}
					// 	})
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
};
const colors = [
	"rgb(0, 179, 0)",
	"rgb(0, 0, 230)",
	"rgb(204, 0, 0)",
	"rgb(230, 138, 0)",
	"rgb(230, 230, 0)",
	"rgb(230, 0, 230)",
	"rgb(0, 179, 179)"
];

// const formatChartData = (chartData) =>{
// 	chartData.salesByChannel.datasets.forEach( (dataSet, index) => {
// 		dataSet.pointRadius = 0;
// 		// dataSet.cubicInterpolationMode = "monotone";
// 		dataSet.borderColor=colors[index];
// 		dataSet.borderWidth=2;
// 		dataSet.type = "line";
// 		dataSet.lineTension = 0;
// 		// chartData.salesByChannel.datasets[index].data = dataSet.data.map( item =>{
// 		// 	return {x:moment(item.x).format("MMM Do YY"), y:item.y}
// 		// })
// 	});
// };

function forceUpdate() {
	console.log("forceUpdate - ");
	return {type: allActions.FORCE_SALES_UPDATE};
}

const createBlankChart = () => {
	return { labels: [], datasets: [ { label: "", data: [],},]}
};



class PeriodData {
	constructor() {
		this.beginDate = null;
		this.endDate = null;
		this.periodValue = null;
	}

	setValue(periodValue) {
		this.periodValue = periodValue;
	}

	setDates(beginDate, endDate) {
		this.endDate = endDate;
		this.beginDate = beginDate;

	}

	static init3Periods() {
		return [new PeriodData(), new PeriodData(), new PeriodData()];
	}
};

const updateSales = salesData => {
	return {
		loaded:true,
		salesInfo: salesData.salesInfo
	}
};

export const salesActions = {
	receiveSales,
	receiveSalesByChannel,
	initializeSales,
	fetchSales,
	forceUpdate
};
