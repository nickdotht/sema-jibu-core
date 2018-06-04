import React, {Component}  from "react";
import { View, Text, FlatList, TouchableHighlight, StyleSheet } from "react-native";
import ProductList from "./ProductList";
import {createBottomTabNavigator} from "react-navigation";

class OrderWalkupScreen extends Component {
	componentWillUpdate(nextProps, nextState){
		console.log( "componentWillUpdate- OrderWalkupScreen. Focused: " + nextProps.navigation.isFocused());
	}
	render() {
		return (
			<View style = {{flex:1, backgroundColor:'#ABC1DE'}}>
				<ProductList filter='walkup' />
			</View>
		);
	}
}

class OrderResellerScreen extends Component {
	componentWillUpdate(nextProps, nextState){
		console.log( "componentWillUpdate- OrderResellerScreen. Focused: " + nextProps.navigation.isFocused());
	}
	render() {
		return (
			<View style = {{flex:1, backgroundColor:'#ABC1DE'}}>
				<ProductList filter='reseller' />
			</View>
		);
	}
}


export const OrderProductScreen = createBottomTabNavigator({
	Walkup: {
		screen: OrderWalkupScreen,
		navigationOptions: {
			tabBarLabel: 'Walkup',
			tabBarOnPress: (scene, jumpToIndex) => {
				let parent = scene.navigation.dangerouslyGetParent();
				let output = "Walkup-Tab " + scene.navigation.state.routeName;
				console.log(output);
			},
		},

	},

	Reseller: {
		screen: OrderResellerScreen,
		navigationOptions: {
			tabBarLabel: 'Reseller',
			tabBarOnPress: (scene, jumpToIndex) => {
				let output = "Reseller-Tab " + scene.navigation.state.routeName;
				console.log(output);
			},
		},

	},

},{
	swipeEnabled: true,
	tabBarOptions: {
		activeTintColor: '#F0F0F0',
		activeBackgroundColor: "#18376A",
		inactiveTintColor: '#000000',
		inactiveBackgroundColor: 'white',
		style: { borderTopColor:'black', borderTopWidth:3},
		// style: {padding:0, margin:0, borderColor:'red', borderWidth:5, justifyContent: 'center', alignItems: 'center' },
		labelStyle: {
			fontSize: 18,
			padding: 12
		},
		tabStyle: {justifyContent: 'center', alignItems: 'center'},
	}
});
