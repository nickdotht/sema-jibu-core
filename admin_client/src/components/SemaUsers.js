import React, { Component } from 'react';
import SeamaServiceError from "./SeamaServiceError";
import SeamaDatabaseError from "./SeamaDatabaseError";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import * as healthCheckActions from 'actions/healthCheckActions';
import { withRouter } from 'react-router'

import UserList from "./common/UserList";
import Button from "./common/Button";

// TODO split up container and presentational components
import { fetchUsers } from "actions/UserActions";

class SemaUsers extends Component {
	constructor(props) {
		super(props);
	};

	componentDidMount() {
		this.props.fetchUsers();
	};

showContent(){
		const {
			healthCheck,
			users,
			loading
		} = this.props;

		if( healthCheck.server !== "Ok" ){
			return SeamaServiceError();
		}else if( healthCheck.database !== "Ok" ){
			return SeamaDatabaseError()
		}

		return (
			<div style={{margin: "5px"}}>
				<div className="">
					<Button
						buttonStyle="primary"
						buttonSize="small"
						className="pull-right"
						onClick={this.props.onCreateClick}
						icon="plus"
						buttonText="Create User"
					/>
					<h2>Users</h2>
				</div>

				{!loading && <UserList data={users}/>}

			</div>
		);
	}

	render() {
		return this.showContent();
	}

}

function mapStateToProps(state) {
	return {
		healthCheck: state.healthCheck,
		users: state.user.users,
		loading: state.user.loading
	};
}

function mapDispatchToProps(dispatch) {
	return {
		healthCheckActions: bindActionCreators(healthCheckActions, dispatch),
		fetchUsers: bindActionCreators(fetchUsers, dispatch)
	};
}

export default withRouter(connect(
	mapStateToProps,
	mapDispatchToProps
)(SemaUsers));
