import React, { Component } from 'react';
import SeamaServiceError from "./SeamaServiceError";
import SeamaDatabaseError from "./SeamaDatabaseError";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import * as volumeActions from 'actions/VolumeActions';
import * as healthCheckActions from 'actions/healthCheckActions';
import { withRouter } from 'react-router'

class SemaProducts extends Component {

	render() {
		return this.showContent();
	}
	showContent(props){
		if( this.props.healthCheck.server !== "Ok" ){
			return SeamaServiceError(props);
		}else  if( this.props.healthCheck.database !== "Ok" ){
			return SeamaDatabaseError(props)
		}
		return (
			<div style = {this.getHeight()}>
				Sema Products go here
			</div>
		);
	}

	getHeight(){
		let windowHeight = window.innerHeight;
		// TODO 52px is the height of the toolbar. (Empirical)
		windowHeight -= 52;
		let height = windowHeight.toString()+'px';
		return {height:height}
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
)(SemaProducts));

