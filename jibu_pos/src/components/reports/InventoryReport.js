import React, { Component } from 'react';
import { Text, View, StyleSheet, TouchableHighlight, FlatList, Modal, TextInput} from 'react-native';
import { bindActionCreators } from "redux";
import * as reportActions from "../../actions/ReportActions";
import { connect } from "react-redux";
import DateFilter from "./DateFilter";

class InventoryEdit extends Component {
	constructor(props) {
		super(props);
	}
	render() {
		return (
			<Modal visible = {this.isVisible()}
				   transparent ={true}
				   onRequestClose ={this.closeCurrentSkuHandler.bind(this)}>
				<View style={{ justifyContent: 'center', alignItems: 'center' }}>

					<View style={[styles.editInventory]}>
						<View style={{marginTop:5}}>
							<Text style={{fontSize:28, fontWeight:'bold'}}>Inventory</Text>
						</View>
						<View style={{flexDirection:'row',alignItems: 'center', justifyContent:'center', marginTop:20}}>
							<Text style={{fontSize:18, fontWeight:'bold', flex:.7, paddingLeft:20}}>{this.props.title}</Text>
							<TextInput
								style={ [styles.inventoryInput, {flex:.5, paddingRight:40, marginRight:20 }]}
								underlineColorAndroid='transparent'
								onSubmitEditing = {() => this.props.okMethod()}
								keyboardType = 'numeric'
								placeholder = "Current Value">

							</TextInput>
						</View>
						<View style={{flexDirection:'row',  justifyContent:'center', marginTop:20}}>
							<View style={{backgroundColor:"#2858a7", borderRadius:10, flex:.3}}>
								<TouchableHighlight underlayColor = '#c0c0c0' onPress={() => this.props.okMethod()}>
									<Text style={styles.buttonText}>Ok</Text>
								</TouchableHighlight>
							</View>
							<View style={{flex:.1,backgroundColor:'white'}}>
							</View>
							<View style={{backgroundColor:"#2858a7", borderRadius:10, flex:.3 }}>
								<TouchableHighlight underlayColor = '#c0c0c0' onPress={() => this.props.cancelMethod()}>
									<Text style={styles.buttonText}>Cancel</Text>
								</TouchableHighlight>
							</View>
						</View>
					</View>
				</View>
			</Modal>
		);

	}
	closeCurrentSkuHandler(){
		this.props.cancelMethod();
	};
	isVisible(){
		if(this.props.type === "sku"){
			return this.props.skuToShow === this.props.title;
		}else if(this.props.type === "currentMeter" ){
			return this.props.visible;
		}else{
			return false;
		}

	}
}

class InventoryReport extends Component {
	constructor(props) {
		super(props);
		this.beginDate = null;
		this.endDate = null;
		this.state = {
			currentSkuEdit:"",
			refresh: false,
			currentMeterVisible:false
		};
	}

