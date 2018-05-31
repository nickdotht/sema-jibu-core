import React, {Component}  from "react"
import { View, Text, FlatList, TouchableHighlight, StyleSheet } from "react-native";

export default class OrderItems extends Component {
	render() {
		return (
			<View style = {styles.container}/>
		);
	}
}
const styles = StyleSheet.create({
	container: {
		flex: 6,
		backgroundColor:"white",
		borderColor: '#2858a7',
		borderTopWidth:5,
		borderRightWidth:5,

	},

});
