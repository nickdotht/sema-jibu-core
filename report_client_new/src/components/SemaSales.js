import React, { Component } from 'react';
import 'App.css';
import 'css/SemaSales.css';
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import * as healthCheckActions from 'actions/healthCheckActions';
import { withRouter } from 'react-router'
import SemaServiceError from "./SemaServiceError";
import SemaDatabaseError from "./SemaDatabaseError";
import SalesSummaryPanel1 from "./Sales/SalesSummaryPanel1";
import SalesSummaryPanel2 from "./Sales/SalesSummaryPanel2";
import SalesMapContainer from './Sales/SalesMapContainer';
import SalesRetailerList from './Sales/SalesRetailerList';
import * as salesActions from 'actions/SalesActions';
import SalesByChannelChart from "./Sales/SalesByChannelChart";
let dateFormat = require('dateformat');

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
			return SemaServiceError(props);
		}else  if( this.props.healthCheck.database !== "Ok" ){
			return SemaDatabaseError(props)
		}
		return this.showSales();

	}

	showSales(){
		return (
			<div className="SalesContainer">
				<div className = "SalesSummaryContainer">
					<div className ="SalesSummaryItem">
						<SalesSummaryPanel1 title="Total Customers" date={this.getDate(this.props.sales.salesInfo.totalCustomers.periods[0].endDate)}
											value={formatTotalCustomers(this.props.sales.salesInfo)}
											delta = {calcChange(this.props.sales.salesInfo.totalCustomers.periods[0].value, this.props.sales.salesInfo.totalCustomers.periods[1].value)}
											valueColor = {calcColor(this.props.sales.salesInfo.totalCustomers.periods[0].value, this.props.sales.salesInfo.totalCustomers.periods[1].value)} />
					</div>
					<div className ="SalesSummaryItem">
						<SalesSummaryPanel1 title="Total Revenue" date={this.getDate(this.props.sales.salesInfo.totalRevenue.periods[0].endDate)}
											value={formatDollar(this.props.sales.salesInfo.totalRevenue.total)}
											delta = {calcChange(this.props.sales.salesInfo.totalRevenue.periods[0].value, this.props.sales.salesInfo.totalRevenue.periods[1].value)}
											valueColor = {calcColor(this.props.sales.salesInfo.totalRevenue.periods[0].value, this.props.sales.salesInfo.totalRevenue.periods[1].value)} />
					</div>
					<div className ="SalesSummaryItem">
						<SalesSummaryPanel1 title="Net Income" date={this.getDate(this.props.sales.salesInfo.totalRevenue.periods[0].endDate)}
											value={calcNetRevenue( this.props.sales.salesInfo )}
											delta = {calcNetRevenueDelta(this.props.sales.salesInfo)}
											valueColor = {calcNetRevenueColor(this.props.sales.salesInfo)} />
					</div>
				</div>
				<div className = "SalesContentContainer">
					<div className= "SalesMapItem" id="salesMapId">
						<SalesMapContainer google={this.props.google} retailers={this.props.sales.salesInfo.customerSales} />
					</div>
					<div className= "SalesListItem">
						<div><p style={{textAlign:"center"}}>{formatRetailSalesHeader(this.props.sales.salesInfo.customerSales)}</p></div>
						<SalesRetailerList retailers={this.props.sales.salesInfo.customerSales}/>
					</div>
					<div className= "SalesBottomContainer">
						<div className= "SalesBottomLeftTop">
							<SalesSummaryPanel2 title="Total Customers"
												value={ formatTotalCustomers(this.props.sales.salesInfo)}
												valueColor = "rgb(24, 55, 106)"
												title2 = "All Channels" />
						</div>
						<div className= "SalesBottomLeftMiddle">
							<SalesSummaryPanel2 title="Liters/Customer"
												value={formatLitersPerCustomer("N/A")}
												valueColor = "green"
												title2 = {formatLitersPerPeriod(0)} />
						</div>
						<div className= "SalesBottomLeftBottom">
							<SalesSummaryPanel2 title="Customer Growth"
												value={formatCustomerGrowth(this.props.sales.salesInfo.totalCustomers)}
												valueColor = "red"
												title2 = "Expected: 2.5%" />
						</div>
						<div className= "SalesBottomRight">
							{/*<SalesByChannelChart chartData={this.props.sales.salesInfo.salesByChannel}/>*/}
						</div>
					</div>
					{/*<div className= "SalesBottonRightItem">*/}
						{/*<p>Bottom Right</p>*/}
					{/*</div>*/}
				</div>

			</div>
		);
	}
	getDate( date){
		return date === null ? "N/A": date;
	}
}
const calcNetRevenue = salesInfo =>{
	if( salesInfo.totalRevenue.total &&  salesInfo.totalCogs.total ){
		return formatDollar( salesInfo.totalRevenue.total = salesInfo.totalCogs.total);
	}else{
		return "N/A";
	}
}

