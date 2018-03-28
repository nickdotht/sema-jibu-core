import React, { Component } from 'react';
import {Bar, Line} from 'react-chartjs-2';

class SeamaWaterOperationsChart extends Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            chartData:{
                labels:[ "red", "green", "blue", "black"],
                datasets:[
                    {
                        label: "Color",
                        data:[100, 200, 300, 250, 120, 400]
                    },
                ],
                backgroundColor :['rgb(200, 200, 250)'],

            }
        }
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

                        }

                    }}
                />
            </div>
        );
    }
}
export default SeamaWaterOperationsChart;
