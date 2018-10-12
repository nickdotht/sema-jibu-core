import React, { Component } from 'react';
import {Bar} from 'react-chartjs-2';
import moment from "moment/moment";
import { utilService } from 'services';
import 'css/SemaChart.css';


class SemaProductionChart extends Component {

    render() {
		if( ! utilService.isEmptyObject(this.props.chartData) ) {
			return (
				<div className="ChartContainer">
					<div className="chart" style={{backgroundColor: 'white', margin: "2px"}}>
						<Bar
							data={this.getChartData(this.props.chartData)}
							height={410}
							width={800}
							options={{
								maintainAspectRatio: false,
								scales: {
									yAxes: [{
										ticks: {
											beginAtZero:true
										}
									}],
									xAxes: [{
										displayFormats: {
											day: 'MMM D'
										}
									}]

								},
								title: {
									display: true,
									text: this.getChartTitle(this.props.chartData),
									position:"top"
								}

							}}
						/>

					</div>
				</div>
			);
		}else{
			return  (<div style={{textAlign:"center"}}>
					Water Production
					<br/>
					No Data available
				</div>
			);

		}
    }
    getChartTitle(productionData){
    	return "Production (liters)";

	}
    getChartData( productionData ){
    	if( utilService.isEmptyObject(productionData) || utilService.isEmptyObject(productionData.data )){
			return { labels: [], datasets: []}
		}else{
			let production = {
				labels:productionData.data.time,
				datasets: [{label: 'Water Production', data: productionData.data.values.map( value =>Math.round(value))}]
			};
			production.datasets[0].backgroundColor='rgb(53, 91, 183)';
			production.datasets[0].borderColor='rgb(53, 91, 183)';
			production.labels = production.labels.map(function(time)
				{return moment(time ).format("MMM Do YY")});
			let lineSet = {
				label: "Forecast",
				data: productionData.data.values.map(function (value) {
					return (value * .8)
				}),
				type: "line",
				borderColor:'rgb(231, 113, 50)',
				backgroundColor:'rgb(231, 113, 50)',
				fill:false,
				pointRadius:0,
				borderWidth:5
			};
			production.datasets.unshift(lineSet );

			return production;
		}
	}
}

export default SemaProductionChart;


