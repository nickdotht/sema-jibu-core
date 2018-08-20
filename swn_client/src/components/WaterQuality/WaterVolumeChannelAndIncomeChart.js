import React, { Component } from 'react';
import {Bar, HorizontalBar} from 'react-chartjs-2';

class WaterVolumeChannelAndIncomeChart extends Component {
    render() {
        return (<div className = "chart">
                <HorizontalBar
					data = {{
					labels: ["$8< per day", "$8<$5 per day", "$5<$2 per day", "<$2 per day"],
					datasets: [
				{
					label: "Household",
					backgroundColor: "rgba(99,255,132,0.2)",
					data: [59, 80, 81, 56],
					stack: 1
				},
				{
					label: "Main Station",
					backgroundColor: "rgba(99,132,255,0.2)",
					data: [80, 81, 56, 55],
					stack: 1
				},
				{
					label: "Access Points",
					backgroundColor: "rgba(255,99,132,0.2)",
					data: [60, 59, 80, 81],
					stack: 1
				}
					]
				}}
                    height={300}
                    width={500}
                    options={{
                        maintainAspectRatio: false,
						scales: {
							xAxes: [{ stacked: true }],
						},
                        title: {
                            display: true,
                            text: 'Liters by Channel and Income',
                            position:"top"
                        }

                    }}
                />
            </div>
        );
    }
}
export default WaterVolumeChannelAndIncomeChart;
