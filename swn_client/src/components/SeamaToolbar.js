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
		console.log("SeamaToolbar-constructor");
		this.handleSelectKiosk = this.handleSelectKiosk.bind(this);
		this.handleSelectDate = this.handleSelectDate.bind(this);
		this.buildKioskMenuItems = this.buildKioskMenuItems.bind(this);
		this.buildDateMenuItems = this.buildDateMenuItems.bind(this);
		this.logOut = this.logOut.bind(this);

		this.state = {
			kiosks: "--Regions--"
		};

	}

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


	handleSelectKiosk(eventKey){
		console.log(eventKey, this.props.kiosk.kiosks[eventKey].name);

		this.setState({kiosks: this.props.kiosk.kiosks[eventKey].name});

		let kioskParams = {kioskID:this.props.kiosk.kiosks[eventKey].id};
		const previousKioskID = this.props.kiosk.selectedKiosk ?
			this.props.kiosk.selectedKiosk.kioskID :
			null;

		if(kioskParams.kioskID !== previousKioskID) {
			this.props.kioskActions.selectKiosk(kioskParams);
			this.props.volume.loaded = false;
			this.props.customer.loaded = false;
			switch (this.props.location.pathname) {
				case "/":
					this.props.volumeActions.fetchVolume(kioskParams);
					break;
				case "/Demographics":
					this.props.customerActions.fetchCustomer(kioskParams);
					break;
				default:
					console.log("Not implemented:", this.props.location.pathname);
			}
		}
	};

	handleSelectDate(eventKey){
		console.log(JSON.stringify(eventKey));
	}

	buildKioskMenuItems(){
		let menuItems = [];
		if( this.props.kiosk.kiosks){
			let keys = Object.keys(this.props.kiosk.kiosks);
			for( let i = 0; i < keys.length; i++ ){
				let kiosk = this.props.kiosk.kiosks[keys[i]];
				 menuItems.push(<MenuItem eventKey={keys[i]} key={keys[i]} style={menuStyle}>{kiosk.name}</MenuItem>);
			}
		}
		return menuItems;
	}

	buildDateMenuItems(){
		let menuItems = [];
		menuItems.push(<MenuItem eventKey={1} key={1} style={menuStyle}>{"Year to date"}</MenuItem>);
		menuItems.push(<MenuItem eventKey={2} key={2} style={menuStyle}>{"This month"}</MenuItem>);
		menuItems.push(<MenuItem eventKey={3} key={3} style={menuStyle}>{"Last Year"}</MenuItem>);
		menuItems.push(<MenuItem eventKey={4} key={4} style={menuStyle}>{"All"}</MenuItem>);
		return menuItems;
	}

	logOut (){
		console.log("logout");
		this.props.authActions.logout();
	}

	render() {
		return (
			<div className="SeamaNavToolbar" >
				<Navbar bsStyle="inverse" style={{marginBottom:"0px",
					borderRadius: 0}}>
					<Label style={LabelStyleLeft}>
						Version {this.props.Version}
					</Label>
					<Label style={LabelStyleLeft}>
						Region:
					</Label>
					<Nav >
						<NavDropdown title={this.state.kiosks} onSelect={this.handleSelectKiosk} id="basic-nav-dropdown" >
							{this.buildKioskMenuItems()}
						</NavDropdown>
					</Nav>
					<Label style={LabelStyleLeft}>
						Date Range:
					</Label>
					<Nav >
						<NavDropdown title="Year to Date" onSelect={this.handleSelectDate} id="basic-nav-dropdown2" >
							{this.buildDateMenuItems()}
						</NavDropdown>
					</Nav>

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
		healthCheck: state.healthCheck,
		kiosk:state.kiosk,
		volume:state.volume,
		customer:state.customer
	};
}

function mapDispatchToProps(dispatch) {
	return {
		authActions: bindActionCreators(authActions, dispatch),
		healthCheckActions: bindActionCreators(healthCheckActions, dispatch),
		kioskActions: bindActionCreators(kioskActions, dispatch),
		volumeActions: bindActionCreators(volumeActions, dispatch),
		customerActions: bindActionCreators(customerActions, dispatch)
	};
}

export default withRouter(connect(
	mapStateToProps,
	mapDispatchToProps
)(SeamaToolbar));

