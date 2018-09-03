import React, { Component } from 'react';
import { Text, View, StyleSheet, TouchableHighlight, FlatList} from 'react-native';
import { bindActionCreators } from "redux";
import * as reportActions from "../../actions/ReportActions";
import { connect } from "react-redux";
import DateFilter from "./DateFilter";

class InventoryReport extends Component {
	constructor(props) {
		super(props);
		this.beginDate = null;
		this.endDate = null;
	}

	componentDidMount() {
		console.log("InventoryReport - componentDidMount");
		this.props.reportActions.GetSalesReportData(this.beginDate, this.endDate);
	}

	render() {
		if (this.props.reportType === "inventory") {
			return (
				<View style={{ flex: 1 }}>
					<DateFilter parent={this}/>
					<View style={{ flex: .7, backgroundColor: 'white', marginLeft: 10, marginRight: 10, marginTop: 40, }}>
						<View style = {styles.titleText}>
							<View style = {styles.leftHeader}>
								<Text style = {styles.titleItem}>Sales</Text>
							</View>
							<View style = {styles.rightHeader}>
								<Text style = {styles.titleItem}>Inventory</Text>
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

						{/*<View style = {styles.titleContent}>*/}
							{/*<View style = {styles.leftContent}>*/}
								{/*<FlatList*/}
									{/*data={this.props.salesData.salesItems}*/}
									{/*ListHeaderComponent={this.showSalesHeader}*/}
									{/*// extraData={this.state.refresh}*/}
									{/*renderItem={({ item, index, separators }) => (*/}
										{/*<View>*/}
											{/*{this.getSalesRow(item, index, separators)}*/}
										{/*</View>*/}
									{/*)}*/}
									{/*keyExtractor={item => item.sku}*/}
									{/*initialNumToRender={50}*/}
								{/*/>*/}
							{/*</View>*/}
							{/*<View style = {styles.rightContent}>*/}
								{/*<FlatList*/}
									{/*data={this.props.salesData.salesItems}*/}
									{/*ListHeaderComponent={this.showInventoryHeader}*/}
									{/*// extraData={this.state.refresh}*/}
									{/*renderItem={({ item, index, separators }) => (*/}
										{/*<View>*/}
											{/*{this.getInventoryRow(item, index, separators)}*/}
										{/*</View>*/}
									{/*)}*/}
									{/*keyExtractor={item => item.sku}*/}
									{/*initialNumToRender={50}*/}
								{/*/>*/}
							{/*</View>*/}
						{/*</View>*/}
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
							<Text style={[styles.totalItem, { flex: .7 }]}>Total Inventory </Text>
							<Text style={[styles.totalItem, { flex: .5 }]}>{this.getTotalSales()}</Text>
						</View>
						<View style={{ flex: 1, flexDirection: 'row', marginTop:15 }}>
							<Text style={[styles.totalItem, { flex: 1.7 }]}> </Text>
							<Text style={[styles.totalItem, { flex: .4}]}>Output</Text>
							<Text style={[styles.totalItem, { flex: 1.0 }]}>(Sales + Inventory)</Text>
							<Text style={[styles.totalItem, { flex: .5 }]}>1000L </Text>
						</View>
						<View style={{ flex: 1, flexDirection: 'row', marginTop:15, alignItems:"center" }}>
							<Text style={[styles.totalItem, { flex: .50 }]}> </Text>
							<Text style={[styles.production, { flex: .33}]}>Production</Text>
							<Text style={[styles.totalItem, { flex: .33 }]}>Previous Meter</Text>
							<Text style={[styles.totalItem, { flex: .33 }]}>Current Meter </Text>
							<Text style={[styles.totalItem, { flex: .33 }]}>Total Production </Text>
						</View>

						<View style={[{ flex: 1, flexDirection: 'row', alignItems:"center", marginTop:5 }]}>
							<Text style={[styles.totalItem, { flex: .83 }]}> </Text>
							<Text style={[styles.rowItem, { flex: .33 }]}>65000</Text>
							{this.getCurrentMeter(100)}
							{/*<Text style={[styles.rowItem, { flex: .33 }]}>65001 </Text>*/}
							<Text style={[styles.rowItem, { flex: .33 }]}>65002</Text>
						</View>
						<View style={{ flex: 1, flexDirection: 'row', marginTop:15, marginBottom:10 }}>
							<Text style={[styles.totalItem, { flex: .66 }]}> </Text>
							<Text style={[styles.totalItem, { flex: .33 }]}>Wastage: </Text>
							<Text style={[styles.totalItem, { flex: .33 }]}>5001 </Text>
						</View>
					</View>
				</View>
			);
		} else {
			return null;
		}
	}

