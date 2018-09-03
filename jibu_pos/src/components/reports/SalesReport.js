import React, { Component } from 'react';
import { Text, View, StyleSheet, FlatList, Image, TouchableHighlight } from 'react-native';
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import * as reportActions from "../../actions/ReportActions";
import DateFilter from "./DateFilter";

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
		if( this.props.reportType === "sales") {
			return (
				<View style={{ flex: 1 }}>
					<DateFilter parent={this}/>
					<View style={{ flex: .7, backgroundColor: 'white', marginLeft: 10, marginRight: 10, marginTop: 40, }}>
						<View style = {styles.titleText}>
							<View style = {styles.leftHeader}>
								<Text style = {styles.titleItem}>Sales</Text>
							</View>
						</View>
						<FlatList
							data={this.props.salesData.salesItems}
							ListHeaderComponent={this.showHeader}
							// extraData={this.state.refresh}
							renderItem={({ item, index, separators }) => (
								<View>
									{this.getRow(item, index, separators)}
								</View>
							)}
							keyExtractor={item => item.sku}
							initialNumToRender={50}
						/>
					</View>
					<View style={{
						flex: .3,
						backgroundColor: 'white',
						marginLeft: 10,
						marginRight: 10,
						marginBottom: 10,
					}}>
						<View style={{ flex: 1, flexDirection: 'row' }}>
							<Text style={[styles.totalItem, { flex: 1.7 }]}> </Text>
							<Text style={[styles.totalItem, { flex: .9 }]}>Total Liters </Text>
							<Text style={[styles.totalItem, { flex: .6 }]}>{this.getTotalLiters()}</Text>
							<Text style={[styles.totalItem, { flex: .7 }]}>Total Sales </Text>
							<Text style={[styles.totalItem, { flex: .5 }]}>{this.getTotalSales()}</Text>
						</View>
					</View>

				</View>
			);
		}else{
			return null;
		}
	}
	getTotalSales (){
		if( this.props.salesData.totalSales ){
			return this.props.salesData.totalSales.toFixed(2);
		}else{
			return 0;
		}
	}

	getTotalLiters(){
		if( this.props.salesData.totalLiters ){
			return this.props.salesData.totalLiters.toFixed(2);
		}else{
			return 0;
		}

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
					<Text style={[styles.rowItem]}>{item.totalLiters.toFixed(2)}</Text>
				</View>
				<View style={ [{flex: .7}]}>
					<Text style={[styles.rowItem]}>{item.pricePerSku}</Text>
				</View>
				<View style={ [{flex: .7}]}>
					<Text style={[styles.rowItem]}>{item.totalSales.toFixed(2)}</Text>
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
	return { salesData: state.reportReducer.salesData,
			 reportType: state.reportReducer.reportType
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
	titleItem:{
		fontWeight:"bold",
		fontSize:24
	},
	titleText: {
		backgroundColor: 'white',
		height: 56,
		flexDirection:'row',

	},

	leftHeader: {
		flexDirection:'row',
		flex:1,
		alignItems:'center'

	},

});
