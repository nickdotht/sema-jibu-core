import React, { Component } from 'react';
import {Line} from 'react-chartjs-2';

class SalesByChannelChart extends Component {

    render() {
        return (<div className = "chart">
                <Line
                    data={this.props.chartData}
                    height={300}
                    width={200}
                    options={{
                        maintainAspectRatio: false,
                        scales: {
                            yAxes: [{
                                ticks: {
                                    beginAtZero:true,
									max: 1000,
									stepSize: 200,
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
                            text: 'Sales By Channel',
                            position:"bottom"
                        }
                    }}
                />
            </div>
        );
    }
}
export default SalesByChannelChart;
