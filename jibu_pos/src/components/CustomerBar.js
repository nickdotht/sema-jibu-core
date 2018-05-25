import React, {Component} from "react";
import {
	StyleSheet,
	Text,
	View,
	TextInput
} from 'react-native';

export default class CustomerBar extends Component {
	render() {
		return (

			<View style={{ flexDirection:'row', height:100, backgroundColor:'white' }}>
				<TextInput style={{ flex:1, fontSize:18, backgroundColor:'pink',  height: 70,}}
						// underlineColorAndroid = "transparent"
						   placeholder = "Search by Name or Telephone"
						   placeholderTextColor = "#A0A0A0"
						   autoCapitalize = "none"
						   borderWidth:{2}
						   borderColor:'black'
						   multiline={true}
						   backgroundColor='pink'
						   onChangeText = {this.onTextChange}/>
			</View>
		);
	}
	onTextChange(){

	}
}

{/*<TextInput style = {styles.input}*/}
		   {/*underlineColorAndroid = "transparent"*/}
		   {/*placeholder = "Password"*/}
		   {/*placeholderTextColor = "#9a73ef"*/}
		   {/*autoCapitalize = "none"*/}
		   {/*onChangeText = {this.handlePassword}/>*/}
