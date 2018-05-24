import React from 'react';
import { Text, View } from 'react-native';
import { TabNavigator, createMaterialTopTabNavigator, createBottomTabNavigator } from 'react-navigation';
import CustomerList from "./CustomerList";
import {MultiColumnExample} from "./scratch";


class AllScreen extends React.Component {
	render() {
		return (
			<MultiColumnExample filter='This is All'/>
		);
	}
}

class WalkupScreen extends React.Component {
	render() {
		return (
			<CustomerList filter='This is Walkup'/>
		);
	}
}

class ResellerScreen extends React.Component {
	render() {
		return (
			<CustomerList filter='This is Reseller'/>
		);
	}
}
class CreditScreen extends React.Component {
	render(){
		return (
			<CustomerList filter='This is Credit'/>
		);
	}
}

export const Tab = createBottomTabNavigator({
	All: {
		screen: AllScreen,
		navigationOptions: {
			tabBarLabel: 'All',
			tabBarOnPress: (scene, jumpToIndex) => {
				let output = "All-Tab " + scene.navigation.state.routeName;
				console.log(output);
			},
		},
	},
	Walkup: {
		screen: WalkupScreen,
		navigationOptions: {
			tabBarLabel: 'Walkup',
			tabBarOnPress: (scene, jumpToIndex) => {
				let output = "Walkup-Tab " + scene.navigation.state.routeName;
				console.log(output);
			},
		},

	},

	Reseller: {
		screen: ResellerScreen,
		navigationOptions: {
			tabBarLabel: 'Reseller',
			tabBarOnPress: (scene, jumpToIndex) => {
				let output = "Reseller-Tab " + scene.navigation.state.routeName;
				console.log(output);
			},
		},

	},
	Credit: {
		screen: CreditScreen,
		navigationOptions: {
			tabBarLabel: 'Credit',
			tabBarOnPress: (scene, jumpToIndex) => {
				let output = "Credit-Tab " + scene.navigation.state.routeName;
				console.log(output);
			},
		},

	},

},{
	swipeEnabled: true,
	tabBarOptions: {
		activeTintColor: '#f2f2f2',
		activeBackgroundColor: "#3EC426",
		inactiveTintColor: '#666',
		inactiveBackgroundColor: 'pink',
		// style: {padding:0, margin:0, borderColor:'red', borderWidth:5, justifyContent: 'center', alignItems: 'center' },
		labelStyle: {
			fontSize: 18,
			padding: 12
		},
		tabStyle: {justifyContent: 'center', alignItems: 'center'},
		// tabStyle: {
		// 	borderBottomColor: '#ebcccc',
		// 	width: 100,
		// 	height:600,
		// 	// backgroundColor:"yellow"
		// }
	}
});


// class HomeScreen extends React.Component {
// 	render() {
// 		return (
// 			<View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
// 				<Text>Home!</Text>
// 			</View>
// 		);
// 	}
// }
//
// class SettingsScreen extends React.Component {
// 	render() {
// 		return (
// 			<View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
// 				<Text>SettingsScreen!</Text>
// 			</View>
//
// 		);
// 	}
// }
//
// class ResellerScreen extends React.Component {
// 	render() {
// 		return (
// 			<View style={{width: 300, height: 500, backgroundColor: 'steelblue'}}>
// 				<Text>cccc!</Text>
// 			</View>
// 		);
// 	}
// }
//
//
// export const Tab = createBottomTabNavigator ({
// 	Home: {
// 		screen: HomeScreen,
// 		navigationOptions: {
// 			tabBarLabel: 'All',
// 		},
// 	},
// 	Settings: {
// 		screen: SettingsScreen,
// 		navigationOptions: {
// 			tabBarLabel: 'Walk Up',
// 		},
// 	},
// 	Reseller: {
// 		screen: ResellerScreen,
// 		navigationOptions: {
// 			tabBarLabel: 'Reseller',
// 			tabBarOnPress: (scene, jumpToIndex) => {
// 				let foo = "foobar " + scene.navigation.state.routeName;
// 				console.log(foo);
// 			},
// 		},
// 	}
//
// }, {
// 	swipeEnabled: true,
// 	tabBarOptions: {
// 		activeTintColor: '#f2f2f2',
// 		activeBackgroundColor: "#3EC426",
// 		inactiveTintColor: '#666',
// 		inactiveBackgroundColor: 'pink',
// 		labelStyle: {
// 			fontSize: 18,
// 			padding: 12
// 		}
// 	}
// });


