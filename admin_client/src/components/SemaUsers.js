import React, { Component } from 'react';
import SeamaServiceError from "./SeamaServiceError";
import SeamaDatabaseError from "./SeamaDatabaseError";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import * as volumeActions from 'actions/VolumeActions';
import * as healthCheckActions from 'actions/healthCheckActions';
import { withRouter } from 'react-router'
import UserList from "./common/UserList";

import Button from "react-bootstrap/lib/Button";
import Glyphicon from "react-bootstrap/lib/Glyphicon";

class SemaUsers extends Component {
	constructor(props) {
		super(props);
		this.state = {
			data: [{
				username: "mike",
				email: "123@gmail.com",
				firstName: "mike",
				lastName: "le"
			}]
		}
	};

	showContent(){
		const { healthCheck } = this.props;
		const { data } = this.state;

		if( healthCheck.server !== "Ok" ){
			return SeamaServiceError();
		}else if( healthCheck.database !== "Ok" ){
			return SeamaDatabaseError()
		}

		return (
			<div style={{margin: "5px"}}>
				<div className="">
					<Button
						bsStyle="primary"
						bsSize="small"
						className="pull-right"
						onClick={this.props.onCreateClick}
					>
						<Glyphicon glyph="plus" />
						Create User
					</Button>

					<h2>Users</h2>
				</div>

				<UserList data={data}/>
			</div>
		);
	}

	render() {
		return this.showContent();
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
)(SemaUsers));
