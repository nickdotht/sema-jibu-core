import React from "react";
import { View, Button, StyleSheet} from 'react-native';
import {OrderProductScreen} from "./OrderProductScreen";
import OrderSummaryScreen from "./OrderSummaryScreen";

export default class OrderView extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		return this.displayView();
	}
	displayView (){
		return (
			<View style = {{flex:1, backgroundColor:"pink", flexDirection:'row'}}>
				<OrderProductScreen screenProps={{orderView: this}}/>
				<OrderSummaryScreen/>
			</View>
		);

	}
}
