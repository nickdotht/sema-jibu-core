import React, {Component}  from "react"
import { View, Text, FlatList, TouchableHighlight, StyleSheet } from "react-native";

export default class OrderTotal extends Component {
	render() {
		return (
			<View style = {styles.container}>
				<Text style={[{flex: 2}, styles.totalText]}>Order Total</Text>
				<Text style={[{flex: 3}, styles.totalText]}>$1500</Text>

			</View>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 2,
		backgroundColor:"#e0e0e0",
		borderColor: '#2858a7',
		borderTopWidth:5,
		borderRightWidth:5,

	},
	totalText:{
		marginTop:10,
		fontWeight:'bold',
		fontSize:18,
		color:'black',
		alignSelf:'center'
	}

});
