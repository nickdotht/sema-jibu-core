import React, {Component}  from "react"
import { View, Modal, Text, FlatList, TouchableHighlight, StyleSheet } from "react-native";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import * as OrderActions from "../../actions/OrderActions";

const widthQuanityModal = 400;
const heightQuanityModal = 500;

class OrderItems extends Component {
	constructor(props) {
		super(props);
		this.state = {isQuantityVisible :false, selectedItem:{}};
	}

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
				<Modal visible = {this.state.isQuantityVisible}
					   backdropColor={'red'}
					   transparent ={true}
					   onRequestClose ={this.closeHandler}>
					{this.ShowQuantityContent()}
				</Modal>
			</View>
		);
	}
	closeHandler = () =>{
		this.setState( {isQuantityVisible:false} );
	}
	onPressItem = (item) =>{
		this.setState( {isQuantityVisible:true} );
		this.setState( {selectedItem:item});
	};

	ShowQuantityContent = (item) => (
		<View style={styles.quantityModal}>
			<View style={styles.modalTotal }>
				<Text style={ { flex:1, textAlign: 'center'}}>{this.state.selectedItem.quantity}</Text>
			</View>
			{/*{this._renderButton('Close', () => this.setState({ visibleModal: null }))}*/}
		</View>
	);


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

	},
	quantityModal: {
		width:widthQuanityModal,
		height:heightQuanityModal,
		position: 'absolute',
		bottom:80,
		right:30,
		backgroundColor: '#e0e0e0',
		// padding: 22,
		// justifyContent: 'center',
		alignItems: 'center',
		borderRadius: 4,
		borderColor: 'rgba(0, 0, 0, 1)',
		borderWidth:2
	},
	modalTotal: {
		flex: .15,
		flexDirection: 'row',
		backgroundColor:'white',
		alignItems:'center',
		borderColor:'black',
		borderWidth:4,
		borderRadius:3

}
});
