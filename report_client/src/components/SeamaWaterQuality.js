import React, { Component } from 'react';
import 'App.css';
import SeamaSummaryPanel1 from "./WaterQuality/SeamaSummaryPanel1";
import SeamaWaterProductionChart from "./WaterQuality/SeamaWaterProductionChart";
import SeamaWaterChlorineChart from "./WaterQuality/SeamaWaterChlorineChart";
import SeamaWaterTdsChart from "./WaterQuality/SeamaWaterTdsChart";
import 'css/SeamaWaterOperations.css';
import SeamaWaterQualityNavigation from "./WaterQuality/SeamaWaterQualityNavigation";
import SeamaServiceError from "./SeamaServiceError";
import SeamaDatabaseError from "./SeamaDatabaseError";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import * as waterOperationsActions from 'actions/WaterOperationsActions';
import * as healthCheckActions from 'actions/healthCheckActions';

class SeamaWaterQuality extends Component {

    render() {
        return this.showContent();
    }
    showContent(props){
		if( this.props.healthCheck.server !== "Ok" ){
			return SeamaServiceError(props);
		}else  if( this.props.healthCheck.database !== "Ok" ){
			return SeamaDatabaseError(props)
		}
        return this.showWaterQuality();

    }

    showWaterQuality( ){
        return (
            <div className="WaterQualityContainer">
                <div className = "WaterQualitySummaryContainer">
                    <div className ="WaterQualitySummaryItem">
                        <SeamaSummaryPanel1 title="Total Production" units={"Gallons"} value={this.props.waterOperations.totalProduction}/>
                    </div>
                    <div className ="WaterQualitySummaryItem">
                        <SeamaSummaryPanel1 title="Site Pressure" units={"PSI"} value={this.props.waterOperations.sitePressure}/>
                    </div>
                    <div className ="WaterQualitySummaryItem">
                        <SeamaSummaryPanel1 title="Flow Rate" units={"GPM"} value={this.props.waterOperations.flowRate}/>
                    </div>
                </div>
                <div className ="WaterQualityNavigtionItem">
                    <SeamaWaterQualityNavigation/>
                </div>
                <div className = "WaterQualityChartContainer">
                    <div className= "WaterQualityMainChartItem">
                        <SeamaWaterProductionChart chartData={this.props.waterOperations.production}/>
                    </div>
                    <div className= "WaterQualitySecondaryChart1Item">
                        <SeamaWaterChlorineChart chartData={this.props.waterOperations.chlorine}/>
                    </div>
                    <div className= "WaterQualitySecondaryChart2Item">
                        <SeamaWaterTdsChart chartData={this.props.waterOperations.tds}/>
                    </div>
                </div>
            </div>
        );

    }
}

function mapStateToProps(state) {
	return {
		waterOperations:state.waterOperations,
		healthCheck: state.healthCheck
	};
}

function mapDispatchToProps(dispatch) {
	return {
		waterOperationsActions: bindActionCreators(waterOperationsActions, dispatch),
		healthCheckActions: bindActionCreators(healthCheckActions, dispatch)
	};
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(SeamaWaterQuality);

