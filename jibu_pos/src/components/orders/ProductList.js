import React, {Component}  from "react";
import { View, Text, FlatList, TouchableHighlight, StyleSheet, Image } from "react-native";
import {connect} from "react-redux";
import {bindActionCreators} from 'redux';
import * as ProductActions from '../../actions/ProductActions';
import * as OrderActions from "../../actions/OrderActions";

class ProductList extends Component {
	constructor(props) {
		super(props);
		this.state = {columnWidth :1, refresh:false};
	}
	componentDidMount() {
		console.log("ProductList = Mounted");
		this.props.productActions.LoadProducts();
	}

	render() {
		return (
			<View onLayout={(event) => { this.find_dimesions(event.nativeEvent.layout) }} style={styles.container} >
				<FlatList
					data={this.prepareData()}
					extraData={this.state.refresh}
					renderItem={({item, index, separators}) => (
						<TouchableHighlight
							onPress={() => this.onPressItem(item)}
							onShowUnderlay={separators.highlight}
							onHideUnderlay={separators.unhighlight}>
							{this.getItem(item, index, separators)}

						</TouchableHighlight>
					)}
					keyExtractor={item => item.id}
					numColumns={3}
					horizontal={false}
				/>
			</View>
		);
	}

	find_dimesions = (layout) =>{
		const {x, y, width, height} = layout;
		setTimeout( () => {
			this.setState({columnWidth: width/3});
			this.setState({refresh: !this.state.refresh});
			console.log( "find_dimesions -state.columnWidth " + this.state.columnWidth + " width: " + width);
		}, 5);

	};

	getItem = (item, index, separators) =>{
		console.log( "getItem -Product cell width" + this.state.columnWidth)
		return (
			<View style={[this.getItemBackground(index ), {flex:1, height:this.state.columnWidth, width:this.state.columnWidth}]}>
				<Image
					source={{uri: this.getImage(item) }}
					// resizeMode='center'
					resizeMethod ='scale'
					style={{flex:1}}>
				</Image>
				<Text style={styles.imageLabel}>{item.description}{'\n'}${item.price_amount}</Text>
			</View>
		);
	};

	prepareData = () =>{
		return this.props.products;
		// return [{id:1, data:"one"}, {id:2, data:"two"}, {id:3, data:"three"}, {id:4, data:"four"}, {id:5, data:"five"}];
	};
	getImage = (item)=>{
		return 'data:image/png;base64,' + item.base64encoded_image
	}

	onPressItem = (item) =>{
		console.log("onPressItem");
		this.props.orderActions.AddProductToOrder(item, 1);
	};
	getItemBackground = (index ) =>{
		return ((index % 2) === 0) ? styles.lightBackground : styles.darkBackground;
	};

}

function mapStateToProps(state, props) {
	return {
		products: state.productReducer.products

	};
}

function mapDispatchToProps(dispatch) {
	return { productActions: bindActionCreators(ProductActions, dispatch),
			orderActions: bindActionCreators(OrderActions,dispatch)};
}



export default connect(mapStateToProps, mapDispatchToProps)(ProductList);

const styles = StyleSheet.create({
	container:{
		flex:1,
		borderColor:'#ABC1DE',
		borderTopWidth:5
	},

	imageLabel:{
		fontWeight:'bold',
		paddingTop:5,
		paddingBottom:5,
		textAlign: 'center',
		color:'white',
		backgroundColor: '#2858a7'

	},
	lightBackground:{
		backgroundColor:'#ABC1DE'
	},
	darkBackground:{
		backgroundColor:'#ABC1DE'
	},

});
