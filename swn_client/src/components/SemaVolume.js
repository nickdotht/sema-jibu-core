import React, { Component } from 'react';
import 'App.css';
import WaterVolumeChannelAndIncomeChart from "./WaterQuality/WaterVolumeChannelAndIncomeChart";
import WaterVolumeChannelChart from "./WaterQuality/WaterVolumeChannelChart"
import WaterVolumeChannelAndTypeChart from "./WaterQuality/WaterVolumeChannelAndTypeChart"
import 'css/SemaVolume.css';
import SeamaServiceError from "./SeamaServiceError";
import SeamaDatabaseError from "./SeamaDatabaseError";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import * as volumeActions from 'actions/VolumeActions';
import * as healthCheckActions from 'actions/healthCheckActions';
import { withRouter } from 'react-router'

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
					<WaterVolumeChannelAndIncomeChart chartData={this.props.volume}/>
                </div>
                <div className = "WaterVolumeChannelAndCustomerType">
					<div className = "WaterVolumeChannel">
						<WaterVolumeChannelChart  chartData={this.props.volume}/>
					</div>
					<div className="WaterVolumeCustomerType">
						<WaterVolumeChannelAndTypeChart  chartData={this.props.volume}/>
					</div>
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

