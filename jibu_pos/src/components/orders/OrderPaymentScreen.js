import React, {Component}  from "react";
import { View, CheckBox, Text, Image, TouchableHighlight, StyleSheet } from "react-native";

import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import * as OrderActions from "../../actions/OrderActions";

class PaymentDescription extends Component {
	render() {
		return (
			<View style={[{flex: 1, flexDirection: 'row'}]}>
				<View style={ [{flex: 3}]}>
					<Text style={[styles.totalTitle]}>{this.props.title}</Text>
				</View>
				<View style={[ {flex: 1}]}>
					<Text style={[styles.totalValue]}>{this.props.total}</Text>
				</View>
			</View>
		);

	}
}

class OrderPaymentScreen extends Component {
	constructor(props) {
		super(props);

		this.state = {
			isCash: true,
			isCredit: false,
			isMobile:false
		};
	}

	render() {
		return (
			<View style = {styles.orderPayment}>
				<View style ={{justifyContent:'flex-end', flexDirection:"row", right:100, top:20}}>
					<TouchableHighlight
						onPress={() => this.onCancelOrder()}>
						<Image source={require('../../images/icons8-cancel-50.png')}/>
					</TouchableHighlight>
					{/*<Image source={require('../../images/icons8-cancel-50.png')} />;*/}
				</View>
				<View style={{flex:1, marginTop:20, marginBottom:50, marginLeft:200, marginRight:200}}>
					<View style = {styles.checkBoxRow}>
						<CheckBox
							style = {styles.checkBox}
							value={this.state.isCash}
							onValueChange={() => this.setState({ isCash: !this.state.isCash })}/>
						<Text style = {styles.checkLabel} >Cash</Text>
					</View>
					<View style = {styles.checkBoxRow}>
						<CheckBox
							style = {styles.checkBox}
							value={this.state.isCredit}
							onValueChange={() => this.setState({ isCredit: !this.state.isCredit })}/>
						<Text style = {styles.checkLabel} >Credit</Text>
					</View>
					<View style = {styles.checkBoxRow}>
						<CheckBox
							style = {styles.checkBox}
							value={this.state.isMobile}
							onValueChange={() => this.setState({ isMobile: !this.state.isMobile })}/>
						<Text style = {styles.checkLabel} >Mobile</Text>
					</View>
					<PaymentDescription title = "Sale Amount Due:" total={this.calculateOrderDue()}/>
					<PaymentDescription title = "Previous Amount Due:" total={this.calculateAmountDue()}/>
					<PaymentDescription title = "Total Amount Due:" total={this.calculateTotalDue()}/>
					<View style={styles.completeOrder}>
						<View style={{justifyContent:'center', height:100}}>
							<TouchableHighlight
								onPress={() => this.onCompleteOrder()}>
								<Text style={styles.buttonText}>Complete Sale</Text>
							</TouchableHighlight>
						</View>
					</View>
				</View>
			</View>
		);
	}
	calculateOrderDue(){
		return this.props.products.reduce( (total, item) => { return(total + item.quantity * this.getItemPrice(item.product.price_amount)) }, 0);
	}
	calculateAmountDue(){
		return this.props.selectedCustomer.due_amount;
	}

	calculateTotalDue(){
		return this.calculateOrderDue() + this.calculateAmountDue();
	}
	onCompleteOrder = ()=>{

	}
	onCancelOrder =() =>{
		this.props.orderActions.SetOrderFlow('products');
	}
	getItemPrice = (amount) =>{
		if( this.props.channel.salesChannel === "walkup"){
			return amount;
		}else{
			return .9* amount;
		}
	}

}

function mapStateToProps(state, props) {
	return {
		products: state.orderReducer.products,
		channel: state.orderReducer.channel,
		selectedCustomer: state.customerReducer.selectedCustomer};
}
function mapDispatchToProps(dispatch) {
	return {orderActions: bindActionCreators(OrderActions,dispatch)};
}

export default  connect(mapStateToProps, mapDispatchToProps)(OrderPaymentScreen);

const styles = StyleSheet.create({
	orderPayment: {
		flex: 1,
		backgroundColor: "white",
		borderTopColor:'black',
		borderTopWidth:5
	},
	checkBoxRow: {
		flex: 1,
		flexDirection:"row"
	},
	checkBox: {
	},
	checkLabel: {
		left: 50,
		fontSize:18,
	},
	totalSubTotal: {
		flex: 1,
		flexDirection:"row"
	},
	totalTitle: {
		fontSize:18,
	},
	totalValue: {
		fontSize:18,
	},
	completeOrder: {
		backgroundColor:"#2858a7",
		borderRadius:30
		// height:100

	},
	buttonText:{
		fontWeight:'bold',
		fontSize:20,
		alignSelf:'center',
		color:'white'
	}


});
