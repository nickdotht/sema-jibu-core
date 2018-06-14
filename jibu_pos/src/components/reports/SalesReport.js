import React, { Component } from 'react';
import { Text, View, StyleSheet, FlatList } from 'react-native';
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import * as reportActions from "../../actions/ReportActions";

class SalesReport extends Component {
	constructor(props) {
		super(props);
	}
	componentDidMount() {
		console.log("---------------------------SalesReport - componentDidMount");
		this.props.reportActions.GetSalesReportData();
	}
	render() {
		return (
			<View style ={{flex:1}}>
				<View style = {{flex:.7, backgroundColor:'white', marginLeft:30, marginRight:30, marginTop:80, }}>
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


});
