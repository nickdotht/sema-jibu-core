import React, {Component} from "react";
import {
    StyleSheet,
    View,
	Text,
	Image,
	TouchableHighlight
} from 'react-native';
import packageJson from '../../package.json';

import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import * as CustomerActions from "../actions/CustomerActions";
import networkReducer from "../reducers/NetworkReducer";
import * as ToolBarActions from "../actions/ToolBarActions";
import PosStorage from "../database/PosStorage";

class Toolbar extends Component {
    render() {
        return (
        	<View style ={styles.toolbar}>
				<View style = {[styles.leftToolbar]}>
					<Image source={require('../images/jibu-logo.png')} resizeMode ='stretch' style={styles.logoSize}/>
					<TouchableHighlight onPress={() => this.onVersion()}>
						<Text style = {[styles.text_style, {marginLeft:50}]}>Version {packageJson.version}</Text>
					</TouchableHighlight>
					<Text style = {[styles.text_style, {marginLeft:20}, this.getNetworkStyle()]}>{this.getNetworkState()}</Text>
					<Text style = {[styles.text_style, {marginLeft:30}]}>Site:</Text>
					<View style = {[styles.site_container, {marginLeft:20}]}>
						<Text style = {styles.site_text}>{this.props.settings.settings.site}</Text>
					</View>
				</View>
				<View style = {[styles.rightToolbar]}>
					<TouchableHighlight onPress={() => this.onSettings()}>
						<Image source={require('../images/gear-icon.png')} resizeMode ='stretch' style={[styles.iconSize, {marginRight:20} ]}/>
					</TouchableHighlight>
					<TouchableHighlight onPress={() => this.onLogout()}>
						<Text style = {[styles.text_style,{marginRight:20}]}>Logout</Text>
					</TouchableHighlight>
					<Text style = {[styles.text_style,{marginRight:20} ]}>Dan Nolan</Text>
					<TouchableHighlight onPress={() => this.onShowRemoteReport()}>
						<Image source={require('../images/report-icon.png')} resizeMode ='stretch' style={[styles.iconSize, {marginRight:20} ]}/>
					</TouchableHighlight>
				</View>
			</View>
        );
    }
    getNetworkState  = () =>{
    	return this.props.network.isNWConnected ? "ONLINE" : "OFFLINE";
	};
	getNetworkStyle  = () =>{
		return this.props.network.isNWConnected ? {} : {color:'red'};
	};

	onShowRemoteReport = () =>{
        console.log("onShowRemoteReport");
        if( this.props.showScreen.screenToShow === "main") {
			this.props.toolbarActions.ShowScreen("report");
		}else{
			this.props.toolbarActions.ShowScreen("main");

		}
    };
	onVersion= () =>{
		console.log("onVersion");
	};

	onLogout= () =>{
		console.log("onLogout");
		this.props.toolbarActions.SetLoggedIn(false);
	};

	onSettings= () =>{
		console.log("onSettings");
		if( this.props.showScreen.screenToShow !== "settings") {
			this.props.toolbarActions.ShowScreen("settings");
		}
	};
}

function mapStateToProps(state, props) {
	return {
		network: state.networkReducer.network,
		showScreen: state.toolBarReducer.showScreen,
		settings:state.settingsReducer
	};
}


function mapDispatchToProps(dispatch) {
	return {customerActions:bindActionCreators(CustomerActions, dispatch),
		toolbarActions:bindActionCreators(ToolBarActions, dispatch)};
}

export default connect(mapStateToProps, mapDispatchToProps)(Toolbar);

const styles = StyleSheet.create({
    toolbar: {
        backgroundColor: '#2858a7',
        height: 56,
		flexDirection:'row',


    },
	leftToolbar: {
		flexDirection:'row',
		flex:1,
		alignItems:'center'

	},
	rightToolbar: {
		flexDirection:'row-reverse',
		flex:1,
		alignItems:'center'

	},

	toolbar_old: {
		backgroundColor: '#2858a7',
		height: 56,
		alignSelf: 'stretch',

	},
	text_style: {
		color:'white',
		fontSize:20,
		fontWeight:'bold'
	},
	logoSize: {
		width: 50,
		height: 50,
		left:20
	},
	iconSize: {
		width: 40,
		height: 40,
		// right:20
	},
	site_container: {
		backgroundColor:'#E0E0E0',
		// width:200,
		height:42,
		justifyContent:'center',
		alignItems:'center',
		paddingLeft:20,
		paddingRight:20,
		borderRadius:5
	},
	site_text:{
		fontSize:18,
		fontWeight:'bold'

	}


});
