import React, { Component } from 'react';
import {Pie} from 'react-chartjs-2';
import { utilService } from 'services';

class CustomersByIncomeLevelChart extends Component {
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
    		if( this.props.chartData.customerInfo.hasOwnProperty('customersByIncome')){

				data.datasets.push( {label: "Customers By Income Levelx", backgroundColor:[], data:[]});
				let index = 0;
				this.props.chartData.customerInfo.customersByIncome.forEach(income => {
					if (income.hasOwnProperty("incomeLessThan") && income.hasOwnProperty("incomeGreaterThan")) {
						let label = "$" + income.incomeGreaterThan + "<$" + income.incomeLessThan + " per day";
						data.labels.push(label);
					} else if (income.hasOwnProperty("incomeLessThan")) {
						data.labels.push("$" + income.incomeLessThan + "< per day");
					} else if (income.hasOwnProperty("incomeGreaterThan")) {
						data.labels.push("$" + income.incomeGreaterThan + "> per day");
					}

					data.datasets[0].backgroundColor.push( utilService.getBackgroundColorByIndex( index ) );
					data.datasets[0].data.push(income.customerCount );
					index++;
				});
			}
		}
		return data;
	}
	getChartText( ) {
		return "Customers By Income Level";
	}
}
export default CustomersByIncomeLevelChart;
