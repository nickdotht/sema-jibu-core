import React, {Component}  from "react";
import { View, Text, TouchableHighlight, TextInput, StyleSheet, Dimensions, Image, Alert} from "react-native";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import PropTypes from 'prop-types';

import {connect} from "react-redux";
import {bindActionCreators} from "redux";

import PosStorage from "../database/PosStorage";
import * as SettingsActions from "../actions/SettingsActions";
import * as ToolbarActions from "../actions/ToolBarActions";

import Communications from '../services/Communications';

var inputFontHeight = 24;
var {height, width} = Dimensions.get('window');
var inputFontHeight = Math.round((24 * height)/752);
var marginTextInput = Math.round((5 * height)/752);
var marginSpacing = Math.round((20 * height)/752);
var inputTextWidth = 400;
var marginInputItems = width/2 -inputTextWidth/2;

class SettingsProperty extends Component {
	constructor(props) {
		super(props);
		this.state = {propertyText : this.props.valueFn(this.props.parent)};
		console.log("--------- height " + height);
	}


	render() {
		return (
			<View style ={{flexDirection:'row', flex:1, alignItems:'center', marginTop: this.props.marginTop, alignSelf:'flex-end', marginRight:marginInputItems}}>
				<View>
					<Text style = {styles.labelText}>{this.props.label}</Text>
				</View>
				<View style ={[ styles.inputContainer]}>
					<TextInput
						style = {[styles.inputText,]}
						underlineColorAndroid='transparent'
						placeholder = {this.props.placeHolder}
						value = {this.state.propertyText}
						secureTextEntry = {this.props.isSecure}
						onChangeText = {this.onChangeText.bind(this)}/>
				</View>
			</View>
		);
	}
	onChangeText = (text )=>{
		this.setState({propertyText :text});
	}
}

class Settings extends Component {
	constructor(props) {
		super(props);
		this.url = React.createRef();
		this.site = React.createRef();
		this.user = React.createRef();
		this.password = React.createRef();
	}
	componentDidMount() {
		console.log("Settings:Mounted");
	}

	render() {
		return (
			<View style={{flex:1}}>
				<View style = {{flexDirection:'row'}}>

					<View style ={{flexDirection:'row', flex:1, alignItems:'center', height:100}}>
						<Text style = {[styles.headerText]}>{'Settings'}</Text>
					</View>
					<View style ={{flexDirection:'row-reverse', flex:1, alignItems:'center', height:100}}>
						<TouchableHighlight
							onPress={() => this.onCancelSettings()}>
							<Image source={require('../images/icons8-cancel-50.png')} style={{marginRight:100}}/>
						</TouchableHighlight>
					</View>
				</View>

				<KeyboardAwareScrollView
						style={{flex:1}}
						resetScrollToCoords={{ x: 0, y: 0 }}
						scrollEnabled={false}>
						<View style ={{flex:1, alignItems:'center' }}>
							<SettingsProperty
								marginTop = {10}
								placeHolder = 'Sema Service URL, (http://sema-service)'
								parent ={this}
								label = "SEMA service URL"
								isSecure = {false}
								valueFn = {this.getUrl}
								ref={this.url}/>
							<SettingsProperty
								marginTop = {marginSpacing}
								placeHolder = 'Site'
								parent ={this}
								isSecure = {false}
								label = "Site"
								valueFn = {this.getSite}
								ref={this.site}/>
							<SettingsProperty
								marginTop = {marginSpacing}
								placeHolder = 'User'
								parent ={this}
								label = "User email"
								isSecure = {false}
								valueFn = {this.getUser}
								ref={this.user}/>
							<SettingsProperty
								marginTop = {marginSpacing}
								placeHolder = 'Password'
								parent ={this}
								label = "password"
								isSecure = {true}
								valueFn = {this.getPassword}
								ref={this.password}/>
							<View style ={{flexDirection:'row', flex:1, alignItems:'center'}}>
								<View style={styles.submit}>
									<View style={{justifyContent:'center', height:80, alignItems:'center'}}>
										<TouchableHighlight underlayColor = '#c0c0c0'
															onPress={() => this.onUpdateSettings()}>
											<Text style={ [ styles.buttonText]}>{'Update Settings'}</Text>
										</TouchableHighlight>
									</View>
								</View>
								<View style={[ {marginLeft:50}, styles.submit]}>
									<View style={{justifyContent:'center', height:80, alignItems:'center'}}>
										<TouchableHighlight underlayColor = '#c0c0c0'
															onPress={() => this.onTestConnection()}>
											<Text style={ [ styles.buttonText]}>{'Test Connection'}</Text>
										</TouchableHighlight>
									</View>
								</View>
							</View>

						</View>

					</KeyboardAwareScrollView>
			</View>

		);
	}
	getUrl(me){
		return me.props.settings.semaUrl;
	}
	getUser(me){
		return me.props.settings.user;
	}
	getPassword(me){
		return me.props.settings.password;
	}
	getSite(me){
		return me.props.settings.site;
	}

