import React, { Component } from 'react';
import {Line} from 'react-chartjs-2';

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
									min: '2017-10-01'
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
    	return '2017-01-01';
	}
}
export default SalesByChannelChart;
