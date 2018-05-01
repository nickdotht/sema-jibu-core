import React, { Component } from 'react';
import 'App.css';
import 'css/SemaSales.css';
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import * as healthCheckActions from 'actions/healthCheckActions';
import { withRouter } from 'react-router'
import SeamaServiceError from "./SeamaServiceError";
import SeamaDatabaseError from "./SeamaDatabaseError";
import SalesSummaryPanel1 from "./Sales/SalesSummaryPanel1";
import SalesSummaryPanel2 from "./Sales/SalesSummaryPanel2";
import SalesMapContainer from './Sales/SalesMapContainer';
import SalesRetailerList from './Sales/SalesRetailerList';
import * as salesActions from 'actions/SalesActions';
import SalesByChannelChart from "./Sales/SalesByChannelChart";

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
						<SalesSummaryPanel1 title="New Customers" label={" of Monthly goal"}
										  value={this.props.sales.newCustomers.thisPeriod}
										  delta = {calcChange(this.props.sales.newCustomers.thisPeriod, this.props.sales.newCustomers.lastPeriod)} />
					</div>
					<div className ="SalesSummaryItem">
						<SalesSummaryPanel1 title="Total Revenue" label={" to last Month"}
										  value={this.props.sales.totalRevenue.total}
										  delta = {calcChange(this.props.sales.totalRevenue.thisPeriod, this.props.sales.totalRevenue.lastPeriod)} />
					</div>
					<div className ="SalesSummaryItem">
						<SalesSummaryPanel1 title="Net Income" label={" to last Month"}
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
					<div className= "SalesBottomContainer">
						<div className= "SalesBottomLeftTop">
							<SalesSummaryPanel2 title="Total Customers"
												value={ formatTotalCustomers(this.props.sales.totalCustomers)}
												valueColor = "rgb(24, 55, 106)"
												title2 = "All Channels" />
						</div>
						<div className= "SalesBottomLeftMiddle">
							<SalesSummaryPanel2 title="Liters/Customer"
												value={formatLitersPerCustomer(this.props.sales.litersPerCustomer)}
												valueColor = "green"
												title2 = {formatLitersPerPeriod(this.props.sales.litersPerCustomer)} />
						</div>
						<div className= "SalesBottomLeftBottom">
							<SalesSummaryPanel2 title="Customer Growth"
												value={formatCustomerGrowth(this.props.sales.newCustomers)}
												valueColor = "red"
												title2 = "Expected: 2.5%" />
						</div>
						<div className= "SalesBottomRight">
							<SalesByChannelChart chartData={this.props.sales.salesByChannel}/>
						</div>
					</div>
					{/*<div className= "SalesBottonRightItem">*/}
						{/*<p>Bottom Right</p>*/}
					{/*</div>*/}
				</div>

			</div>
        );
    }
}
const formatTotalCustomers = total =>{
	if( typeof total === "string"){
		return total;
	}else{
		return parseFloat(total.toFixed(0));
	}
};
const formatLitersPerCustomer = litersPerCustomer =>{
	if( typeof litersPerCustomer.value === "string"){
		return litersPerCustomer.value;
	}else{
		return parseFloat(litersPerCustomer.value.toFixed(0));
	}
};
const formatLitersPerPeriod = litersPerCustomer =>{
	if( litersPerCustomer.period.toLowerCase() === "n/a"){
		return "N/A";
	}else{
		return "Liters/" + litersPerCustomer.period;
	}
};

const formatCustomerGrowth = newCustomers =>{
	if( typeof newCustomers.thisPeriod === "string" ||
		typeof newCustomers.lastPeriod === "string"){
		return "N/A";
	}else{
		return ((newCustomers.thisPeriod/newCustomers.lastPeriod *100) -100).toFixed(2) + "%"
	}
};


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

