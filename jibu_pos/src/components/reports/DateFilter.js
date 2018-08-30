import React, { Component } from 'react';
import { Text, View, Image, TouchableHighlight, StyleSheet } from 'react-native';

const dayInMilliseconds =  24*60*60*1000;

export default class DateFilter extends Component {
	constructor(props) {
		super(props);
		let currentDate = new Date();
		this.state = {currentDate :new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() )};
		this.maxDate = new Date( this.state.currentDate.getTime() + dayInMilliseconds );
		this.minDate = new Date( this.maxDate.getTime() - 30 * dayInMilliseconds );
		this.props.parent.setFilterRange( this.state.currentDate, new Date( this.state.currentDate.getTime() + dayInMilliseconds) );
		console.log( "DateFilter - maxDate = " + this.maxDate.toString());
		console.log( "DateFilter - minDate = " + this.minDate.toString());


	}
	render() {
		return (
			<View style={styles.filterContainer}>
				<View style={styles.filterItemContainer}>
					<Text style={{fontSize:20}}>Daily Data</Text>
				</View>
				<View style={styles.filterItemContainer}>
					{this.getPreviousButton()}
				</View>
				<View style={styles.filterItemContainer}>
					<Text style={{fontSize:20}}>{this.state.currentDate.toDateString()}</Text>
				</View>
				<View style={styles.filterItemContainer}>
					{this.getNextButton()}
				</View>
			</View>
		)
	}
	getPreviousButton(){
		const prevDate = new Date( this.state.currentDate.getTime() - dayInMilliseconds );
		if( prevDate > this.minDate){
			return (
				<TouchableHighlight onPress={() => this.onPreviousDay()}>
					<Image source={require('../../images/left-arrow.png')} style={styles.filterImage}/>
				</TouchableHighlight>
			)
		}else{
			return (
				<Image source={require('../../images/left-arrow.png')} style={[styles.filterImage, {opacity:.4 }]}/>
			);
		}
	}
	getNextButton(){
		const nextDate = new Date( this.state.currentDate.getTime() + dayInMilliseconds );
		if( nextDate < this.maxDate){
			return (
				<TouchableHighlight onPress={() => this.onNextDay()}>
					<Image source={require('../../images/right-arrow.png')} style={styles.filterImage}/>
				</TouchableHighlight>
			)
		}else{
			return (
				<Image source={require('../../images/right-arrow.png')} style={[styles.filterImage, {opacity:.4 }]}/>
			);
		}
	}


	onPreviousDay(){
		this.setState({currentDate:new Date(this.state.currentDate.getTime() - dayInMilliseconds) }, () => this.update());
	}
	onNextDay(){
		this.setState({currentDate:new Date(this.state.currentDate.getTime() + dayInMilliseconds) }, () => this.update());
	}

	update(){
		const beginDate = this.state.currentDate;
		const endDate = new Date( beginDate.getTime() + dayInMilliseconds );
		this.props.parent.setFilterRange( this.state.currentDate, new Date( this.state.currentDate.getTime() + dayInMilliseconds) );
		this.props.parent.updateReport();
		console.log( "Filter-From " + beginDate.toDateString() + " to " + endDate.toDateString());
	}
}
const styles = StyleSheet.create({

	filterContainer:{
		flex: .15,
		backgroundColor: 'white',
		marginLeft: 30,
		marginTop: 20,
		flexDirection:'row',
		width:500
	},
	filterItemContainer:{
		justifyContent:"center",
		paddingLeft:20
	},
	filterImage:{
		width: 30,
		height: 30
	}

});
