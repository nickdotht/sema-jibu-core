import React, { Component } from 'react';
import 'App.css';
import 'css/SemaSales.css';
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import * as healthCheckActions from 'actions/healthCheckActions';
import { withRouter } from 'react-router'
import SeamaServiceError from "./SeamaServiceError";
import SeamaDatabaseError from "./SeamaDatabaseError";
import SemaSummaryPanel from "./Sales/SemaSummaryPanel";

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
						<SemaSummaryPanel title="New Customers" units={"Gallons"} value="1000"/>
					</div>
					<div className ="SalesSummaryItem">
						<SemaSummaryPanel title="Total Revenue" units={"PSI"} value="2000"/>
					</div>
					<div className ="SalesSummaryItem">
						<SemaSummaryPanel title="Net Income" units={"GPM"} value="3000"/>
					</div>
				</div>
				<div className = "SalesContentContainer">
					<div className= "SalesMapItem">
						<p>Map goes here</p>
						<p>Map goes here</p>
						<p>Map goes here</p>
						<p>Map goes here</p>
						<p>Map goes here</p>
						<p>Map goes here</p>
						<p>Map goes here</p>
						<p>Map goes here</p>
						<p>Map goes here</p>
						<p>Map goes here</p>
						<p>Map goes here</p>
						<p>Map goes here</p>
					</div>
					<div className= "SalesListItem">
						<p>List goes here</p>
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

function mapStateToProps(state) {
	return {
		healthCheck: state.healthCheck
	};
}

function mapDispatchToProps(dispatch) {
	return {
		healthCheckActions: bindActionCreators(healthCheckActions, dispatch)
	};
}

export default withRouter(connect(
	mapStateToProps,
	mapDispatchToProps
)(SemaSales));

