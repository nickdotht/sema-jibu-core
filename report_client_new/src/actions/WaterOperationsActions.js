import * as allActions from './ActionTypes';
import moment from "moment/moment";
import { axiosService } from 'services';

function receiveWaterOperations(data) {
	console.log("receiveWaterOperations ");
	updateWaterOperations(data);
	return {type: allActions.RECEIVE_WATER_OPERATIONS, data};
}

function initializeWaterOperations() {
	return {
		loaded:false,
		waterOperationsInfo :{
			beginDate:null,
			endDate:null,
			waterMeasureUnits: 'liters',
			totalProduction: null,
			fillStation: 95,
			pressurePreMembrane: 110,
			pressurePostMembrane: 105,
			flowRateProduct: 82,
			flowRateSource: 81,
			flowRateDistribution: 83,
			production: {},
			chlorine: {},
			tds: {}
		}
	}
}

function fetchWaterOperations(params) {
	return (dispatch) => {
		return fetchWaterOperationsData(params)
			.then(waterInfo => {
				dispatch(receiveWaterOperations(waterInfo));
			});
	};
}

const fetchWaterOperationsData = ( params) => {
	return new Promise(async (resolve, reject) => {
		let waterInfo = initializeWaterOperations();
		waterInfo.waterOperationsInfo.beginDate = params.startDate;
		waterInfo.waterOperationsInfo.endDate = params.endDate;
		try {
			window.dispatchEvent(new CustomEvent("progressEvent", {detail: {progressPct:0}} ));
			let production = Object.assign({}, params);
			production.type = "production";
			waterInfo.waterOperationsInfo.production = await fetchChart(production );
			window.dispatchEvent(new CustomEvent("progressEvent", {detail: {progressPct:33}} ));

			let chlorine = Object.assign({}, params);
			chlorine.type = "totalchlorine";
			waterInfo.waterOperationsInfo.chlorine = await fetchChart(chlorine );
			window.dispatchEvent(new CustomEvent("progressEvent", {detail: {progressPct:66}} ));

			let tds = Object.assign({}, params);
			tds.type = "tds";
			waterInfo.waterOperationsInfo.tds = await fetchChart(tds );
			window.dispatchEvent(new CustomEvent("progressEvent", {detail: {progressPct:100}} ));

			resolve(waterInfo);
		} catch (error) {
			console.log("fetchWaterOperationsData - Failed ");
			resolve(waterInfo);

		}
	});
}

function fetchChart( params ) {
	return new Promise((resolve, reject ) => {
		let url = '/sema/dashboard/site/water-chart?site-id=' + params.kioskID ;
		if( params.hasOwnProperty("startDate") ){
			url = url + "&begin-date=" + params.startDate.toISOString();
		}
		if( params.hasOwnProperty("endDate") ){
			url = url + "&end-date=" + params.endDate.toISOString();
		}
		if( params.hasOwnProperty("type") ){
			url = url + "&type=" + params.type;
		}

		axiosService
			.get(url)
			.then(response => {
				if(response.status === 200){
					resolve(response.data)
				}else{
					reject(initializeWaterOperations())
				}
			})
			.catch(function(error){
				reject( error)
			});
	});
}
const updateWaterOperations = waterData => {
	waterData.loaded = true;
};



