import React, {Component}  from "react";
import {Dimensions, View} from "react-native";
import ProductList from "./ProductList";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import * as OrderActions from "../../actions/OrderActions";
import PosStorage from "../../database/PosStorage";

class OrderWalkupScreen extends Component {
	constructor(props) {
		super(props);
		let {height, width} = Dimensions.get('window');
		console.log("OrderWalkupScreen Constructor: Width-" +width);
		// Empirically we know that this view has flex of 1 and the view beside it,
		// (OrderSummaryScreen has a flex of .6 This makes the width of this view 1/1.6 * screen width
		// Since there is no way to dynamilcally determine view width until the layout is complete, use
		// this to set width. (Note this will break if view layout changes
		this.viewWidth = 1/1.6 * width;
	}

	componentDidMount() {
		if( this.props.selectedCustomer ){
			let salesChannel = PosStorage.getSalesChannelFromName("reseller");
			if( salesChannel && salesChannel.id ==  this.props.selectedCustomer.salesChannelId)
				this.props.navigation.navigate("Reseller");
		}
		this.props.navigation.addListener('didFocus', () => {
			console.log("OrderWalkupScreen-Focused")
			this.props.orderActions.SetOrderChannel("walkup");
		});
	}

	render() {
		return (
			<View style = {{flex:1, backgroundColor:'#ABC1DE'}}>
				<ProductList filter='walkup' viewWidth ={this.viewWidth} />
			</View>
		);
	}
}

function mapStateToProps(state, props) {
	return {
		products: state.orderReducer.products,
		selectedCustomer: state.customerReducer.selectedCustomer,
		channel: state.orderReducer.channel};
}
function mapDispatchToProps(dispatch) {
	return {orderActions: bindActionCreators(OrderActions,dispatch)};
}

export default  connect(mapStateToProps, mapDispatchToProps)(OrderWalkupScreen);
