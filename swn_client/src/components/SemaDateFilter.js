import React, { Component } from 'react';
import { Nav,NavDropdown,MenuItem, Image } from 'react-bootstrap';
import 'App.css';
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import { dateFilterActions} from 'actions';
import { withRouter } from 'react-router'

const menuStyle = {};


const ImageStyle = {
	width:"30px",
	height:"30px",
	verticalAlign: "middle",
	marginTop:"10px",
};

class SemaDateFilter extends Component {

	dateMenu = {
		1: {key:1,
			title:"Year to date",
			setStartEndDate:this.setYTD.bind(this),
			setDisplayDate:this.setYTDDisplay.bind(this),
			incrementStartEndDate:this.yearIncrement.bind(this),
			decrementStartEndDate:this.yearDecrement.bind(this)
			},

		2: {key:2,
			title:"This month",
			setStartEndDate:this.setThisMonth.bind(this),
			setDisplayDate:this.setThisMonthDisplay.bind(this),
			incrementStartEndDate:this.monthIncrement.bind(this),
			decrementStartEndDate:this.monthDecrement.bind(this)
			},
		3: {key:3,
			title:"all",
			setStartEndDate:this.setAll.bind(this),
			setDisplayDate:this.setAllDisplay.bind(this),
			incrementStartEndDate:()=>{},
			decrementStartEndDate:()=>{}
		}
	};

	setYTD() {
		this.endDate = new Date(Date.now());
		this.startDate = new Date( this.endDate.getFullYear(), 0, 1 );

	};
	setYTDDisplay(){
		this.setState( {displayDate: this.formatYTDDisplay( this.startDate, this.endDate)});

	};
	yearIncrement(){

	}
	yearDecrement(){

	}
	setThisMonth(){
		this.endDate = new Date(Date.now());
		this.startDate = new Date( this.endDate.getFullYear(), this.endDate.getMonth(), 1 );
		this.endDate  = new Date(this.startDate.getFullYear(), this.startDate.getMonth()+1, 0);

	};
	setThisMonthDisplay (){
		let locale = "en-us";
		const month = this.startDate.toLocaleString(locale, {month: "short"});
		this.setState( {displayDate: month + ", " + this.startDate.getFullYear().toString()});

	};
	monthIncrement() {
		this.startDate = new Date( this.startDate.setMonth(this.startDate.getMonth() + 1));
		this.endDate = new Date( this.endDate.setMonth(this.endDate.getMonth() + 1));
		this.setThisMonthDisplay();
		this.props.dateFilterActions.setDateRange( this.startDate, this.endDate );
	}
	monthDecrement(){
		this.startDate = new Date( this.startDate.setMonth(this.startDate.getMonth()-1));
		this.endDate = new Date( this.endDate.setMonth(this.endDate.getMonth()-1));
		this.setThisMonthDisplay();
		this.props.dateFilterActions.setDateRange( this.startDate, this.endDate );
	}

	setAll(){
		this.startDate = new Date(1973, 0, 1);
		this.endDate =new Date(Date.now());
	};

	setAllDisplay(){
		console.log("foo");
		this.setState( {displayDate: "All Dates"});

	};


	formatYTDDisplay(){
		const locale = "en-us";
		return this.startDate.toLocaleString(locale, {month: "short"}) + " - " +
			this.endDate.toLocaleString(locale, {month: "short"}) + " " +
			this.startDate.getFullYear().toString();
	}

	constructor(props, context) {
		super(props, context);
		console.log("SemaDateFilter-constructor");
		this.handleSelectDate = this.handleSelectDate.bind(this);

		this.endDate = new Date(Date.now());
		this.startDate = new Date( this.endDate.getFullYear(), 0, 1 );
		this.dateSelector = this.dateMenu[1];
		this.dateKey = 1;
		this.dateSelector.setStartEndDate( this );
		this.state = {
			displayDate: this.formatYTDDisplay( this.startDate, this.endDate )
		};

	}

	componentDidMount() {
		this.props.dateFilterActions.setDateRange( this.startDate, this.endDate );
	}

	render() {
		return (
			<div>
				<Nav>
					<div>
						{<img src={require('images/left-arrow.png')} alt="logo" style={ImageStyle} onClick={() => this.leftArrowClick()} />}
					</div>
				</Nav>
				<Nav>
					<NavDropdown title={this.state.displayDate} onSelect={this.handleSelectDate}
								 id="basic-nav-dropdown2">
						{this.buildDateMenuItems()}
					</NavDropdown>
				</Nav>
				<Nav>
					<div>
						{<img src={require('images/right-arrow.png')} alt="logo" style={ImageStyle} onClick={() => this.rightArrowClick()} />}
					</div>
				</Nav>
			</div>
		);
	}
	handleSelectDate(eventKey){
		console.log(JSON.stringify(eventKey));
		if( this.dateKey != eventKey){
			this.dateKey = eventKey
			this.dateSelector = this.dateMenu[eventKey];
			this.dateSelector.setStartEndDate( this );
			this.dateSelector.setDisplayDate(this);
			this.props.dateFilterActions.setDateRange( this.startDate, this.endDate );
		}
	}
	buildDateMenuItems(){
		let menuItems = [];
		menuItems.push(<MenuItem eventKey={this.dateMenu[1].key} key={this.dateMenu[1].key} style={menuStyle}>{this.dateMenu[1].title}</MenuItem>);
		menuItems.push(<MenuItem eventKey={this.dateMenu[2].key} key={this.dateMenu[2].key} style={menuStyle}>{this.dateMenu[2].title}</MenuItem>);
		menuItems.push(<MenuItem eventKey={this.dateMenu[3].key} key={this.dateMenu[3].key} style={menuStyle}>{this.dateMenu[3].title}</MenuItem>);
		return menuItems;
	}


	leftArrowClick(){
		console.log("Decrement Date range")
		this.dateSelector.decrementStartEndDate( );
	}
	rightArrowClick(){
		console.log("Increment Date range")
		this.dateSelector.incrementStartEndDate(  );
	}

}

function mapStateToProps(state) {
	return {
	};
}

function mapDispatchToProps(dispatch) {
	return {
		dateFilterActions: bindActionCreators(dateFilterActions, dispatch),
	};
}

export default withRouter(connect(
	mapStateToProps,
	mapDispatchToProps
)(SemaDateFilter));
