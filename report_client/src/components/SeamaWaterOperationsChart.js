import React, { Component } from 'react';
import {Bar, Line} from 'react-chartjs-2';

class SeamaWaterOperationsChart extends Component {
    constructor(props, context) {
        super(props, context);
    }
    render() {
        return (<div className = "chart">
                <Bar
                    data={this.props.chartData}
                    height={410}
                    width={200}
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
                            text: 'Production (Gallons)',
                            position:"bottom"
                        }

                    }}
                />
            </div>
        );
    }
}
export default SeamaWaterOperationsChart;
