import React, { Component } from 'react';
import {Doughnut} from 'react-chartjs-2';

class WaterVolumeChannelChart extends Component {
    render() {
        return (<div className = "chart">
                <Doughnut
					data = {this.getVolumeData()}
					// data = {{
					// labels: ["Walkup", "Reseller"],
					// datasets: [
					// 	{
					// 		label: "Walkup",
					// 		backgroundColor: ["rgba(99,255,132,0.2)", "rgba(99,132,255,0.2)" ],
					// 		data: [55, 90 ],
					// 	}
					// ]
					// }}
                    height={300}
                    width={500}
                    options={{
                        title: {
                            display: true,
                            text: this.getChartText(),
                            position:"top"
                        },
						legend:{
                        	position:"right"
						}


                    }}
                />
            </div>
        );
    }
	getVolumeData(){
		let data = {labels:[], datasets:[]}
		if( this.props.chartData.loaded ) {
    		if( this.props.chartData.volume.volumeInfo.hasOwnProperty('volumeByChannel')){

				data.datasets.push( {label: "Volume by Sales Channel", backgroundColor:[], data:[]});

				let index = 0;
				this.props.chartData.volume.volumeInfo.volumeByChannel.volume.data.forEach(salesChannel => {
					data.labels.push(salesChannel.salesChannel);
					data.datasets[0].backgroundColor.push( this.getBackgroundColor( index ) );
					data.datasets[0].data.push(salesChannel.volume );
					index++;
				});

				console.log("==========Volume data loaded: " + this.props.chartData.loaded);

				}
		}
		return data;
	}
	getChartText( ) {
		let title =  "Volume By Sales Channel";
		let total = 0;
		if (this.props.chartData.loaded) {
			if (this.props.chartData.volume.volumeInfo.hasOwnProperty('volumeByChannel')) {
				this.props.chartData.volume.volumeInfo.volumeByChannel.volume.data.forEach( (channel) =>{
					total += channel.volume;
				} );
			}
			title = title + " (" + total.toFixed(1) + " for this period)";
		}
		return title;
	}
	getBackgroundColor (index ){
    	switch( index ){
			case 0:
				return "rgba(99,132,255,0.2)";
			case 1:
				return "rgba(99,255,132,0.2)";
			default:
				return "rgba(0,0,255,0.2)";

		}
	}
}
export default WaterVolumeChannelChart;
