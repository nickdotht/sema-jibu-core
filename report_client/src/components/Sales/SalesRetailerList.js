import React, { Component } from 'react';
import {Table } from 'react-bootstrap';
export default class SalesRetailerList extends Component {

	render() {

		return ( // in our return function you must return a div with ref='map' and style.
			<Table striped bordered condensed hover>
				<thead>
				<tr>
					<th style={{width: "10%"}}></th>
					<th>Name</th>
					<th style={{width: "20%"}}>Sales</th>
					<th style={{width: "10%"}}>Trend</th>
				</tr>
				</thead>
				<tbody>
					{this.buildTableRows()}
				</tbody>
			</Table>
		)
	}
	buildTableRows(){
		let rows = [];
		this.props.retailers.forEach( (retailer, index) => {
			rows.push(<tr>
						<td>{index+1}.</td>
						<td>{retailer.name}</td>
						<td>{retailer.total}</td>
						{this.calcTrend(retailer.thisPeriod, retailer.lastPeriod)}
					</tr>
			)
		});
		return rows;
	}
	calcTrend( now, last ){
		if( now > last ){
			return (<td style={{textAlign:"center"}}><i className="glyphicon glyphicon-arrow-up"/></td>);
		}
		return (<td style={{textAlign:"center"}}><i className="glyphicon glyphicon-arrow-down"/></td>);
	}
}
