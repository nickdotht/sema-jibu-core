import React, {Component}  from "react"
import { View, Text, FlatList, TouchableHighlight, StyleSheet } from "react-native";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import * as OrderActions from "../../actions/OrderActions";

class OrderItems extends Component {
	render() {
		return (
			<View style = {styles.container}>
				<FlatList
					data={this.props.products}
					ListHeaderComponent = {this.showHeader}
					// extraData={this.state.refresh}
					renderItem={({item, index, separators}) => (
						<TouchableHighlight
							onPress={() => this.onPressItem(item)}
							onShowUnderlay={separators.highlight}
							onHideUnderlay={separators.unhighlight}>
							{this.getRow(item, index, separators)}
						</TouchableHighlight>
					)}
					keyExtractor={item => item.product.id}
				/>

			</View>
		);
	}


	getRow = (item) =>{
		return (
			<View style={{flex: 1, flexDirection: 'row', backgroundColor:'white'} }>
				<View style={ [{flex: .5}]}>
					<Text style={[styles.baseItem,styles.leftMargin]}>X</Text>
				</View>
				<View style={ [{flex: 2.5}]}>
					<Text style={[styles.baseItem]}>{item.product.description}</Text>
				</View>
				<View style={[ {flex: 1}]}>
					<Text style={[styles.baseItem]}>{item.quantity}</Text>
				</View>
				<View style={ [ {flex: 1}]}>
					<Text style={[styles.baseItem]}>{item.quantity * item.product.price_amount}</Text>
				</View>
			</View>
		);
	}
	showHeader = () =>{
		return (
			<View style={[{flex: 1, flexDirection: 'row'},styles.headerBackground]}>
				<View style={ [{flex: 3}]}>
					<Text style={[styles.headerItem,styles.headerLeftMargin]}>Item</Text>
				</View>
				<View style={[ {flex: 1}]}>
					<Text style={[styles.headerItem]}>Quantity</Text>
				</View>
				<View style={ [ {flex: 1}]}>
					<Text style={[styles.headerItem]}>Charge</Text>
				</View>
			</View>
		);
	};
}

function mapStateToProps(state, props) {
	return {products: state.orderReducer.products};
}
function mapDispatchToProps(dispatch) {
	return {orderActions: bindActionCreators(OrderActions,dispatch)};
}

export default connect(mapStateToProps, mapDispatchToProps)(OrderItems);

const styles = StyleSheet.create({
	container: {
		flex: 6,
		backgroundColor:"white",
		borderColor: '#2858a7',
		borderTopWidth:5,
		borderRightWidth:5,
	},
	headerBackground:{
		backgroundColor:'#ABC1DE'
	},
	leftMargin:{
		left:10
	},
	headerLeftMargin:{
		left:50
	},
	headerItem:{
		fontWeight:'bold',
		fontSize:18,
		color:'black',
		paddingTop:5,
		paddingBottom:5,
	},
	baseItem:{
		fontWeight:'bold',
		fontSize:16,
		color:'black',
		paddingTop:4,
		paddingBottom:4,

	}

});
