import React, { Component } from 'react';
import {Line} from 'react-chartjs-2';
import moment from "moment/moment";

var s1 = {
	label: 's1',
	borderColor: 'blue',
	data: [
		{ x: '2017-01-06 18:39:30', y: 200 },
		{ x: '2017-01-07 18:39:28', y: 201 },
		{ x: '2017-01-08 8:39:28', y: 203 },
	]
};

var s2 = {
	label: 's2',
	borderColor: 'red',
	data: [
		{ x: '2017-01-07 18:00:00', y: 90 },
		{ x: '2017-01-08 18:00:00', y: 105 },
		{ x: '2017-01-08 18:39:28', y: 120 },
	]
};

class SalesByChannelChart extends Component {

    render() {
        return (<div className = "chart">
                <Line
                    data={this.props.chartData}
                    // data = {{ datasets: [s1, s2] }}
                    height={300}
                    width={200}
                    options={{
                        maintainAspectRatio: false,
                        scales: {
                            yAxes: [{
                                ticks: {
                                    beginAtZero:true,
                                }
                            }],
                            // xAxes: [{
								// type: 'time',
                            //     displayFormats: {
                            //         day: 'MMM D'
                            //     },
								// time: {
								// 	unit: 'day'
								// }
                            // }]
							xAxes: [{
								type: 'time',
								time: {
									unit: 'month',
									displayFormats: {
										day: 'MMM D'
									},
									min: this.calcMinDate()
								}
							}]
                        },
                        title: {
                            display: true,
                            text: 'Sales By Channel',
                            position:"bottom"
                        }
                    }}
                />
            </div>
        );
    }
    calcMinDate= ()=>{
    	let minDate = '2017-01-01T12:00:00.000Z';
    	let first = true;
    	let firstDate = null;
    	if( this.props.chartData && this.props.chartData.datasets){
			this.props.chartData.datasets.forEach( dataset => {
				if( dataset.data.length > 0 ) {	// The first point in the chart
					let nextDate = new Date(Date.parse(dataset.data[0].x))
					if( first ){
						firstDate = nextDate;
						first = false;
					} else{
						if( nextDate.getTime() < firstDate.getTime()){
							firstDate = nextDate;
						}
					}
				}
			})
			if( firstDate){
				minDate = firstDate.toISOString();
			}
		}
    	return minDate;
	}
}
export default SalesByChannelChart;
