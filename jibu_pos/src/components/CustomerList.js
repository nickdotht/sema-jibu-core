import React, {Component}  from "react";
import { View, Text, FlatList, TouchableHighlight, StyleSheet } from "react-native";
import {connect} from "react-redux";
import {bindActionCreators} from 'redux';
import * as CustomerActions from '../actions/CustomerActions';

class CustomerList extends Component {
	constructor(props) {
		super(props);

		this.state = {
			loading: false,
			data: [],
			page: 1,
			seed: 1,
			error: null,
			refreshing: false,

			refresh: false,
			selectedCustomer: null
		};
	}

	componentDidMount() {
		this.makeRemoteRequest();
	}

	makeRemoteRequest = () => {
		const { page, seed } = this.state;
		const url = `https://randomuser.me/api/?seed=${seed}&page=${page}&results=20`;
		this.setState({ loading: true });
		fetch(url)
			.then(res => res.json())
			.then(res => {
				this.setState({
					data: page === 1 ? res.results : [...this.state.data, ...res.results],
					error: res.error || null,
					loading: false,
					refreshing: false
				});
			})
			.catch(error => {
				this.setState({ error, loading: false });
			});
	};

	render() {
		return (
			<View >
				{/*<FlatList*/}
					{/*data={[{key: 'aaaaaaa'}, {key: 'bbbbbbbb'}]}*/}
					{/*renderItem={({item}) => <Text>{item.key}</Text>}*/}
				{/*/>*/}
				<FlatList
					data={this.state.data}
					ListHeaderComponent = {this.showHeader}
					extraData={this.state.refresh}
					renderItem={({item, index, separators}) => (
						<TouchableHighlight
							onPress={() => this._onPressItem(item)}
							onShowUnderlay={separators.highlight}
							onHideUnderlay={separators.unhighlight}>
							{this.getRow(item, index, separators)}
						</TouchableHighlight>
					)}
					keyExtractor={item => item.email}
				/>
			</View>
		);
	}
	getRow = (item, index, separators) =>{
		let isSelected = false;
		if( this.state.selectedCustomer && this.state.selectedCustomer.email === item.email){
			console.log("Selected item is " + item.email);
			isSelected = true;
		}
		return (
			<View style={ [this.getRowBackground(index, isSelected), {flex: 1, flexDirection: 'row'}]}>
				<View style={ {flex:2}}>
					<Text style={[styles.baseItem,styles.leftMargin]}>{item.name.first + ' ' + item.name.last}</Text>
				</View>
				<View style={{flex:1.5}}>
					<Text style={[styles.baseItem]}>{item.phone}</Text>
				</View>
				<View style={{flex:2}}>
					<Text style={[styles.baseItem]}>{item.name.first}</Text>
				</View>
				<View style={{flex:.75}}>
					<Text style={[styles.baseItem]}>0</Text>
				</View>
				<View style={{flex:1}}>
					<Text style={[styles.baseItem]}>Walk-up</Text>
				</View>
			</View>
		);
	};

	_onPressItem = (item) =>{
		console.log("_onPressItem")
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
			return ((index % 2) == 0) ? styles.lightBackground : styles.darkBackground;
		}
	};

}

function mapStateToProps(state, props) {
	return {
		SelectedCustomer: state.customerReducer.SelectedCustomer
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