	componentDidMount() {
		console.log("InventoryReport - componentDidMount");
		this.props.reportActions.GetSalesReportData(this.beginDate, this.endDate);
		this.props.reportActions.GetInventoryReportData(this.beginDate, this.endDate, this.props.products);
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
							extraData={this.state.refresh}
							ListHeaderComponent={this.showHeader}
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
							<Text style={[styles.totalItem, { flex: 1.5 }]}> </Text>
							<Text style={[styles.totalItem, { flex: .5 }]}>Total Sales </Text>
							<Text style={[styles.totalItem, { flex: 1.0 }]}>{this.getTotalLiters()}</Text>
							<Text style={[styles.totalItem, { flex: .8 }]}>Total Inventory </Text>
							<Text style={[styles.totalItem, { flex: .6 }]}>{this.getTotalSales()}</Text>
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
							<Text style={[styles.rowItem, { flex: .33 }]}>{this.getInventoryMeterForDisplay(false)}</Text>
							{this.getCurrentMeter()}
							{/*<Text style={[styles.rowItem, { flex: .33 }]}>65001 </Text>*/}
							<Text style={[styles.rowItem, { flex: .33 }]}>65002</Text>
						</View>
						<View style={{ flex: 1, flexDirection: 'row', marginTop:15, marginBottom:10 }}>
							<Text style={[styles.totalItem, { flex: .66 }]}> </Text>
							<Text style={[styles.totalItem, { flex: .33 }]}>Wastage: </Text>
							<Text style={[styles.totalItem, { flex: .33 }]}>5001 </Text>
						</View>
						<InventoryEdit
							type = "currentMeter"
							visible = {this.state.currentMeterVisible}
							title = "Current Meter"
							cancelMethod = {this.onCancelCurrentMeter.bind(this)}
							okMethod = {this.onOkCurrentMeter.bind(this)}>
						</InventoryEdit>
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
					<Text style={[styles.rowItem]}>{this.getInventorySkuForDisplay(false, item)}</Text>
				</View>
				{this.getCurrentInventory(item)}
				<View style={[{ flex: .7 }]}>
					<Text style={[styles.rowItem]}>{item.totalSales.toFixed(2)}</Text>
				</View>
				<InventoryEdit
					type = "sku"
					skuToShow = {this.state.currentSkuEdit}
					title = {item.sku}
					cancelMethod = {this.onCancelEditCurrentSku.bind(this)}
					okMethod = {this.onOkEditCurrentSku.bind(this)}>
				</InventoryEdit>
			</View>
		);
	};

	onCancelEditCurrentSku(){
		this.setState({currentSkuEdit:""});
		this.setState({refresh: !this.state.refresh});
	}

	onOkEditCurrentSku(){
		this.setState({currentSkuEdit:""});
		this.setState({refresh: !this.state.refresh});
	}




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
					onPress= {() => this.displayEditCurrentSku( item.sku)}
					underlayColor='#18376A'>
					<Text style={[styles.currentInventoryText]}>{ this.getInventorySkuForDisplay(true, item)}</Text>
				</TouchableHighlight>
			</View>
		);
	}
	getInventorySkuForDisplay(currentPrev, item ){
		let inventoryArray = (currentPrev) ? this.props.inventoryData.currentProductSkus : this.props.inventoryData.previousProductSkus;
		for( let index = 0; index < inventoryArray.length; index ++ ){
			if( inventoryArray[index].sku === item.sku ){
				if( !isNaN(inventoryArray[index].inventory)){
					return inventoryArray[index].inventory;
				}
				break;
			}
		}
		return "-";		// No data
	}
	displayEditCurrentSku(sku){
		this.setState({currentSkuEdit:sku});
		this.setState({refresh: !this.state.refresh});
	}
	getCurrentMeter( value ){
		return (
			<View style={[{ flex: .33}]}>
				<TouchableHighlight
					style={styles.currentInventory}
					onPress={() => {this.displayCurrentMeter()}}
					underlayColor='#18376A'>
					<Text style={[styles.currentInventoryText]}>{this.getInventoryMeterForDisplay(true)}</Text>
				</TouchableHighlight>
			</View>
		);
	}

	getInventoryMeterForDisplay(currentPrev ){
		let meter = (currentPrev) ? this.props.inventoryData.currentMeter : this.props.inventoryData.previousMeter;
		if( !isNaN(meter)){
			return meter;
		}else{
			return "-";		// No data
		}
	}

	displayCurrentMeter(){
		this.setState({currentMeterVisible:true});

	}
	onCancelCurrentMeter(){
		this.setState({currentMeterVisible:false});

	}
	onOkCurrentMeter(){
		this.setState({currentMeterVisible:false});

	}

}


function mapStateToProps(state, props) {
	return {
		salesData: state.reportReducer.salesData,
		inventoryData: state.reportReducer.inventoryData,
		products: state.productReducer.products,
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
	editInventory: {
		height:300,
		width:500,
		justifyContent: 'space-evenly',
		alignItems: 'center',
		backgroundColor:'white',
		borderColor:"#2858a7",
		borderWidth:5,
		borderRadius:10
	},
	buttonText:{
		fontWeight:'bold',
		fontSize:28,
		color:'white',
		textAlign:'center',
		// width:180
	},
	inventoryInput : {
		textAlign: 'left',
		height: 50,
		width: 100,
		borderWidth: 2,
		fontSize: 20,
		borderColor: '#404040',
	}
});
