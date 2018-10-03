import React, { Component } from 'react';
// import ReactDOM from 'react-dom';
import { Navbar, Label, Nav,NavDropdown,MenuItem } from 'react-bootstrap';
import 'App.css';
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import {
	kioskActions,
	volumeActions,
	customerActions,
	authActions,
	healthCheckActions
} from 'actions';
import { withRouter } from 'react-router'
import SemaDateFilter from "./SemaDateFilter";

const menuStyle = {};


const LabelStyleLeft = {
	float:"left",
	background:"none",
	marginTop:"15px",
	fontSize:"14px",
	fontWeight: "normal"
};
const LabelStyleRight = {
	float:"right",
	background:"none",
	marginTop:"15px",
	fontSize:"14px",
	fontWeight: "normal"
};


class SeamaToolbar extends Component {
	constructor(props, context) {
		super(props, context);
	};

	componentDidMount() {
		window.addEventListener('tokenExpired', this.handleExpiredEvent.bind(this));

	}
	handleExpiredEvent( event ){
		console.log("tokenExpired");
		this.props.authActions.logout();

	}
	componentWillUnmount(){
		window.removeEventListener('tokenExpired', this.handleExpiredEvent );
	}


	logOut (){
		console.log("logout");
		this.props.authActions.logout();
	}

	render() {
		return (
			<div className="SeamaNavToolbar" id = "semaToolbar">
				<Navbar bsStyle="inverse" style={{marginBottom:"0px",
				borderRadius: 0}}>
					<Label style={LabelStyleRight}>
						Version {this.props.Version}
					</Label>
					<Label style={LabelStyleRight}> Server: {this.showServer()}</Label>
					<Label onClick={this.logOut} href="#" style={LabelStyleRight}>
						<a href="/">Logout</a>
					</Label>
					<Label style={LabelStyleRight}>
						{ `${this.props.currentUser.first_name}
						${this.props.currentUser.last_name}`}
					</Label>
				</Navbar>
			</div>
		);
	}
	showServer () {
		if (this.props.healthCheck.server === "Ok") {
			return this.props.healthCheck.version;
		}
		return this.props.healthCheck.server;
	}
}

function mapStateToProps(state) {
	return {
		logState: state.auth.LogState,
		currentUser: state.auth.currentUser,
		healthCheck: state.healthCheck
		};
}

function mapDispatchToProps(dispatch) {
	return {
		authActions: bindActionCreators(authActions, dispatch),
		healthCheckActions: bindActionCreators(healthCheckActions, dispatch)
	};
}

export default withRouter(connect(
	mapStateToProps,
	mapDispatchToProps
)(SeamaToolbar));
