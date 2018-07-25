import React, {Component}  from "react";
import { View, Text, TouchableHighlight, TextInput, StyleSheet, Dimensions, Image, Alert, CheckBox, ActivityIndicator} from "react-native";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import PropTypes from 'prop-types';

import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import Synchronization from "../services/Synchronization";

import PosStorage from "../database/PosStorage";
import * as SettingsActions from "../actions/SettingsActions";
import * as ToolbarActions from "../actions/ToolBarActions";
import * as CustomerActions from "../actions/CustomerActions";

import Communications from '../services/Communications';

const {height, width} = Dimensions.get('window');
const inputFontHeight = Math.round((24 * height)/752);
const marginTextInput = Math.round((5 * height)/752);
const marginSpacing = Math.round((20 * height)/752);
const inputTextWidth = 400;
const marginInputItems = width/2 -inputTextWidth/2;

class SettingsProperty extends Component {
	constructor(props) {
		super(props);
		this.state = {propertyText : this.props.valueFn()};

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
		this.props.parent.forceUpdate();
	}
}

class SettingsButton extends Component {

	render() {
		return (
			<View style={[styles.submit, {marginLeft:30}, this.getOpacity()] }>
				<View style={[{ justifyContent: 'center', height: 70, alignItems: 'center'}] }>
					{this.showEnabled()}
				</View>
			</View>
		);
	}
	getOpacity(){
		return (this.props.enableFn()) ? {opacity:1} : {opacity:.7};
	}
	showEnabled(){
		if( this.props.enableFn()) {
			console.log( "Enabled - " + this.props.label);
			return (
				<TouchableHighlight underlayColor='#c0c0c0'
									onPress={() => this.props.pressFn()}>
					<Text style={[styles.buttonText]}>{this.props.label}</Text>
				</TouchableHighlight>
			)
		}else{
			console.log( "Disabled - " + this.props.label);
			return(<Text style={[styles.buttonText]}>{this.props.label}</Text>);
		}
	}
}

class Settings extends Component {
	constructor(props) {
		super(props);
		this.url = React.createRef();
		this.site = React.createRef();
		this.user = React.createRef();
		this.password = React.createRef();
		this.state = { animating: false };
	}

	componentDidMount() {
		console.log("Settings:Mounted");
	}

	render() {
		return (
			<View style={{ flex: 1 }}>
				<View style={{ flexDirection: 'row' }}>

					<View style={{ flexDirection: 'row', flex: 1, alignItems: 'center', height: 100 }}>
						<Text style={[styles.headerText]}>{'Settings'}</Text>
					</View>
					<View style={{ flexDirection: 'row-reverse', flex: 1, alignItems: 'center', height: 100 }}>
						<TouchableHighlight
							onPress={() => this.onCancelSettings()}>
							<Image source={require('../images/icons8-cancel-50.png')} style={{ marginRight: 100 }}/>
						</TouchableHighlight>
					</View>
				</View>

				<KeyboardAwareScrollView
					style={{ flex: 1 }}
					resetScrollToCoords={{ x: 0, y: 0 }}
					scrollEnabled={false}>
					<View style={{ flex: 1, alignItems: 'center' }}>
						<SettingsProperty
							parent = {this}
							marginTop={10}
							placeHolder='Sema Service URL, (http://sema-service)'
							label="SEMA service URL"
							isSecure={false}
							valueFn={this.getUrl.bind(this)}
							ref={this.url}/>
						<SettingsProperty
							parent = {this}
							marginTop={marginSpacing}
							placeHolder='Site'
							isSecure={false}
							label="Site"
							valueFn={this.getSite.bind(this)}
							ref={this.site}/>
						<SettingsProperty
							parent = {this}
							marginTop={marginSpacing}
							placeHolder='User'
							label="User email"
							isSecure={false}
							valueFn={this.getUser.bind(this)}
							ref={this.user}/>
						<SettingsProperty
							parent = {this}
							marginTop={marginSpacing}
							placeHolder='Password'
							label="password"
							isSecure={true}
							valueFn={this.getPassword.bind(this)}
							ref={this.password}/>
						<View style={{ flexDirection: 'row', flex: 1, alignItems: 'center' }}>
							<SettingsButton
								pressFn={this.onSaveSettings.bind(this)}
								enableFn = {this.enableSaveSettings.bind(this)}
								label='Save Settings'/>
							<SettingsButton
								pressFn={this.onConnection.bind(this)}
								enableFn = {this.enableConnectionOrSync.bind(this)}
								label='Connect'/>
							<SettingsButton
								pressFn={this.onClearAll.bind(this)}
								enableFn = {this.enableClearAll.bind(this)}
								label='Clear...'/>
							<SettingsButton
								pressFn={this.onSynchronize.bind(this)}
								enableFn = {this.enableConnectionOrSync.bind(this)}
								label='Synchronize Now'/>
						</View>
					</View>

				</KeyboardAwareScrollView>
				{this.state.animating &&
					<View style={styles.activityIndicator}>
						<ActivityIndicator size='large' />
					</View>
				}
			</View>

		);
	}


	getUrl() {
		return this.props.settings.semaUrl;
	}

