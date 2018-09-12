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

const setYTD = (toolbar)=>{
	toolbar.endDate = new Date(Date.now());
	toolbar.startDate = new Date( toolbar.endDate.getFullYear(), 0, 1 );

};

const setYTDDisplay = (toolbar)=>{
	toolbar.setState( {displayDate: formatYTDDisplay( toolbar.startDate, toolbar.endDate)});

};
const formatYTDDisplay = (startDate, endDate) => {
	var locale = "en-us";
	return startDate.toLocaleString(locale, {month: "short"}) + " - " +
		endDate.toLocaleString(locale, {month: "short"}) + " " +
		startDate.getFullYear().toString();
}

const setThisMonth = (toolbar)=>{
	toolbar.endDate = new Date(Date.now());
	toolbar.startDate = new Date( toolbar.endDate.getFullYear(), toolbar.endDate.getMonth(), 1 );
};
const setThisMonthDisplay = (toolbar)=>{
	var locale = "en-us";
	var month = toolbar.startDate.toLocaleString(locale, {month: "short"});

	toolbar.setState( {displayDate: month + ", " + toolbar.startDate.getFullYear().toString()});

};

const setAll = (toolbar)=>{
	toolbar.startDate = new Date(1973, 0, 1);
	toolbar.endDate =new Date(Date.now());
};
const setAllDisplay = (toolbar)=>{
	toolbar.setState( {displayDate: "All Dates"});

};

const dateMenu = {
	1: {key:1, title:"Year to date", setStartEndDate:setYTD, setDisplayDate:setYTDDisplay},
	2: {key:2, title:"This month", setStartEndDate:setThisMonth, setDisplayDate:setThisMonthDisplay},
	3: {key:3, title:"all", setStartEndDate:setAll, setDisplayDate:setAllDisplay}
};


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
		this.endDate = new Date(Date.now());
		this.startDate = new Date( this.endDate.getFullYear(), 0, 1 );
		this.dateSelector = dateMenu[1];
		this.dateKey = 1;
		this.dateSelector.setStartEndDate( this );
		this.state = {
			kiosks: "--Regions--",
			displayDate: formatYTDDisplay( this.startDate, this.endDate )
		};
		// this.dateSelector.setDisplayDate(this);

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
			this.loadActivePage(kioskParams );
		}
	};

	handleSelectDate(eventKey){
		console.log(JSON.stringify(eventKey));
		if( this.dateKey != eventKey){
			this.dateKey = eventKey
			this.dateSelector = dateMenu[eventKey];
			this.dateSelector.setStartEndDate( this );
			this.dateSelector.setDisplayDate(this);
			this.loadActivePage(null );
		}
	}

	loadActivePage(kioskParams ){
		let params = {};
		if( kioskParams === null ){
			if( this.props.kiosk.selectedKiosk === null ){
				return;	// TODO - Shouldn't get here
			}
			params.kioskID = this.props.kiosk.selectedKiosk.kioskID;
		}else{
			params.kioskID = kioskParams.kioskID;
		}
		params.startDate = this.startDate;
		params.endDate = this.endDate;
		console.log("--------------------PARAMS "+ JSON.stringify(params));
		this.props.volume.loaded = false;
		this.props.customer.loaded = false;
		switch (this.props.location.pathname) {
			case "/":
				this.props.volumeActions.fetchVolume(params);
				break;
			case "/Demographics":
				this.props.customerActions.fetchCustomer(params);
				break;
			default:
				console.log("Not implemented:", this.props.location.pathname);
		}

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
		menuItems.push(<MenuItem eventKey={dateMenu[1].key} key={dateMenu[1].key} style={menuStyle}>{dateMenu[1].title}</MenuItem>);
		menuItems.push(<MenuItem eventKey={dateMenu[2].key} key={dateMenu[2].key} style={menuStyle}>{dateMenu[2].title}</MenuItem>);
		menuItems.push(<MenuItem eventKey={dateMenu[3].key} key={dateMenu[3].key} style={menuStyle}>{dateMenu[3].title}</MenuItem>);
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
						<NavDropdown title={this.state.displayDate} onSelect={this.handleSelectDate} id="basic-nav-dropdown2" >
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

