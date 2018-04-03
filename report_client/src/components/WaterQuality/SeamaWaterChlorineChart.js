import React, { Component } from 'react';
import {Line} from 'react-chartjs-2';

class SeamaWaterChlorineChart extends Component {

    render() {
        return (<div className = "chart">
                <Line
                    data={this.props.chartData}
                    height="300"
                    width="400"
                    options={{
                        maintainAspectRatio: false,
                        scales: {
                            yAxes: [{
                                ticks: {
                                    beginAtZero:true,
                                    max:7.0
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
                            text: 'Chlorine Level (PPM)',
                            position:"bottom"
                        }

                    }}
                />
            </div>
        );
    }
}
export default SeamaWaterChlorineChart;
