import React, { Component } from 'react';
import {Pie} from 'react-chartjs-2';
import { utilService } from 'services';

class CustomersByGenderChart extends Component {
    render() {
        return (
			<div style={{backgroundColor:'rgb(40,89,167'}}>
        		<div className = "chart" style={{backgroundColor:'white', margin:"2px"}}>
					<Pie
						data = {this.getCustomerData()}
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
	getCustomerData(){
		let data = {labels:[], datasets:[]}
		if( this.props.chartData.loaded ) {
    		if( this.props.chartData.customerInfo.hasOwnProperty('customersByGender')){

				data.datasets.push( {label: "", backgroundColor:[], data:[]});
				let [ maleCount, femaleCount, naCount] = this.calcGenderValues( this.props.chartData.customerInfo );

				data.labels.push("Male");
				data.datasets[0].backgroundColor.push( utilService.getBackgroundColorByIndex2( 0 ) );
				data.datasets[0].data.push(maleCount );

				data.labels.push("Female");
				data.datasets[0].backgroundColor.push( utilService.getBackgroundColorByIndex2( 1 ) );
				data.datasets[0].data.push(femaleCount );

				data.labels.push("Not Available");
				data.datasets[0].backgroundColor.push( utilService.getBackgroundColorByIndex2( 2 ) );
				data.datasets[0].data.push(naCount );

			}
		}
		return data;
	}
	getChartText( ) {
		return "Customers By Gender";
	}

	calcGenderValues( customerInfo ){
    	let naCount = customerInfo.allCustomers.customerCount;
		let maleCount = customerInfo.customersByGender[0].customerCount;
		let femaleCount = customerInfo.customersByGender[1].customerCount;
		naCount = naCount - ( maleCount + femaleCount);
		return [maleCount,femaleCount,naCount  ];
	}
}
export default CustomersByGenderChart;
