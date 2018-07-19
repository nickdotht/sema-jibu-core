import React, {Component}  from "react"
import { View, Text, FlatList, TouchableHighlight, StyleSheet } from "react-native";
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import * as OrderActions from "../../actions/OrderActions";

class OrderTotal extends Component {
	render() {
		return (
			<View style = {styles.container}>
				<Text style={[{flex: 2}, styles.totalText]}>Order Total</Text>
				<Text style={[{flex: 3}, styles.totalText]}>{this.getAmount()}</Text>

			</View>
		);
	}
	getAmount = () =>{
		return this.props.products.reduce( (total, item) => { return(total + item.quantity * this.getItemPrice(item.product.priceAmount)) }, 0);
	};
	getItemPrice = (amount) =>{
		if( this.props.channel.salesChannel === "walkup"){
			return amount;
		}else{
			return .9* amount;
		}
	}
}

function mapStateToProps(state, props) {
	return {products: state.orderReducer.products,
		channel: state.orderReducer.channel};
}
function mapDispatchToProps(dispatch) {
	return {orderActions: bindActionCreators(OrderActions,dispatch)};
}

export default connect(mapStateToProps, mapDispatchToProps)(OrderTotal);

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
