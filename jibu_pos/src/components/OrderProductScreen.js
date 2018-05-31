import React, {Component}  from "react";
import { View, Text, FlatList, TouchableHighlight, StyleSheet } from "react-native";
import ProductList from "./ProductList";

export default class OrderProductScreen extends Component {
	render() {
		return (
			<View style = {{flex:3, backgroundColor:"green"}}>
				<ProductList/>
			</View>
		);
	}
}



