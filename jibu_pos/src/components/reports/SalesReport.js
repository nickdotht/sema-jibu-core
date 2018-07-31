import React, { Component } from 'react';
import { Text, View, StyleSheet, FlatList, Image, TouchableHighlight } from 'react-native';
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import * as reportActions from "../../actions/ReportActions";

const dayInMilliseconds =  24*60*60*1000;

class DateFilter extends Component {
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
class SalesReport extends Component {
	constructor(props) {
		super(props);
		this.beginDate = null;
		this.endDate = null;
	}
	componentDidMount() {
		console.log("SalesReport - componentDidMount");
		this.props.reportActions.GetSalesReportData( this.beginDate, this.endDate);
	}
	render() {
		return (
			<View style ={{flex:1}}>
				<DateFilter parent = {this}/>
				<View style = {{flex:.7, backgroundColor:'white', marginLeft:30, marginRight:30, marginTop:40, }}>
					<FlatList
						data={this.props.salesData.salesItems}
						ListHeaderComponent = {this.showHeader}
						// extraData={this.state.refresh}
						renderItem={({item, index, separators}) => (
							<View >
								{this.getRow(item, index, separators)}
							</View>
						)}
						keyExtractor={item => item.sku}
						initialNumToRender={50}
					/>
				</View>
				<View style = {{flex:.3, backgroundColor:'white', marginLeft:30, marginRight:30, marginBottom:100, }}>
					<View style = {{flex: 1, flexDirection: 'row'}}>
						<Text style={[styles.totalItem, {flex:1.7}]}> </Text>
						<Text style={[styles.totalItem, {flex:.9}]}>Total Liters </Text>
						<Text style={[styles.totalItem, {flex:.6}]}>{this.props.salesData.totalLiters}</Text>
						<Text style={[styles.totalItem, {flex:.7}]}>Total Sales </Text>
						<Text style={[styles.totalItem, {flex:.5}]}>{this.props.salesData.totalSales}</Text>
					</View>
				</View>

			</View>
		);
	}

	getRow = (item)=>{
		console.log("SalesReport - getRow");
		return (
			<View style={[{flex: 1, flexDirection: 'row',  alignItems:'center'},styles.rowBackground]}>
				<View style={ [{flex: 1}]}>
					<Text style={[styles.rowItem,styles.leftMargin]}>{item.sku}</Text>
				</View>
				<View style={[ {flex: .7}]}>
					<Text style={[styles.rowItem]}>{item.quantity}</Text>
				</View>
				<View style={ [ {flex: .7}]}>
					<Text style={[styles.rowItem]}>{item.litersPerSku}</Text>
				</View>
				<View style={ [{flex: .7}]}>
					<Text style={[styles.rowItem]}>{item.totalLiters}</Text>
				</View>
				<View style={ [{flex: .7}]}>
					<Text style={[styles.rowItem]}>{item.pricePerSku}</Text>
				</View>
				<View style={ [{flex: .7}]}>
					<Text style={[styles.rowItem]}>{item.totalSales}</Text>
				</View>
			</View>
		);
	};
	showHeader = () =>{
		return (
			<View style={[{flex: 1, flexDirection: 'row', height:50, alignItems:'center'},styles.headerBackground]}>
				<View style={ [{flex: 1}]}>
					<Text style={[styles.headerItem,styles.leftMargin]}>SKU</Text>
				</View>
				<View style={[ {flex: .7}]}>
					<Text style={[styles.headerItem]}>Quantity</Text>
				</View>
				<View style={ [ {flex: .7}]}>
					<Text style={[styles.headerItem]}>Liters/SKU</Text>
				</View>
				<View style={ [{flex: .7}]}>
					<Text style={[styles.headerItem]}>Total Liters</Text>
				</View>
				<View style={ [{flex: .7}]}>
					<Text style={[styles.headerItem]}>Price/SKU</Text>
				</View>
				<View style={ [{flex: .7}]}>
					<Text style={[styles.headerItem]}>Total Sales</Text>
				</View>
			</View>
		);
	};
	setFilterRange( beginDate, endDate ) {
		this.beginDate = beginDate;
		this.endDate = endDate;
	}
	updateReport(){
		this.props.reportActions.GetSalesReportData( this.beginDate, this.endDate);
	}
}

function mapStateToProps(state, props) {
	return {
		salesData: state.reportReducer.salesData
	};
}

function mapDispatchToProps(dispatch) {
	return {reportActions:bindActionCreators(reportActions, dispatch) };
}

//Connect everything
export default connect(mapStateToProps, mapDispatchToProps)(SalesReport);

const styles = StyleSheet.create({

	headerItem:{
		fontWeight:"bold",
		fontSize:18
	},
	rowItem:{
		fontSize:16,
		paddingLeft:10,
		borderLeftWidth:1,
		borderColor:'black',
		borderTopWidth:1,
		borderBottomWidth:1,
		borderRightWidth:1
	},
	rowBackground:{
		backgroundColor:'white'
	},

	headerBackground:{
		backgroundColor:'white'
	},
	totalItem:{
		fontWeight:"bold",
		fontSize:18,
		paddingLeft:10,
	},
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