const calcNetRevenueDelta = salesInfo =>{
	if( salesInfo.totalRevenue.periods[0].value &&  salesInfo.totalCogs.periods[0].value &&
		salesInfo.totalRevenue.periods[1].value &&  salesInfo.totalCogs.periods[1].value ){
		return calcChange( salesInfo.totalRevenue.periods[0].value - salesInfo.totalCogs.periods[0].value,
					salesInfo.totalRevenue.periods[1].value - salesInfo.totalCogs.periods[1].value )
	}else{
		return "N/A";
	}
}


const calcNetRevenueColor = salesInfo =>{
	if( salesInfo.totalRevenue.periods[0].value &&  salesInfo.totalCogs.periods[0].value &&
		salesInfo.totalRevenue.periods[1].value &&  salesInfo.totalCogs.periods[1].value ){
		return calcColor( salesInfo.totalRevenue.periods[0].value - salesInfo.totalCogs.periods[0].value,
			       salesInfo.totalRevenue.periods[1].value - salesInfo.totalCogs.periods[1].value )
	}else{
		return "gray";
	}
}

const formatTotalCustomers = salesInfo =>{
	return ( salesInfo.totalCustomers.total ) ? salesInfo.totalCustomers.total : "N/A";
}

const formatRetailSalesHeader = (retailSales) =>{
	if( retailSales.length > 0 ){
		return "Data to " + dateFormat((new Date(Date.parse(retailSales[0].periods[0].endDate))), "dddd mmm, d, yyyy");
		//return retailSales[0].
	}
	return "No data available";
};



const formatDollar = amount =>{
	let suffix = "";
	if( amount ) {
		if (amount > 1000) {
			amount = amount / 1000;
			suffix = "k";
		}
		let formatter = new Intl.NumberFormat('en-US', {
			style: 'currency',
			currency: 'HTG',
			minimumFractionDigits: 2,
			// the default value for minimumFractionDigits depends on the currency
			// and is usually already 2
		});
		return formatter.format(amount) + suffix;
	}else{
		return "N/A"
	}
};

// const formatTotalCustomers = total =>{
// 	if( total === null){
// 		return "N/A";
// 	}else{
// 		return String(parseFloat(total.toFixed(0)));
// 	}
// };

const formatLitersPerCustomer = litersPerCustomer =>{
	if( litersPerCustomer === "N/A"){
		return litersPerCustomer;
	}else{
		return String(parseFloat(litersPerCustomer.value.toFixed(0)));
	}
};
const formatLitersPerPeriod = litersPerCustomer =>{
	return "Liters/" + litersPerCustomer;
};

const formatCustomerGrowth = newCustomers =>{
	if( typeof newCustomers.periods[1].periodValue === "string" ||
		typeof newCustomers.periods[2].periodValue === "string"){
		return "N/A";
	}else{
		return ((newCustomers.periods[1].periodValue/newCustomers.periods[2].periodValue *100) -100).toFixed(2) + "%"
	}
};


const calcChange = (now, last) => {
	if( !now  || !last ){
		return "N/A"
	}else{
		return ((now/last)*100 -100).toFixed(2) + "%";
	}

};
const calcColor = (now, last) => {
	if( !now  || !last){
		return "gray"
	}else{
		if(now > last ) return "green";
		else if(now < last ) return "red";
	}
	return "gray"
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

