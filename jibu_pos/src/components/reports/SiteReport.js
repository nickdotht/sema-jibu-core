import React, { Component } from 'react';
import { Text, View, StyleSheet, TouchableHighlight} from 'react-native';
import * as colors from '../../styles/sema_colors';
import SalesReport from './SalesReport';


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

});
