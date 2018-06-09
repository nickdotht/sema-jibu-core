import React, { Component } from 'react';
import { Text, View, StyleSheet, TouchableHighlight, FlatList } from 'react-native';
import * as colors from '../../styles/sema_colors'
import PosStorage from '../../database/PosStorage'

export default class SiteReport extends Component {
	render() {
		return (
			<View style = {{flex:1, flexDirection:'row'}}>
				<Sidebar/>
				<Report/>
			</View>
		);
	}
}

class Sidebar extends Component {
	render() {
		return (
			<View style ={{flex:1,backgroundColor:colors.COLOR_REPORT_SIDEBAR_BACKGROUND}}>
				<TouchableHighlight onPress={() => this.onSales()}>
					<Text style ={[styles.menuText, {color:'#3C93FC'}]}>Sales</Text>
				</TouchableHighlight>
				<TouchableHighlight onPress={() => this.onInventory()}>
					<Text style ={[styles.menuText, ]}>Inventory</Text>
				</TouchableHighlight>
			</View>
		);
	}

	onSales = () =>{

	};
	onInventory = () =>{

	};
}

class Report extends Component {
	render() {
		return (
			<View style ={{flex:4,backgroundColor:colors.COLOR_REPORT__BACKGROUND}}>
				<SalesReport/>
				<InventoryReport/>
			</View>
		);
	}
}

class SalesReport extends Component {
	constructor(props) {
		super(props);
		this.state = {
			salesData: []
		}
	}
	componentDidMount() {
		this.getSalesData();
	}
	render() {
		return (
			<View style ={{flex:1}}>
				<View style = {{flex:1, backgroundColor:'white', marginLeft:30, marginRight:30, marginTop:80, }}>
					<FlatList
						data={this.state.salesData}
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
			</View>
		);
	}
	getSalesData = () =>{
		let results = new Map();
		let sales = PosStorage.GetSales();
		sales.every( saleKey =>{
			PosStorage.LoadSale( saleKey ).then( sale => {
				sale.products.every( product =>{
					let mapProduct = results.get(product.sku);
					if( mapProduct ){
						mapProduct.quantity += product.quantity;
						mapProduct.totalSales += product.quantity * product.price_amount;
					}else{
						mapProduct = {
							sku: product.description,
							quantity: product.quantity,
							pricePerSku: product.price_amount,
							totalSales: product.quantity * product.price_amount,
							litersPerSku: 'N/A',
							totalLiters: 'N/A',
						}
						results.set(product.sku, mapProduct );
					}
				});
				let displayItems = [];
				results.forEach( value =>{
					displayItems.push( value );
				});
				var dummy = this;
				if( this.state.salesData.length ===0 && displayItems.length > 0  ) {
					setTimeout(() => {
						dummy.setState({salesData: displayItems})
					}, 20);
				}
			});
		});
	};

	// productSale.id = product.product.id;
	// productSale.gallons =  product.product.gallons;

	getRow = (item)=>{
		console.log("SalesReport - getRow");
		return (
			<View style={[{flex: 1, flexDirection: 'row', height:50, alignItems:'center'},styles.rowBackground]}>
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
class InventoryReport extends Component {
	// TODO Implement this
	render() {
		return null;
	}
}

const styles = StyleSheet.create({

	container: {
		flex: 2,
		backgroundColor:"#2858a7",

	},
	menuText:{
		marginLeft:20,
		marginTop:15,
		color:'white',
		fontWeight:'bold',
		fontSize:20,
	},
	headerItem:{
		fontWeight:"bold",
		fontSize:18
	},
	rowItem:{
		fontSize:16
	},
	rowBackground:{
		backgroundColor:'white'
	},

	headerBackground:{
		backgroundColor:'white'
	},


});
