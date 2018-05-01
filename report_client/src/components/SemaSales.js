import React, { Component } from 'react';
import 'App.css';
import 'css/SemaSales.css';
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import * as healthCheckActions from 'actions/healthCheckActions';
import { withRouter } from 'react-router'
import SeamaServiceError from "./SeamaServiceError";
import SeamaDatabaseError from "./SeamaDatabaseError";
import SemaSummaryPanel from "./Sales/SalesSummaryPanel";
import SalesMapContainer from './Sales/SalesMapContainer';
import SalesRetailerList from './Sales/SalesRetailerList';
import * as salesActions from 'actions/SalesActions';

class SemaSales extends Component {
    constructor(props, context) {
        super(props, context);
        console.log("SeamaSales - Constructor");
    }

	render() {
		return this.showContent();
	}
	showContent(props){
		if( this.props.healthCheck.server !== "Ok" ){
			return SeamaServiceError(props);
		}else  if( this.props.healthCheck.database !== "Ok" ){
			return SeamaDatabaseError(props)
		}
		return this.showSales();

	}

    showSales(){
        return (
			<div className="SalesContainer">
				<div className = "SalesSummaryContainer">
					<div className ="SalesSummaryItem">
						<SemaSummaryPanel title="New Customers" label={" of Monthly goal"}
										  value={this.props.sales.newCustomers.thisPeriod}
										  delta = {calcChange(this.props.sales.newCustomers.thisPeriod, this.props.sales.newCustomers.lastPeriod)} />
					</div>
					<div className ="SalesSummaryItem">
						<SemaSummaryPanel title="Total Revenue" label={" to last Month"}
										  value={this.props.sales.totalRevenue.total}
										  delta = {calcChange(this.props.sales.totalRevenue.thisPeriod, this.props.sales.totalRevenue.lastPeriod)} />
					</div>
					<div className ="SalesSummaryItem">
						<SemaSummaryPanel title="Net Income" label={" to last Month"}
										  value={this.props.sales.netIncome.total}
										  delta = {calcChange(this.props.sales.netIncome.thisPeriod, this.props.sales.netIncome.lastPeriod)} />
					</div>
				</div>
				<div className = "SalesContentContainer">
					<div className= "SalesMapItem" id="salesMapId">
						<SalesMapContainer google={this.props.google} retailers={this.props.sales.retailSales} />
					</div>
					<div className= "SalesListItem">
						<SalesRetailerList retailers={this.props.sales.retailSales}/>
					</div>
					<div className= "SalesBottonLeftItem">
						<p>Bottom left</p>
						<p>Bottom left</p>
						<p>Bottom left</p>
						<p>Bottom left</p>
						<p>Bottom left</p>
						<p>Bottom left</p>
					</div>
					<div className= "SalesBottonRightItem">
						<p>Bottom Right</p>
					</div>
				</div>

			</div>
        );

    }
}
const calcChange = (now, last) => {
	if( typeof now === "string" || typeof last === "string"){
		return "N/A"
	}else{
		return parseFloat(((now/last)*100 -100).toFixed(2));
	}

};

function mapStateToProps(state) {
	return {
		sales:state.sales,
		healthCheck: state.healthCheck
	};
}

function mapDispatchToProps(dispatch) {
	return {
		salesActions: bindActionCreators(salesActions, dispatch),
		healthCheckActions: bindActionCreators(healthCheckActions, dispatch)
	};
}

export default withRouter(connect(
	mapStateToProps,
	mapDispatchToProps
)(SemaSales));