// const updateWaterQualityState = waterQuality => {
//
// 	console.log("updateWaterQualityState");
// 	let newWaterQuality = {};
// 	newWaterQuality.loaded =true;
//
// 	newWaterQuality.totalProduction = waterQuality.totalProduction;
// 	newWaterQuality.fillStation = waterQuality.fillStation;
// 	newWaterQuality.sitePressureIn = waterQuality.sitePressureIn;
// 	newWaterQuality.sitePressureOut = waterQuality.sitePressureOut;
// 	newWaterQuality.sitePressureMembrane = waterQuality.sitePressureMembrane;
// 	newWaterQuality.flowRateFeed = waterQuality.flowRateFeed;
// 	newWaterQuality.flowRateProduct = waterQuality.flowRateProduct;
//
// 	if( waterQuality.production.datasets.length === 0 ){
// 		newWaterQuality.production = createBlankChart();
// 	}else{
// 		newWaterQuality.production = {
// 			labels:waterQuality.production.x_axis,
// 			datasets: waterQuality.production.datasets
// 		};
// 		newWaterQuality.production.datasets[0].backgroundColor = 'rgb(53, 91, 183)';
// 		newWaterQuality.production.labels = newWaterQuality.production.labels.map(function(time)
// 		{return moment(time ).format("MMM Do YY")});
//
// 		// Create the line series. This needs to be a trend line, dummy for now
// 		let lineSet = {
// 			label: "Forecast",
// 			data: newWaterQuality.production.datasets[0].data.map(function (value) {
// 				return (value * .8)
// 			}),
// 			type: "line",
// 			borderColor:'rgb(231, 113, 50)',
// 			backgroundColor:'rgb(231, 113, 50)',
// 			fill:false,
// 			pointRadius:0,
// 			borderWidth:5
// 		};
// 		newWaterQuality.production.datasets.unshift(lineSet )
// 	}
// 	if( waterQuality.chlorine.datasets.length === 0){
// 		newWaterQuality.chlorine = createBlankChart();
// 	}else{
// 		newWaterQuality.chlorine = {
// 			labels:waterQuality.chlorine.x_axis,
// 			datasets: waterQuality.chlorine.datasets
// 		};
// 		newWaterQuality.chlorine.datasets[0].backgroundColor='rgb(53, 91, 183)';
// 		newWaterQuality.chlorine.datasets[0].fill=false;
// 		newWaterQuality.chlorine.datasets[0].pointRadius=0;
// 		newWaterQuality.chlorine.datasets[0].borderColor='rgb(53, 91, 183)';
// 		newWaterQuality.chlorine.labels = newWaterQuality.chlorine.labels.map(function(time)
// 		{return moment(time ).format("MMM Do YY")});
// 		createGuide(newWaterQuality.chlorine.datasets, 0.9, "red", "High");
// 		createGuide(newWaterQuality.chlorine.datasets, 0.4, "yellow", "Low");
// 		createGuide(newWaterQuality.chlorine.datasets, 0.6, "green", "ideal");
// 	}
// 	if( waterQuality.tds.datasets.length === 0){
// 		newWaterQuality.tds = createBlankChart();
// 	}else{
// 		newWaterQuality.tds = {
// 			labels:waterQuality.tds.x_axis,
// 			datasets: waterQuality.tds.datasets
// 		};
// 		newWaterQuality.tds.datasets[0].backgroundColor='rgb(53, 91, 183)';
// 		newWaterQuality.tds.datasets[0].fill=false;
// 		newWaterQuality.tds.datasets[0].pointRadius=0;
// 		newWaterQuality.tds.datasets[0].borderColor='rgb(53, 91, 183)';
// 		newWaterQuality.tds.labels = newWaterQuality.tds.labels.map(function(time)
// 		{return moment(time ).format("MMM Do YY")});
// 		createGuide(newWaterQuality.tds.datasets, 150, "red", "Shutdown");
// 		createGuide(newWaterQuality.tds.datasets, 70, "yellow", "Risk");
// 		createGuide(newWaterQuality.tds.datasets, 110, "rgb(198,209,232", "Fair");
// 		createGuide(newWaterQuality.tds.datasets, 30, "green", "Good");
// 	}
//
// 	return newWaterQuality;
// };
// const createGuide = ( datasets, yValue, color, label) =>{
// 	let guideData = new Array(datasets[0].data.length);
// 	guideData.fill( yValue);
// 	let guide = {
// 		label: label,
// 		data: guideData,
// 		type: "line",
// 		borderColor:color,
// 		backgroundColor:color,
// 		fill:false,
// 		pointRadius:0,
// 		borderWidth:2
// 	};
// 	datasets.push(guide )
//
// };

const createBlankChart = () => {
	return { x_axis: [], datasets: []}
};

export const waterOperationsActions = {
	receiveWaterOperations,
	initializeWaterOperations,
	fetchWaterOperations
};
