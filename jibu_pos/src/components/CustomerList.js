import React, {Component}  from "react";
import { View, Text, FlatList, TouchableHighlight, StyleSheet } from "react-native";

export default class CustomerList extends Component {
	constructor(props) {
		super(props);

		this.state = {
			loading: false,
			data: [],
			page: 1,
			seed: 1,
			error: null,
			refreshing: false,
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
		console.log("Email " + item.email);
		return (
			<View style={{flex: 1, flexDirection: 'row'}}>
				<View style={ [this.getRowBackground(index), {flex:2}]}>
					<Text style={[styles.baseItem,styles.leftMargin]}>{item.name.first + ' ' + item.name.last}</Text>
				</View>
				<View style={ [this.getRowBackground(index), {flex:1.5}]}>
					<Text style={[styles.baseItem]}>{item.phone}</Text>
				</View>
				<View style={ [this.getRowBackground(index), {flex:2}]}>
					<Text style={[styles.baseItem]}>{item.name.first}</Text>
				</View>
				<View style={ [this.getRowBackground(index), {flex:.75}]}>
					<Text style={[styles.baseItem]}>0</Text>
				</View>
				<View style={ [this.getRowBackground(index), {flex:1}]}>
					<Text style={[styles.baseItem]}>Walk-up</Text>
				</View>
			</View>
		);
	};

	_onPressItem = (item) =>{
		console.log("_onPressItem")
	}
	showHeader = () =>{
		console.log("Displaying header");
		return (
			<View style={{flex: 1, flexDirection: 'row'}}>
				<View style={ [styles.headerBackground, {flex: 2}]}>
					<Text style={[styles.headerItem,styles.leftMargin]}>Name</Text>
				</View>
				<View style={[styles.headerBackground, {flex: 1.5}]}>
					<Text style={[styles.headerItem]}>Telephone</Text>
				</View>
				<View style={ [styles.headerBackground, {flex: 2}]}>
					<Text style={[styles.headerItem]}>Address</Text>
				</View>
				<View style={ [styles.headerBackground, {flex: .75}]}>
					<Text style={[styles.headerItem]}>Credit</Text>
				</View>
				<View style={ [styles.headerBackground, {flex: 1}]}>
					<Text style={[styles.headerItem, {flex: 1}, {flexDirection: 'row'}]}>Customer Type</Text>
				</View>
			</View>
		);
	};
	getRowBackground = (index) =>{
		return ((index % 2) == 0) ? styles.lightBackground: styles.darkBackground;
	}

}

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
		backgroundColor:'#C0C0C0'
	},

	lightBackground:{
		backgroundColor:'white'
	},
	darkBackground:{
		backgroundColor:'#F0F0F0'
	}


});
