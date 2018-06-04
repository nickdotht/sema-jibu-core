import React, {Component}  from "react"
import { View, Text, Button, TouchableHighlight, StyleSheet } from "react-native";

export default class OrderCheckout extends Component {
	render() {
		return (
			<View style={styles.container}>
					<View style={{flex: 1, justifyContent:'center' }}>
						<TouchableHighlight
							onPress={() => this.onPay()}>
							<Text style={[{ color:'white'}, styles.buttonText]}>Pay</Text>
						</TouchableHighlight>
					</View>
				{/*<Button*/}
					{/*onPress={this.onPay}*/}
					{/*title='Pay'*/}
					{/*color='#2858a7'*/}
					{/*style={ {flex:1}}*/}
					{/*// disabled = {!this.props.enabled}*/}
				{/*/>*/}
			</View>
		);
	}
	onPay = ()=>{
		console.log("onPay");
	}
}



const styles = StyleSheet.create({

	container: {
		flex: 2,
		backgroundColor:"#2858a7",

	},
	buttonText:{
		fontWeight:'bold',
		fontSize:30,
		alignSelf:'center',
	}

});
