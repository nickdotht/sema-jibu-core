import React, {Component}  from "react";
import { View, Text, FlatList, TouchableHighlight, StyleSheet } from "react-native";
import {connect} from "react-redux";
import {bindActionCreators} from 'redux';
import * as CustomerActions from '../../actions/CustomerActions';
import Events from 'react-native-simple-events';
import PosStorage from "../../database/PosStorage";

const anonymousId = "9999999-9999-9999-9999-9999999";

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
		console.log("CustomerList:componentDidMount - filter: " + this.props.filter);
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
					keyExtractor={item => item.customerId}
					initialNumToRender={50}
				/>
				<SearchWatcher parent = {this}>{this.props.searchString}</SearchWatcher>
			</View>
		);
	}
	prepareData = () => {
		this.salesChannels = PosStorage.getSalesChannelsForDisplay();
		let data = [];
		if (this.props.customers.length > 0) {
			data = this.props.customers.slice();
			data = this.filterItems( data );
			data.sort((a, b) => {
				if( a.customerId == anonymousId){
					return -1;		//anonymous walk-up client always is at the top
				}else if( b.customerId == anonymousId) {
					return 1;
				}
				return (a.name < b.name ? -1 : 1)
			});
		}
		return data;
	};
	filterItems = (data) => {
		let filteredItems = [];
		for( let i = 0; i < data.length; i++ ){
			if( this.filterItem( data[i], this.salesChannels)){
				filteredItems.push(data[i]);
			}
		}
		return filteredItems;

	};

	getRow = (item, index, separators) =>{
		// console.log("getRow -index: " + index)
		let isSelected = false;
		if( this.props.selectedCustomer && this.props.selectedCustomer.customerId === item.customerId){
			console.log("Selected item is " + item.customerId);
			isSelected = true;
		}
		if( true ) {
			return (
				<View style={[this.getRowBackground(index, isSelected), {flex: 1, flexDirection: 'row', height:50, alignItems:'center'}]}>
					<View style={{flex: 2}}>
						<TouchableHighlight
							onPress={() => this.onPressItemName(item)}>
							<Text style={[styles.baseItem, styles.leftMargin]}>{item.name}</Text>
						</TouchableHighlight>
					</View>
					<View style={{flex: 1.5}}>
						<Text style={[styles.baseItem]}>{item.phoneNumber}</Text>
					</View>
					<View style={{flex: 2}}>
						<Text style={[styles.baseItem]}>{item.address}</Text>
					</View>
					<View style={{flex: .75}}>
						<Text style={[styles.baseItem]}>{item.dueAmount}</Text>
					</View>
					<View style={{flex: 1}}>
						<Text style={[styles.baseItem]}>{this.getCustomerSalesChannel(item)}</Text>
					</View>
				</View>
			);
		}else{
			return (<View/>);
		}
	};

	getCustomerSalesChannel(item) {
		try {
			for( let i = 0; i < this.salesChannels.length; i++ ) {
				if (this.salesChannels[i].id === item.salesChannelId) {
					return this.salesChannels[i].displayName;
				}
			}
		}catch( error ) {
			return "Walk-up";
		}
	}

	filterItem = (item, salesChannels )=> {
		try {
			let salesChannel = this._getSalesChannelName(item.salesChannelId, salesChannels);

			if (item.customerId === anonymousId ) {
				return true;	// Anonymous client is always shown
			}
			if (this.props.filter === "all" ||
				(this.props.filter === "reseller" && salesChannel === "reseller") ||
				(this.props.filter === "walkup" && salesChannel !== "reseller") ||
				(this.props.filter === "credit" && item.dueAmount > 0)) {
				if (this.state.searchString.length >= 2) {
					const filterString = this.state.searchString.toLowerCase();
					if (item.name.toLowerCase().startsWith(filterString) ||
						item.phoneNumber.startsWith(filterString)) {
						return true;
					} else {
						return false;
					}
				}
				return true;
			}
		}catch( error ){
			console.log( "CustomerList:filterItem " + error);
		}
		return false;
	};
	_getSalesChannelName(channelId, salesChannels){
		for( let i = 0; i < salesChannels.length; i++ ){
			if( salesChannels[i].id === channelId){
				return salesChannels[i].name;
			}
		}
		return "walkup";
	}
	onPressItemName = (item) =>{
		console.log("_onPressItemName");
		this.props.CustomerSelected(item);
		this.setState({refresh: !this.state.refresh});
	};

	onPressItem = (item) =>{
		console.log("_onPressItem");
		this.props.CustomerSelected(item);
		// this.setState({ selectedCustomer:item });
		this.setState({refresh: !this.state.refresh});
		Events.trigger('onOrder', {customer: item});
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
