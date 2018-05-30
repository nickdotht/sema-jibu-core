import React, {Component}  from "react";
import { View, Text, FlatList, TouchableHighlight, StyleSheet } from "react-native";
import {connect} from "react-redux";
import {bindActionCreators} from 'redux';
import * as CustomerActions from '../actions/CustomerActions';

class CustomerList extends Component {
	constructor(props) {
		super(props);

		this.state = {
			refresh: false,
			selectedCustomer: null,
			searchString:""
		};
	}
	componentDidMount() {
		console.log("CustomerList = Mounted");
	}

	render() {
		return (
			<View >
				{/*<FlatList*/}
					{/*data={[{key: 'aaaaaaa'}, {key: 'bbbbbbbb'}]}*/}
					{/*renderItem={({item}) => <Text>{item.key}</Text>}*/}
				{/*/>*/}
				<FlatList
					data={this.prepareData()}
					ListHeaderComponent = {this.showHeader}
					extraData={this.state.refresh}
					renderItem={({item, index, separators}) => (
						<TouchableHighlight
							onPress={() => this.onPressItem(item)}
							onShowUnderlay={separators.highlight}
							onHideUnderlay={separators.unhighlight}>
							{this.getRow(item, index, separators)}
						</TouchableHighlight>
					)}
					keyExtractor={item => item.id}
				/>
				<SearchWatcher parent = {this}>{this.props.searchString}</SearchWatcher>
			</View>
		);
	}
	prepareData = () =>{
		if( this.props.customers.length > 0 && this.props.customers[0].id !== '9999999-9999-9999-9999-9999999' ) {
			const anonymous = {
				"id": "9999999-9999-9999-9999-9999999",
				"version": 3,
				"address": "----------------------------",
				"contact_name": "Walkup Client",
				"customer_type_id": 120,
				"due_amount": "---------------",
				"name": "",
				"phone_number": "----------------------------",
				"active": "1",
				"sales_channel": "anonymous"
			};
			this.props.customers.unshift(anonymous);
		}
		return this.props.customers;
	}
	getRow = (item, index, separators) =>{
		let isSelected = false;
		if( this.state.selectedCustomer && this.state.selectedCustomer.id === item.id){
			console.log("Selected item is " + item.id);
			isSelected = true;
		}
		if( this.filterItem(item) ) {
			return (
				<View style={[this.getRowBackground(index, isSelected), {flex: 1, flexDirection: 'row'}]}>
					<View style={{flex: 2}}>
						<Text style={[styles.baseItem, styles.leftMargin]}>{item.contact_name}</Text>
					</View>
					<View style={{flex: 1.5}}>
						<Text style={[styles.baseItem]}>{item.phone_number}</Text>
					</View>
					<View style={{flex: 2}}>
						<Text style={[styles.baseItem]}>{item.address}</Text>
					</View>
					<View style={{flex: .75}}>
						<Text style={[styles.baseItem]}>{item.due_amount}</Text>
					</View>
					<View style={{flex: 1}}>
						<Text style={[styles.baseItem]}>Walk-up</Text>
					</View>
				</View>
			);
		}else{
			return (<View/>);
		}
	};

	filterItem = (item )=> {
		if( item.sales_channel === "anonymous"){
			return true;
		}
		if (this.props.filter === "all" || this.props.filter === item.sales_channel){
			if (this.state.searchString.length >= 2) {
				const filterString = this.state.searchString.toLowerCase();
				if (item.contact_name.toLowerCase().startsWith(filterString) ||
					item.phone_number.startsWith(filterString)) {
					return true;
				} else {
					return false;
				}
			}
			return true;
		}
		return false;
	};

	onPressItem = (item) =>{
		console.log("_onPressItem");
		this.props.CustomerSelected(item);
		this.setState({ selectedCustomer:item });
		this.setState({refresh: !this.state.refresh});
	};
	showHeader = () =>{
		console.log("Displaying header");
		return (
			<View style={[{flex: 1, flexDirection: 'row'},styles.headerBackground]}>
				<View style={ [{flex: 2}]}>
					<Text style={[styles.headerItem,styles.leftMargin]}>Name</Text>
				</View>
				<View style={[ {flex: 1.5}]}>
					<Text style={[styles.headerItem]}>Telephone</Text>
				</View>
				<View style={ [ {flex: 2}]}>
					<Text style={[styles.headerItem]}>Address</Text>
				</View>
				<View style={ [{flex: .75}]}>
					<Text style={[styles.headerItem]}>Credit</Text>
				</View>
				<View style={ [{flex: 1}]}>
					<Text style={[styles.headerItem, {flex: 1}, {flexDirection: 'row'}]}>Customer Type</Text>
				</View>
			</View>
		);
	};
	getRowBackground = (index, isSelected) =>{
		if( isSelected ){
			return styles.selectedBackground;
		}else {
			return ((index % 2) === 0) ? styles.lightBackground : styles.darkBackground;
		}
	};

}

class SearchWatcher extends React.Component {
	render() {
		return this.searchEvent();

	}
	searchEvent(){
		console.log("SearchWatcher");
		let that = this;
		setTimeout( ()=> {
			if( that.props.parent.props.searchString !== that.props.parent.state.searchString ) {
				that.props.parent.state.searchString = that.props.parent.props.searchString;
				that.props.parent.setState({refresh: !that.props.parent.state.refresh});
			}
		}, 50);
		return null;
	}
}

function mapStateToProps(state, props) {
	return {
		selectedCustomer: state.customerReducer.selectedCustomer,
		customers: state.customerReducer.customers,
		searchString: state.customerReducer.searchString

	};
}

function mapDispatchToProps(dispatch) {
	return bindActionCreators(CustomerActions, dispatch);
}


export default connect(mapStateToProps, mapDispatchToProps)(CustomerList);

const styles = StyleSheet.create({
	baseItem:{
		fontSize:18
	},
	leftMargin:{
		left:10
	},
	headerItem:{
		fontWeight:"bold",
		fontSize:18
	},
	headerBackground:{
		backgroundColor:'#ABC1DE'
	},

	lightBackground:{
		backgroundColor:'white'
	},
	darkBackground:{
		backgroundColor:'#F0F8FF'
	},
	selectedBackground:{
		backgroundColor:'#9AADC8'
	}


});
