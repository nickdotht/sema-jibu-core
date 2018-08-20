import React, { Component } from 'react';
import 'App.css';
import SemaSummaryPanel1 from "./WaterQuality/SemaSummaryPanel1";
import WaterVolumeChannelAndIncomeChart from "./WaterQuality/WaterVolumeChannelAndIncomeChart";
import SeamaWaterChlorineChart from "./WaterQuality/SeamaWaterChlorineChart";
import SeamaWaterTdsChart from "./WaterQuality/SeamaWaterTdsChart";
import 'css/SemaVolume.css';
import SeamaWaterQualityNavigation from "./WaterQuality/SeamaWaterQualityNavigation";
import SeamaServiceError from "./SeamaServiceError";
import SeamaDatabaseError from "./SeamaDatabaseError";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import * as volumeActions from 'actions/VolumeActions';
import * as healthCheckActions from 'actions/healthCheckActions';
import { withRouter } from 'react-router'
import SemaSummaryPanel2 from "./WaterQuality/SemaSummaryPanel2";

class SemaVolume extends Component {

    render() {
        return this.showContent();
    }
    showContent(props){
		if( this.props.healthCheck.server !== "Ok" ){
			return SeamaServiceError(props);
		}else  if( this.props.healthCheck.database !== "Ok" ){
			return SeamaDatabaseError(props)
		}
        return this.showWaterOperations();

    }

    showWaterOperations( ){
        return (
            <div className="WaterVolumeContainer">
                <div className = "WaterVolumeChannelAndIncome">
					<div className= "WaterQualityMainChartItem">
						<WaterVolumeChannelAndIncomeChart chartData={this.props.volume.production}/>
					</div>
                </div>
                <div className = "WaterVolumeGroupAndType">
					xxxxx
					<br/>
					YYYY
					<br/>
					YYYY
					<br/>
					YYYY
					xxxxx
					<br/>
					YYYY
					<br/>
					YYYY
					<br/>
					YYYY
					xxxxx
					<br/>
					YYYY
					<br/>
					YYYY
					<br/>
					YYYY
					xxxxx
					<br/>
					YYYY
					<br/>
					YYYY
					<br/>
					YYYY
				</div>
            </div>
        );
    }
}

function mapStateToProps(state) {
	return {
		volume:state.volume,
		healthCheck: state.healthCheck
	};
}

function mapDispatchToProps(dispatch) {
	return {
		volumeActions: bindActionCreators(volumeActions, dispatch),
		healthCheckActions: bindActionCreators(healthCheckActions, dispatch)
	};
}

export default withRouter(connect(
	mapStateToProps,
	mapDispatchToProps
)(SemaVolume));

