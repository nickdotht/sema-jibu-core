import React, {Component}  from "react";
import { View, Text, FlatList, TouchableHighlight } from "react-native";
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
							<View style={{backgroundColor: 'white'}}>
								<Text>{this.getfoo(item)}</Text>
							</View>
						</TouchableHighlight>
					)}
					keyExtractor={item => item.email}
				/>
			</View>
		);
	}
	getfoo = (item) =>{
		console.log("getfoo");
		return item.email;
	}
	_onPressItem = (item) =>{
		console.log("_onPressItem")
	}
}