	getUser() {
		return this.props.settings.user;
	}

	getPassword() {
		return this.props.settings.password;
	}

	getSite() {
		return this.props.settings.site;
	}

	onCancelSettings() {
		this.props.toolbarActions.ShowScreen("main");
	}

	closeHandler() {
		this.onCancelSettings();
	};

	onSaveSettings() {

		// TODO - Validate fields and set focus to invalid field;
		this.saveSettings(this.props.settings.token, this.props.settings.siteId);
	};

	enableSaveSettings(){
		return true;
	}
	onSynchronize(){
		Synchronization.synchronize();
	}

	onClearAll() {
		console.log("Settings:onClearAll");
		let alertMessage = "Clear All Data";
		Alert.alert(
			alertMessage,
			'Are you sure you want to delete all data? (This cannot be undone)',
			[
				{ text: 'No', onPress: () => console.log('Cancel Pressed'), style: 'cancel' },
				{
					text: 'Yes', onPress: () => {
						PosStorage.clearDataOnly();
						this.props.settingsActions.setSettings(PosStorage.getSettings());
						this.props.customerActions.setCustomers(PosStorage.getCustomers());
						Synchronization.initialize(
							PosStorage.getLastCustomerSync(),
							PosStorage.getLastProductSync(),
							PosStorage.getLastSalesSync());
						this.closeHandler();

					}
				},
			],
			{ cancelable: false }
		);

	}
	enableClearAll(){
		return true;
	}

	onConnection() {
		this.setState({animating: true});
		Communications.initialize(
			this.url.current.state.propertyText,
			this.site.current.state.propertyText,
			this.user.current.state.propertyText,
			this.password.current.state.propertyText);
		try {
			let message = "Successfully connected to the SEMA service";
			Communications.login()
				.then(result => {
					console.log("Passed - status" + result.status + " " + JSON.stringify(result.response));
					if (result.status === 200) {
						Communications.getSiteId(result.response.token, this.site.current.state.propertyText)
							.then(siteId => {
								if (siteId === -1) {
									message = "Successfully connected to the SEMA service but site '" + this.site.current.state.propertyText + "' does not exist";
								} else {

									this.saveSettings(result.response.token, siteId);
									Communications.setToken(result.response.token);
									Communications.setSiteId(siteId);
									PosStorage.setTokenExpiration();
									Synchronization.scheduleSync();
									// PosStorage.saveConfiguration( result.response.token, siteId );
									// this.props.settingsActions.setConfiguration(PosStorage.getConfiguration());
								}
								this.setState({animating: false});
								Alert.alert(
									"Network Connection",
									message, [{ text: 'OK', style: 'cancel' },], { cancelable: true }
								);
								if (siteId !== -1) {
									this.closeHandler();
								}
							});

					} else {
						this.setState({animating: false});
						message = result.response.msg + "(Error code: " + result.status + ")";
						Alert.alert(
							"Network Connection",
							message, [{ text: 'OK', style: 'cancel' },], { cancelable: true }
						);
					}
				})
				.catch(result => {
					console.log("Failed- status " + result.status + " " + result.response);
					this.setState({animating: false});
					Alert.alert(
						"Network Connection",
						result.response.message, [{ text: 'OK', style: 'cancel' },], { cancelable: true }
					);
				})
		} catch (error) {
			this.setState({animating: false});
			console.log(JSON.stringify(error));
		}
	}
	enableConnectionOrSync() {
		let url = (this.url.current ) ? this.url.current.state.propertyText : this.getUrl();
		let site = (this.site.current ) ? this.site.current.state.propertyText : this.getSite();
		let user = (this.url.current ) ? this.user.current.state.propertyText : this.getUser();
		let password = (this.password.current ) ? this.password.current.state.propertyText : this.getPassword();

		if (url.length > 0 && site.length > 0 && user.length > 0 && password.length > 0){
			return true;
		}else {
			return false;
		}
	}

	saveSettings( token, siteId) {
		PosStorage.saveSettings(this.url.current.state.propertyText,
			this.site.current.state.propertyText,
			this.user.current.state.propertyText,
			this.password.current.state.propertyText,
			token,
			siteId );
		this.props.settingsActions.setSettings(PosStorage.getSettings());
	}

}

Settings.propTypes = {
	settings: PropTypes.object.isRequired,
	settingsActions: PropTypes.object.isRequired,
	customerActions: PropTypes.object.isRequired
};


function mapStateToProps(state, props) {
	return {settings: state.settingsReducer.settings};
}
function mapDispatchToProps(dispatch) {
	return {
		toolbarActions:bindActionCreators(ToolbarActions, dispatch),
		settingsActions:bindActionCreators(SettingsActions, dispatch),
		customerActions:bindActionCreators(CustomerActions, dispatch)
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
		// paddingTop:10,
		paddingLeft:30,
		paddingRight:30
		// paddingBottom:10
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
	checkLabel: {
		left: 20,
		fontSize:24,
	},
	activityIndicator: {
		position: 'absolute',
		left: 0,
		right: 0,
		top: 0,
		bottom: 0,
		alignItems: 'center',
		justifyContent: 'center'
	}
});


