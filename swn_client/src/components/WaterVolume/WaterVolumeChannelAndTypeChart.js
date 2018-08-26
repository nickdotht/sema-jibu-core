import React, { Component } from 'react';
import {HorizontalBar} from 'react-chartjs-2';
import { utilService } from 'services';

class WaterVolumeChannelAndTypeChart extends Component {
    render() {
        return (
			<div style={{backgroundColor:'rgb(40,89,167'}}>
        		<div className = "chart" style={{backgroundColor:'white', margin:"2px"}}>
					<HorizontalBar
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
			</div>

        );
    }
	getVolumeData(){
		let data = {labels:[], datasets:[]}
		if( this.props.chartData.loaded ) {
			if( this.props.chartData.volumeInfo.hasOwnProperty('volumeByChannel')){
				if( this.props.chartData.volumeInfo.volumeByChannelAndType.length > 0 ) {
					// Create the bars
					this.props.chartData.volumeInfo.volumeByChannelAndType.forEach(channelAndType => {
						data.labels.push(channelAndType.customerTypeName);
					});

					// Create the labels
					this.props.chartData.volumeInfo.volumeByChannelAndType[0].volume.data.forEach(salesChannel => {
						data.datasets.push( {label: salesChannel.salesChannel, data:[], stack: 1, backgroundColor:utilService.getBackgroundColorForChannel( salesChannel.salesChannel ), id: salesChannel.salesChannel});
					});
					// add the data
					this.props.chartData.volumeInfo.volumeByChannelAndType.forEach(channelAndType => {
						channelAndType.volume.data.forEach( dataPt =>{
							this.addData( data.datasets, dataPt );
						});

					});

					console.log("WaterVolumeChannelAndIncomeChart - Volume data loaded");

				}
			}
		}
		return data;
	}
	addData( dataSets, dataPt ){
		for( let index = 0; index < dataSets.length; index++){
			if(dataSets[index].id === dataPt.salesChannel ){
				dataSets[index].data.push( dataPt.volume );
				return;
			}
		}
	}

	getChartText( ) {
		return "Volume By Sales Channel and Consumer Type";
	}
}
export default WaterVolumeChannelAndTypeChart;
