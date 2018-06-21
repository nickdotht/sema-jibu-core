import React, {Component}  from "react";
import { View, Text, FlatList, TouchableHighlight, StyleSheet } from "react-native";
import {connect} from "react-redux";
import {bindActionCreators} from 'redux';
import * as CustomerActions from '../../actions/CustomerActions';
import Events from 'react-native-simple-events';

class CustomerList extends Component {
	constructor(props) {
		super(props);

		this.state = {
			refresh: false,
			// selectedCustomer: null,
			searchString:"",
			hasScrolled:false
		};
	}
	componentDidMount() {
		console.log("CustomerList:componentDidMount");
		Events.on('ScrollCustomerTo', 'customerId1', this.onScrollCustomerTo.bind(this) );
	}
	componentWillUnmount(){
		Events.rm('ScrollCustomerTo', 'customerId1') ;
	}

	onScrollCustomerTo( data ){
		console.log("onScrollCustomerTo");
		// Commented oto scrollToItem requires getItemLayout and getItemLayout fails with
		// searches. Expect since not all items are rendered on sea
		// this.flatListRef.scrollToItem({animated: false, item: data.customer, viewPosition:0.5});
	}
	getItemLayout = (data, index) => (
		{ length: 50, offset: 50 * index, index }
	);

	shouldComponentUpdate(nextProps, nextState){
		console.log("onScrollCustomerTo");
		return true;
	}
	render() {
		return (
			<View >
				{/*<FlatList*/}
					{/*data={[{key: 'aaaaaaa'}, {key: 'bbbbbbbb'}]}*/}
					{/*renderItem={({item}) => <Text>{item.key}</Text>}*/}
				{/*/>*/}
				<FlatList
					ref={(ref) => { this.flatListRef = ref; }}
					// getItemLayout={this.getItemLayout}
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
					initialNumToRender={50}
				/>
				<SearchWatcher parent = {this}>{this.props.searchString}</SearchWatcher>
			</View>
		);
	}
	prepareData = () => {
		if (this.props.customers.length > 0 && this.props.customers[0].id !== '9999999-9999-9999-9999-9999999') {
			const anonymous = {
				"id": "9999999-9999-9999-9999-9999999",
				"version": 3,
				"address": "----------------------------",
				"contact_name": "Walkup Client",
				"customer_type_id": 120,
				"due_amount": "",
				"name": "",
				"phone_number": "----------------------------",
				"active": "1",
				"sales_channel": "anonymous"
			};
			this.props.customers.unshift(anonymous);
		}
		let data = [];
		if (this.props.customers.length > 0) {
			data.push(this.props.customers[0]);
			if (this.props.customers.length > 1) {
				data = this.props.customers.slice(1);

				data.sort((a, b) => {
					return (a.contact_name < b.contact_name ? -1 : 1)
				});
				data.unshift(this.props.customers[0]);
			}
		}
		return data;
	}
	getRow = (item, index, separators) =>{
		// console.log("getRow -index: " + index)
		let isSelected = false;
		if( this.props.selectedCustomer && this.props.selectedCustomer.id === item.id){
			console.log("Selected item is " + item.id);
			isSelected = true;
		}
		if( this.filterItem(item) ) {
			return (
				<View style={[this.getRowBackground(index, isSelected), {flex: 1, flexDirection: 'row', height:50, alignItems:'center'}]}>
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
						<Text style={[styles.baseItem]}>{this.getCustomerType(item)}</Text>
					</View>
				</View>
			);
		}else{
			return (<View/>);
		}
	};

	getCustomerType(item) {
		if( item.hasOwnProperty("sales_channel")){
			return item.sales_channel;
		}else{
			return "Walk-up";
		}
	}

	filterItem = (item )=> {
		if( item.sales_channel === "anonymous"){
			return true;
		}
		if (this.props.filter === "all" ||
			(this.props.filter === "reseller" && item.sales_channel === "reseller") ||
			(this.props.filter === "walkup" && item.sales_channel !== "reseller") ||
			(this.props.filter === "credit" && item.due_amount >0 )){
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
		// this.setState({ selectedCustomer:item });
		this.setState({refresh: !this.state.refresh});
	};
	showHeader = () =>{
		console.log("Displaying header");
		return (
			<View style={[{flex: 1, flexDirection: 'row', height:50, alignItems:'center'},styles.headerBackground]}>
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
					<Text style={[styles.headerItem]}>Customer Type</Text>
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
