import * as allActions from './ActionTypes';
import moment from "moment/moment";

export function receiveWaterOperations(data) {
	console.log("receiveWaterOperations - ", data.toString());
	data = updateWaterQualityState(data);
	return {type: allActions.RECEIVE_WATER_OPERATIONS, data};
}

export function initializeWaterOperations() {
	return {
		totalProduction:"N/A",
		sitePressure:"N/A",
		flowRate:"N/A",
		production: createBlankChart(),
		chlorine: createBlankChart(),
		tds: createBlankChart()
	}
}

export function fetchWaterOperations( params ) {
	var urlParms = queryParams(params);
	var url = '/untapped/water-quality?' + urlParms;

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
					dispatch(receiveWaterOperations(response.data))
				}else{
					dispatch(receiveWaterOperations(initializeWaterOperations()))

				}
			})
			.catch(function(error){
				// This means the service isn't running.
				dispatch(receiveWaterOperations(initializeWaterOperations()))
			});
	};
}
var queryParams =(params) => {
	return Object.keys(params)
		.map(k => encodeURIComponent(k) + '=' + encodeURIComponent(params[k]))
		.join('&');
}


var updateWaterQualityState = waterQuality => {

	console.log("updateWaterQualityState");
	let newWaterQuality = {};
	newWaterQuality.flowRate = waterQuality.flowRate;
	newWaterQuality.sitePressure = waterQuality.sitePressure;
	newWaterQuality.totalProduction = waterQuality.totalProduction;
	if( ! waterQuality.hasOwnProperty("production")){
		newWaterQuality.production = createBlankChart();
	}else{
		newWaterQuality.production = {
			labels:waterQuality.production.x_axis,
			datasets: waterQuality.production.datasets
		};
		newWaterQuality.production.datasets[0].backgroundColor = 'rgb(53, 91, 183)';
		newWaterQuality.production.labels = newWaterQuality.production.labels.map(function(time)
		{return moment(time ).format("MMM Do YY")});

		// Create the line series. This needs to be a trend line, dummy for now
		let lineSet = {
			label: "Forecast",
			data: newWaterQuality.production.datasets[0].data.map(function (value) {
				return (value * .8)
			}),
			type: "line",
			borderColor:'rgb(231, 113, 50)',
			backgroundColor:'rgb(231, 113, 50)',
			fill:false,
			pointRadius:0,
			borderWidth:5
		};
		newWaterQuality.production.datasets.unshift(lineSet )
	}
	if( ! waterQuality.hasOwnProperty("chlorine")){
		newWaterQuality.chlorine = createBlankChart();
	}else{
		newWaterQuality.chlorine = {
			labels:waterQuality.chlorine.x_axis,
			datasets: waterQuality.chlorine.datasets
		};
		newWaterQuality.chlorine.datasets[0].backgroundColor='rgb(53, 91, 183)';
		newWaterQuality.chlorine.datasets[0].fill=false;
		newWaterQuality.chlorine.datasets[0].pointRadius=0;
		newWaterQuality.chlorine.datasets[0].borderColor='rgb(53, 91, 183)';
		newWaterQuality.chlorine.labels = newWaterQuality.chlorine.labels.map(function(time)
		{return moment(time ).format("MMM Do YY")});
		createGuide(newWaterQuality.chlorine.datasets, 6.0, "red", "High");
		createGuide(newWaterQuality.chlorine.datasets, 2.0, "yellow", "Low");
		createGuide(newWaterQuality.chlorine.datasets, 4.0, "green", "ideal");
	}
	if( ! waterQuality.hasOwnProperty("tds")){
		newWaterQuality.tds = createBlankChart();
	}else{
		newWaterQuality.tds = {
			labels:waterQuality.tds.x_axis,
			datasets: waterQuality.tds.datasets
		};
		newWaterQuality.tds.datasets[0].backgroundColor='rgb(53, 91, 183)';
		newWaterQuality.tds.datasets[0].fill=false;
		newWaterQuality.tds.datasets[0].pointRadius=0;
		newWaterQuality.tds.datasets[0].borderColor='rgb(53, 91, 183)';
		newWaterQuality.tds.labels = newWaterQuality.tds.labels.map(function(time)
		{return moment(time ).format("MMM Do YY")});
		createGuide(newWaterQuality.tds.datasets, 1200, "red", "Shutdown");
		createGuide(newWaterQuality.tds.datasets, 900, "yellow", "Risk");
		createGuide(newWaterQuality.tds.datasets, 600, "rgb(198,209,232", "Fair");
		createGuide(newWaterQuality.tds.datasets, 300, "green", "Good");
	}

	return newWaterQuality;
};


var createGuide = ( datasets, yValue, color, label) =>{
	let guideData = new Array(datasets[0].data.length);
	guideData.fill( yValue);
	let guide = {
		label: label,
		data: guideData,
		type: "line",
		borderColor:color,
		backgroundColor:color,
		fill:false,
		pointRadius:0,
		borderWidth:2
	};
	datasets.push(guide )

}
var createBlankChart = () => {
	return { labels: [], datasets: [ { label: "", data: [],},]}
};