	getTotalSales() {
		if (this.props.salesData.totalSales) {
			return this.props.salesData.totalSales.toFixed(2);
		} else {
			return 0;
		}
	}

	getTotalLiters() {
		if (this.props.salesData.totalLiters) {
			return this.props.salesData.totalLiters.toFixed(2);
		} else {
			return 0;
		}

	}

	getRow = (item) => {
		console.log("SalesReport - getRow");
		return (
			<View style={[{ flex: 1, flexDirection: 'row', alignItems: 'center' }, styles.rowBackground]}>
				<View style={[{ flex: 1 }]}>
					<Text style={[styles.rowItem, styles.leftMargin]}>{item.sku}</Text>
				</View>
				<View style={[{ flex: .7 }]}>
					<Text style={[styles.rowItem]}>{item.quantity}</Text>
				</View>
				<View style={[{ flex: .7 }]}>
					<Text style={[styles.rowItem]}>{item.litersPerSku}</Text>
				</View>
				<View style={[{ flex: .7 }]}>
					<Text style={[styles.rowItem]}>{item.totalLiters.toFixed(2)}</Text>
				</View>
				<View style ={[{width:20}]}/>

				<View style={[{ flex: .7 }]}>
					<Text style={[styles.rowItem]}>{item.totalLiters.toFixed(2)}</Text>
				</View>
				{this.getCurrentInventory(item)}
				<View style={[{ flex: .7 }]}>
					<Text style={[styles.rowItem]}>{item.totalSales.toFixed(2)}</Text>
				</View>
			</View>
		);
	};

	// getSalesRow = (item) => {
	// 	console.log("SalesReport - getRow");
	// 	return (
	// 		<View style={[{ flex: 1, flexDirection: 'row', alignItems: 'center' }, styles.rowBackground]}>
	// 			<View style={[{ flex: 1 }]}>
	// 				<Text style={[styles.rowItem, styles.leftMargin]}>{item.sku}</Text>
	// 			</View>
	// 			<View style={[{ flex: .7 }]}>
	// 				<Text style={[styles.rowItem]}>{item.quantity}</Text>
	// 			</View>
	// 			<View style={[{ flex: .7 }]}>
	// 				<Text style={[styles.rowItem]}>{item.litersPerSku}</Text>
	// 			</View>
	// 			<View style={[{ flex: .7 }]}>
	// 				<Text style={[styles.rowItem]}>{item.totalLiters.toFixed(2)}</Text>
	// 			</View>
	// 		</View>
	// 	);
	// };
	showHeader = () => {
		return (
			<View
				style={[{ flex: 1, flexDirection: 'row', height: 50, alignItems: 'center' }, styles.headerBackground]}>
				<View style={[{ flex: 1 }]}>
					<Text style={[styles.headerItem, styles.leftMargin]}>SKU</Text>
				</View>
				<View style={[{ flex: .7 }]}>
					<Text style={[styles.headerItem]}>Quantity</Text>
				</View>
				<View style={[{ flex: .7 }]}>
					<Text style={[styles.headerItem]}>Liters/SKU</Text>
				</View>
				<View style={[{ flex: .7 }]}>
					<Text style={[styles.headerItem]}>Total Liters</Text>
				</View>
				<View style ={[{width:20}]}/>
				<View style={[{ flex: .7 }]}>
					<Text style={[styles.headerItem]}>Previous</Text>
				</View>
				<View style={[{ flex: .7 }]}>
					<Text style={[styles.headerItem]}>Current</Text>
				</View>
				<View style={[{ flex: .7 }]}>
					<Text style={[styles.headerItem]}>Total Liters</Text>
				</View>
			</View>
		);
	};

