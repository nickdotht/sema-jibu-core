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
				<tr>
					<td>1.</td>
					<td>Mark</td>
					<td>20,000</td>
					<td style={{textAlign:"center"}}><i className="glyphicon glyphicon-arrow-up"/></td>
				</tr>
				<tr>
					<td>2.</td>
					<td>Jacob</td>
					<td>21,000</td>
					<td style={{textAlign:"center"}}><i className="glyphicon glyphicon-arrow-down"/></td>
				</tr>
				<tr>
					<td>3.</td>
					<td >Larry the Bird</td>
					<td>21,200</td>
					<td style={{textAlign:"center"}}><i className="glyphicon glyphicon-arrow-up"/></td>
				</tr>
				</tbody>
			</Table>
		)
	}
}
