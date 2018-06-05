import React, {Component}  from "react"
import { View, Text, Button, TouchableHighlight, StyleSheet } from "react-native";
import * as OrderActions from "../../actions/OrderActions";
import {bindActionCreators} from "redux";
import {connect} from "react-redux";

class OrderCheckout extends Component {
	render() {
		return (
			<View style={styles.container}>
				<View style={[{flex: 1, justifyContent:'center'}, this.getOpacity()]}>
					<TouchableHighlight
						onPress={() => this.onPay()}>
						<Text style={[{ color:'white'}, styles.buttonText]}>Pay</Text>
					</TouchableHighlight>
				</View>
			</View>
		);
	}
	onPay = ()=>{
		console.log("onPay");
	}
	getOpacity = ()=>{
		if( this.props.products.length == 0 ){
			return {opacity:.3};
		}else{
			return {opacity:1};
		}
	}
}

function mapStateToProps(state, props) {
	return {products: state.orderReducer.products};
}
function mapDispatchToProps(dispatch) {
	return {orderActions: bindActionCreators(OrderActions,dispatch)};
}
export default connect(mapStateToProps, mapDispatchToProps)(OrderCheckout);


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