	onCancelSettings (){
		this.props.toolbarActions.ShowScreen("main");
	}
	closeHandler(){
		this.onCancelSettings();
	};

	onUpdateSettings(){

		// TODO - Validate fields and set focus to invalid field;
		PosStorage.saveSettings(this.url.current.state.propertyText,
			this.site.current.state.propertyText,
			this.user.current.state.propertyText,
			this.password.current.state.propertyText );
		this.props.settingsActions.setSettings(PosStorage.getSettings());
		this.closeHandler();
	};

	onTestConnection() {
		let communications = new Communications(
			this.url.current.state.propertyText,
			this.site.current.state.propertyText,
			this.user.current.state.propertyText,
			this.password.current.state.propertyText);
		try {
			let message = "Successfully connected to the SEMA service";
			communications.login()
				.then(result => {
					console.log("Passed - status" + result.status + " " + JSON.stringify(result.response));
					if( result.status != 200 ) {
						message = result.response.msg + "(Error code: " + result.status + ")";
					}

					Alert.alert(
						"Network Connection",
						message,
						[
							{text: 'OK', style: 'cancel'},
						],
						{ cancelable: true }
					);
				})
				.catch(result => {console.log( "Failed- status "+ result.status + " " +  result.response);
					Alert.alert(
						"Network Connection",
						result.response.message,
						[
							{text: 'OK', style: 'cancel'},
						],
						{ cancelable: true }
					);
				})
		}catch( error ){
			console.log( JSON.stringify(error));
		}
	}

}

Settings.propTypes = {
	settings: PropTypes.object.isRequired,
	settingsActions: PropTypes.object.isRequired
};


function mapStateToProps(state, props) {
	return {settings: state.settingsReducer.settings};
}
function mapDispatchToProps(dispatch) {
	return {
		toolbarActions:bindActionCreators(ToolbarActions, dispatch),
		settingsActions:bindActionCreators(SettingsActions, dispatch)
	};
}

export default  connect(mapStateToProps, mapDispatchToProps)(Settings);

const styles = StyleSheet.create({
	headerText: {
		fontSize: 24,
		color: 'black',
		marginLeft:100
	},
	submit: {
		backgroundColor:"#2858a7",
		borderRadius:20,
		marginTop:20,

	},
	inputContainer:{
		borderWidth:2,
		borderRadius:10,
		borderColor:"#2858a7",
		backgroundColor:'white'
	},
	buttonText:{
		fontWeight:'bold',
		fontSize:28,
		color:'white',
		textAlign:'center',
		width:300,
		paddingTop:30,
		paddingBottom:30
	},
	inputText:{
		fontSize:inputFontHeight,
		alignSelf:'center',
		backgroundColor:'white',
		width:inputTextWidth,
		margin:marginTextInput

	},
	labelText:{
		fontSize:inputFontHeight,
		alignSelf:'flex-end',
		marginRight:20

	},

	dropdownText:{
		fontSize:24,
	},

	updating: {
		height:100,
		width:500,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor:'#ABC1DE',
		borderColor:"#2858a7",
		borderWidth:5,
		borderRadius:10
	},

});


