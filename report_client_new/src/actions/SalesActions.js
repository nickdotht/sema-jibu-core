import * as allActions from './ActionTypes';
import { axiosService } from 'services';

function receiveSales(data) {
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
			beginDate:null,
			endDate:null,
			totalRevenue : {total: null, period: null, periods: PeriodData.init3Periods()},
			totalCustomers: {total: null, period: null, periods: PeriodData.init3Periods()},
			customerSales:[],
			salesByChannel: {beginDate: null, endDate: null, datasets: []}
		}
	}
}

function fetchSales(params) {
	return (dispatch) => {
		return fetchSalesData(params)
			.then(salesInfo => {
				dispatch(receiveSales(salesInfo));
			});
	};
}


function fetchSalesData( params ) {
	return new Promise((resolve, reject ) => {
		let url = '/sema/dashboard/site/sales-summary?site-id=' + params.kioskID ;
		if( params.hasOwnProperty("startDate") ){
			url = url + "&begin-date=" + params.startDate.toISOString();
		}
		if( params.hasOwnProperty("endDate") ){
			url = url + "&end-date=" + params.endDate.toISOString();
		}
		if( params.hasOwnProperty("groupBy") ){
			url = url + "&group-by=" + params.groupBy;
		}

		axiosService
		.get(url)
		.then(response => {
			if(response.status === 200){
				resolve(response.data)
			}else{
				reject(initializeSales())
			}
		})
		.catch(function(error){
			reject( error)
		});
	});
}



function forceUpdate() {
	console.log("forceUpdate - ");
	return {type: allActions.FORCE_SALES_UPDATE};
}


class PeriodData {
	constructor() {
		this.beginDate = null;
		this.endDate = null;
		this.value = null;
	}

	setValue(value) {
		this.value = value;
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
		salesInfo: salesData
	}
};

export const salesActions = {
	receiveSales,
	receiveSalesByChannel,
	initializeSales,
	fetchSales,
	forceUpdate
};
