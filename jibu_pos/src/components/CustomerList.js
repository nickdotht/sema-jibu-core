import React, {Component}  from "react";
import { View, Text, FlatList, TouchableHighlight, StyleSheet } from "react-native";
import { List, ListItem } from "react-native-elements";

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
					renderItem={({item, separators}) => (
						<TouchableHighlight
							onPress={() => this._onPressItem(item)}
							onShowUnderlay={separators.highlight}
							onHideUnderlay={separators.unhighlight}>
							{this.getRow(item)}
						</TouchableHighlight>
					)}
					keyExtractor={item => item.email}
				/>
			</View>
		);
	}
	getRow = (item) =>{
		console.log("Email " + item.email);
		return (
			<View style={{flex: 1, flexDirection: 'row'}}>
				<View style={{width: 450, height: 50, backgroundColor: 'powderblue'}}>
					<Text>{item.email}</Text>
				</View>
				<View style={{width: 450, height: 50, backgroundColor: 'powderblue'}}>
					<Text>{item.phone}</Text>
				</View>
			</View>
		);

		// 	{/*<View style={{backgroundColor: 'white'}}>*/}
		// 		{/*<Text>{item.email}......{item.phone}</Text>*/}
		// 		{/*<Text>{item.phone}</Text>*/}
		// 	{/*</View>*/}
        //
		// );
	}
	getfoo = (item) =>{
		console.log("getfoo");
		return item.email;
	}
	_onPressItem = (item) =>{
		console.log("_onPressItem")
	}
}

const styles = StyleSheet.create({
	list: {
		justifyContent: 'center',
		flexDirection: 'row',
		flexWrap: 'wrap',
	},
	item: {
		backgroundColor: 'red',
		margin: 3,
		width: 100
	}
});
