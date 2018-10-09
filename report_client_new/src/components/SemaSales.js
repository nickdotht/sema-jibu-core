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
import LoadProgress from "./LoadProgress";

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
				<div className = "SalesProgress" style={{width:"100%", height:'100%'}}>
					<LoadProgress/>
				</div>
				<div className = "SalesSummaryContainer">
					<div className ="SalesSummaryItem">
						<SalesSummaryPanel1 title="Total Customers" date={this.getDate(this.props.sales.salesInfo.totalCustomers.periods[0].endDate)}
											value={formatTotalCustomers(this.props.sales.salesInfo)}
											delta = {calcCustomerDelta( this.props.sales.salesInfo) }
											valueColor = {calcColor(this.props.sales.salesInfo.totalCustomers.periods[0].value, this.props.sales.salesInfo.totalCustomers.periods[1].value)} />
					</div>
					<div className ="SalesSummaryItem">
						<SalesSummaryPanel1 title="Total Revenue" date={this.getDate(this.props.sales.salesInfo.totalRevenue.periods[0].endDate)}
											value={formatDollar(this.props.sales.salesInfo.totalRevenue.total)}
											delta = {calcRevenueDelta(this.props.sales.salesInfo)}
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
						{/*<div className= "SalesBottomLeftMiddle">*/}
							{/*<SalesSummaryPanel2 title="Liters/Customer"*/}
												{/*value={formatLitersPerCustomer("N/A")}*/}
												{/*valueColor = "green"*/}
												{/*title2 = {formatLitersPerPeriod(0)} />*/}
						{/*</div>*/}
						{/*<div className= "SalesBottomLeftBottom">*/}
							{/*<SalesSummaryPanel2 title="Customer Growth"*/}
												{/*value={formatCustomerGrowth(this.props.sales.salesInfo.totalCustomers)}*/}
												{/*valueColor = "red"*/}
												{/*title2 = "Expected: 2.5%" />*/}
						{/*</div>*/}
						<div className= "SalesBottomRight">
							<SalesByChannelChart chartData={this.props.sales}/>
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
	if( salesInfo.totalRevenue.period === "none"){
		return "";
	}else {
		if (salesInfo.totalRevenue.periods[0].value && salesInfo.totalCogs.periods[0].value &&
			salesInfo.totalRevenue.periods[1].value && salesInfo.totalCogs.periods[1].value) {
			return calcChange(salesInfo, salesInfo.totalRevenue.periods[0].value - salesInfo.totalCogs.periods[0].value,
				salesInfo.totalRevenue.periods[1].value - salesInfo.totalCogs.periods[1].value)
		} else {
			return "N/A";
		}
	}
}
const calcCustomerDelta = salesInfo =>{
	if( salesInfo.totalCustomers.period === "none") {
		return "";
	}else{
		return calcChange(salesInfo, salesInfo.totalCustomers.periods[0].value, salesInfo.totalCustomers.periods[1].value);
	}
}
const calcRevenueDelta = salesInfo =>{
	if( salesInfo.totalRevenue.period === "none") {
		return "";
	}else{
		return calcChange(salesInfo, salesInfo.totalRevenue.periods[0].value, salesInfo.totalRevenue.periods[1].value);
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
		switch( retailSales[0].period){
			case "none":
				return "Total Sales";
			case "year":
				let startDate = dateFormat((new Date(Date.parse(retailSales[0].periods[0].beginDate))), "mmm, yyyy");
				let endDate = dateFormat((new Date(Date.parse(retailSales[0].periods[0].endDate))), "mmm, yyyy");
				return "Sales from " + startDate + " - " + endDate;
			case "month":
				startDate = dateFormat((new Date(Date.parse(retailSales[0].periods[0].beginDate))), "mmm, d, yyyy");
				endDate = dateFormat((new Date(Date.parse(retailSales[0].periods[0].endDate))), "mmm, d, yyyy");
				return "Sales from " + startDate + " - " + endDate;
			default:
				return "";
		}
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


const calcChange = (salesInfo, now, last) => {
	if( !now  || !last ){
		return "N/A"
	}else{
		// Prorate the current period of it is incomplete
		let nowDate = new Date();
		switch( salesInfo.totalCustomers.period ){
			case "year":
				let periodYear = new Date(Date.parse(salesInfo.totalCustomers.periods[0].beginDate)).getFullYear();
				if( nowDate.getFullYear() == periodYear ){
					let start = new Date(periodYear, 0, 0);
					let diff = nowDate - start;
					let oneDay = 1000 * 60 * 60 * 24;
					let dayOfYear = Math.floor(diff / oneDay);

					now = ((365*now)/dayOfYear)
				}
				break;
			case "month":
				let period = new Date(Date.parse(salesInfo.totalCustomers.periods[0].beginDate));
				periodYear = period.getFullYear();
				let periodMonth = period.getMonth();
				if( nowDate.getFullYear() == periodYear && nowDate.getMonth() == periodMonth ) {
					let dayOfMonth = nowDate.getDate();
					let daysInMonth =  new Date(periodYear, periodMonth+1, 0).getDate(); // Note: this is a trick to get the last day of the month
					now = ((daysInMonth*now)/dayOfMonth)
				}
				break;
		}
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

