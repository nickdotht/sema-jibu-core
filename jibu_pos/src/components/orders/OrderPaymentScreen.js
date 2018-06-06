import React, {Component}  from "react";
import { View, CheckBox, Text, Image, TouchableHighlight, TextInput, StyleSheet, Modal } from "react-native";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import * as OrderActions from "../../actions/OrderActions";
import * as CustomerBarActions from "../../actions/CustomerBarActions";

class PaymentDescription extends Component {
	render() {
		return (
			<View style={[{flex: 1, flexDirection: 'row', marginTop:20} ]}>
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
class PaymentMethod extends Component{
	render(){
		return (
			<View style = {styles.checkBoxRow}>
				<View style={ [{flex: 1}]}>
					<CheckBox
						style = {styles.checkBox}
						value={this.props.checkBox}
						onValueChange={this.props.checkBoxChange}/>
				</View>
				<View style={ [{flex: 3}]}>
					<Text style = {styles.checkLabel} >{this.props.checkBoxLabel}</Text>
				</View>
				<View style={[{flex: 3}]}>
					{this.showTextInput()}
				</View>
			</View>
		);
	}
	showTextInput (){
		if( this.props.parent.state.isCredit) {
			if (this.props.type === 'cash' && this.props.parent.state.isCash) {
				return (
					<TextInput
						underlineColorAndroid='transparent'
						onChangeText={this.props.valueChange}
						value = {this.props.value}
						style={[styles.cashInput]}/>
				);
			} else if (this.props.type === 'credit') {
				return (
					<Text style = {styles.checkLabel}>{this.props.value}</Text>
				);

			}if (this.props.type === 'mobile' && this.props.parent.state.isMobile) {
				return (
					<TextInput
					underlineColorAndroid='transparent'
					onChangeText={this.props.valueChange}
					value = {this.props.value}
					style={[styles.cashInput]}/>
				);
			}
		}
		return null;
	}
}

class OrderPaymentScreen extends Component {
	constructor(props) {
		super(props);

		this.state = {
			isCash: true,
			isCredit: false,
			isMobile:false,
			isCompleteOrderVisible :false
		};
	}
	componentDidMount() {
		console.log("OrderPaymentScreen = Mounted");
		this.updatePayment(0);
	}

	render() {
		return (
			<KeyboardAwareScrollView
				style={styles.orderPayment}
				resetScrollToCoords={{ x: 0, y: 0 }}
				contentContainerStyle={styles.container}
				scrollEnabled={false}>
				<View style ={{justifyContent:'flex-end', flexDirection:"row", right:100, top:20}}>
					<TouchableHighlight
						onPress={() => this.onCancelOrder()}>
						<Image source={require('../../images/icons8-cancel-50.png')}/>
					</TouchableHighlight>
					{/*<Image source={require('../../images/icons8-cancel-50.png')} />;*/}
				</View>
				<View style={{flex:1, marginTop:0, marginBottom:50, marginLeft:200, marginRight:200}}>
					<PaymentMethod
						parent = {this}
						type = {"cash"}
						checkBox = {this.state.isCash}
						checkBoxChange = {this.checkBoxChangeCash.bind(this)}
						checkBoxLabel = {'Cash'}
						value = {this.props.payment.cash.toString()}
						valueChange = {this.valuePaymentChange} />
					<PaymentMethod
						parent = {this}
						type = {"credit"}
						checkBox = {this.state.isCredit}
						checkBoxChange = {this.checkBoxChangeCredit.bind(this)}
						checkBoxLabel = {'credit'}
						value = {this.props.payment.credit} />
					<PaymentMethod
						parent = {this}
						type = {"mobile"}
						checkBox = {this.state.isMobile}
						checkBoxChange = {this.checkBoxChangeMobile.bind(this)}
						checkBoxLabel = {'mobile'}
						value = {this.props.payment.mobile.toString()}
						valueChange = {this.valuePaymentChange}/>
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
				<Modal visible = {this.state.isCompleteOrderVisible}
					   backdropColor={'red'}
					   transparent ={true}
					   onRequestClose ={this.closeHandler}>
					{this.ShowCompleteOrder()}
				</Modal>

			</KeyboardAwareScrollView>

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
		this.setState({isCompleteOrderVisible:true});

	};
	onCancelOrder =() =>{
		this.props.orderActions.SetOrderFlow('products');
	};
	getItemPrice = (amount) =>{
		if( this.props.channel.salesChannel === "walkup"){
			return amount;
		}else{
			return .9* amount;
		}
	};

	checkBoxChangeCash=()=>{
		this.setState({isCash:!this.state.isCash} );
		this.setState({isMobile:!this.state.isMobile},function(){this.updatePayment(0)});

	};
	valuePaymentChange=(textValue)=>{
		let cashValue = parseInt( textValue);
		if( isNaN(cashValue)){
			cashValue = 0;
		}
		if( cashValue > this.calculateOrderDue()){
			cashValue = this.calculateOrderDue();
		}
		this.updatePayment( this.calculateOrderDue() - cashValue);
	};


	checkBoxChangeCredit=()=>{
		this.setState({isCredit:!this.state.isCredit},function(){this.updatePayment(0)} );
	};

	checkBoxChangeMobile=()=> {
		this.setState({isMobile:!this.state.isMobile} , function(){this.updatePayment(0)});
		this.setState({isCash:!this.state.isCash} );
	};

	updatePayment=( credit)=> {
		let payment = {
			cash: this.calculateOrderDue()-credit,
			credit: credit,
			mobile: 0
		};
		if (this.state.isMobile) {
			payment = {
				mobile: this.calculateOrderDue()-credit,
				credit: credit,
				cash: 0
			};
		}
		this.props.orderActions.SetPayment( payment );
	};

	closeHandler= ()=>{
		this.setState( {isCompleteOrderVisible:false} );
		this.props.customerBarActions.ShowHideCustomers(1);
	};

	ShowCompleteOrder = () =>{
		let that = this;
		if( this.state.isCompleteOrderVisible ) {
			setTimeout(() => {
				that.closeHandler()
			}, 1500);
		}
		return (
			<View style={{
				flex: 1,
				flexDirection: 'column',
				justifyContent: 'center',
				alignItems: 'center'
			}}>

				<View style={styles.orderProcessing}>
					<Text style={{fontSize:18, fontWeight:'bold'}}>Processing order....</Text>
				</View>
			</View>
		);
	};
}



function mapStateToProps(state, props) {
	return {
		products: state.orderReducer.products,
		channel: state.orderReducer.channel,
		payment: state.orderReducer.payment,

		selectedCustomer: state.customerReducer.selectedCustomer};
}
function mapDispatchToProps(dispatch) {
	return {
		orderActions: bindActionCreators(OrderActions,dispatch),
		customerBarActions:bindActionCreators(CustomerBarActions, dispatch)
	};
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
		flexDirection:"row",
		marginTop:20
	},
	checkBox: {
	},
	checkLabel: {
		left: 20,
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
		borderRadius:30,
		marginTop:20

	},
	buttonText:{
		fontWeight:'bold',
		fontSize:20,
		alignSelf:'center',
		color:'white'
	},
	cashInput : {
		textAlign: 'left',
		height: 40,
		width:100,
		borderWidth: 2,

		borderColor: '#404040',
		// alignSelf: 'center',
	},
	orderProcessing: {
		height:100,
		width:500,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor:'#ABC1DE',
		borderColor:"#2858a7",
		borderWidth:5,
		borderRadius:10
	}

});

