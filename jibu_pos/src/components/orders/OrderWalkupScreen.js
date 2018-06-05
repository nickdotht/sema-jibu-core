import React, {Component}  from "react";
import { View } from "react-native";
import ProductList from "./ProductList";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import * as OrderActions from "../../actions/OrderActions";

class OrderWalkupScreen extends Component {
	componentDidMount() {
		this.props.navigation.addListener('didFocus', () => {
			console.log("OrderWalkupScreen-Focused")
			this.props.orderActions.SetOrderChannel("walkup");
		});
	}

	render() {
		return (
			<View style = {{flex:1, backgroundColor:'#ABC1DE'}}>
				<ProductList filter='walkup' />
			</View>
		);
	}
}

function mapStateToProps(state, props) {
	return {
		products: state.orderReducer.products,
		channel: state.orderReducer.channel};
}
function mapDispatchToProps(dispatch) {
	return {orderActions: bindActionCreators(OrderActions,dispatch)};
}

export default  connect(mapStateToProps, mapDispatchToProps)(OrderWalkupScreen);