	// showSalesHeader = () => {
	// 	return (
	// 		<View
	// 			style={[{ flex: 1, flexDirection: 'row', height: 50, alignItems: 'center' }, styles.headerBackground]}>
	// 			<View style={[{ flex: 1 }]}>
	// 				<Text style={[styles.headerItem, styles.leftMargin]}>SKU</Text>
	// 			</View>
	// 			<View style={[{ flex: .7 }]}>
	// 				<Text style={[styles.headerItem]}>Quantity</Text>
	// 			</View>
	// 			<View style={[{ flex: .7 }]}>
	// 				<Text style={[styles.headerItem]}>Liters/SKU</Text>
	// 			</View>
	// 			<View style={[{ flex: .7 }]}>
	// 				<Text style={[styles.headerItem]}>Total Liters</Text>
	// 			</View>
	// 		</View>
	// 	);
	// };

	// showInventoryHeader = () => {
	// 	return (
	// 		<View style={[{ flex: 1, flexDirection: 'row', height: 50, alignItems: 'center' }, styles.headerBackground]}>
	// 			<View style={[{ flex: .7 }]}>
	// 				<Text style={[styles.headerItem]}>Previous</Text>
	// 			</View>
	// 			<View style={[{ flex: .7 }]}>
	// 				<Text style={[styles.headerItem]}>Current</Text>
	// 			</View>
	// 			<View style={[{ flex: .7 }]}>
	// 				<Text style={[styles.headerItem]}>Total Liters</Text>
	// 			</View>
	// 		</View>
	// 	);
	// };
	// getInventoryRow = (item) => {
	// 	console.log("SalesReport - getRow");
	// 	return (
	// 		<View style={[{ flex: 1, flexDirection: 'row', alignItems: 'center' }, styles.rowBackground]}>
	// 			<View style={[{ flex: .7 }]}>
	// 				<Text style={[styles.rowItem]}>{item.totalLiters.toFixed(2)}</Text>
	// 			</View>
	// 			{this.getCurrentInventory(item)}
	// 			<View style={[{ flex: .7 }]}>
	// 				<Text style={[styles.rowItem]}>{item.totalSales.toFixed(2)}</Text>
	// 			</View>
	// 		</View>
	// 	);
	// };

	setFilterRange(beginDate, endDate) {
		this.beginDate = beginDate;
		this.endDate = endDate;
	}

	updateReport() {
		this.props.reportActions.GetSalesReportData(this.beginDate, this.endDate);
	}

	getCurrentInventory( item ){
		return (
			<View style={[{ flex: .7}]}>
			<TouchableHighlight
					style={styles.currentInventory}
					onPress={() => {}}
					underlayColor='#18376A'>
					<Text style={[styles.currentInventoryText]}>{item.pricePerSku}</Text>
				</TouchableHighlight>
			</View>
			// <View style={[{ flex: .7, backgroundColor:'pink'}]}>
			// 	<Text style={[styles.rowItem]}>{item.pricePerSku}</Text>
			// </View>
		);
	}

	getCurrentMeter( value ){
		return (
			<View style={[{ flex: .33}]}>
				<TouchableHighlight
					style={styles.currentInventory}
					onPress={() => {}}
					underlayColor='#18376A'>
					<Text style={[styles.currentInventoryText]}>{value}</Text>
				</TouchableHighlight>
			</View>
			// <View style={[{ flex: .7, backgroundColor:'pink'}]}>
			// 	<Text style={[styles.rowItem]}>{item.pricePerSku}</Text>
			// </View>
		);
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

export default connect(mapStateToProps, mapDispatchToProps)(InventoryReport);

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
		flex:.62,
		alignItems:'center'

	},
	rightHeader: {
		flexDirection:'row-reverse',
		flex:.38,
		alignItems:'center',
		justifyContent:'flex-end'

	},
	titleContent: {
		backgroundColor: 'white',
		flexDirection:'row',
		justifyContent: 'space-between',
	},
	leftContent: {
		flexDirection:'row',
		flex:.6,
		alignItems:'center'

	},
	rightContent: {
		flexDirection:'row-reverse',
		flex:.38,
		alignItems:'center'

	},

	currentInventory:{
		marginRight:2,
		marginLeft:2,
		// marginTop:2,
		// paddingTop:2,
		// paddingBottom:2,
		backgroundColor:'#2858a7',
		borderRadius:5,
		borderWidth: 1,
		borderColor: '#fff'
	},
	currentInventoryText:{
		fontSize:16,
		color:'#fff',
		textAlign:'center',
	},
	production:{
		fontWeight:"bold",
		fontSize:24,
	},

});
