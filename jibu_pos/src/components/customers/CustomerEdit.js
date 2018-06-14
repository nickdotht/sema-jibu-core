import React, {Component}  from "react";
import { View, Text, TouchableHighlight, TextInput, StyleSheet, Modal, ImageBackground, Image } from "react-native";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import * as ToolbarActions from "../actions/ToolBarActions";

class CustomerEdit extends Component {
	constructor(props) {
		super(props);

	}
	componentDidMount() {
		console.log("CustomerEdit = Mounted");
	}

	render() {
		return (
			<View style={{flex:1}}>
				<Text style = {styles.headerText}>{this.getHeaderText()}</Text>
					<KeyboardAwareScrollView
						style={{flex:1}}
						resetScrollToCoords={{ x: 0, y: 0 }}
						scrollEnabled={false}>
						<View style ={{flex:1, alignItems:'center' }}>
							<View style ={{marginTop:'5%'}}>
								<Image source={require('../images/jibu-logo.png')} resizeMode ='stretch' style={styles.logoSize}/>
							</View>
							<View style ={[{marginTop:40}, styles.inputContainer]}>
								<TextInput
									style = {[styles.inputText, ]}
									underlineColorAndroid='transparent'
									placeholder = 'User name or email'/>

							</View>
							<View style ={[{marginTop:40}, styles.inputContainer]}>
								<TextInput
									style = {[styles.inputText, ]}
									underlineColorAndroid='transparent'
									secureTextEntry = {true}
									placeholder = 'Password'/>
							</View>
							<View style={styles.signIn}>
								<View style={{justifyContent:'center', height:100, width:'30%', alignItems:'center'}}>
									<TouchableHighlight underlayColor = '#c0c0c0'
														onPress={() => this.onLogin()}>
										<Text style={ [ {paddingTop:30, paddingBottom:30, width:300 }, styles.buttonText]}>Sign In</Text>
									</TouchableHighlight>
								</View>
							</View>
							<Modal visible = {this.state.isLoginComplete}
								   backdropColor={'red'}
								   transparent ={true}
								   onRequestClose ={this.closeHandler}>
								{this.ShowLoggingIn()}
							</Modal>
						</View>

					</KeyboardAwareScrollView>
			</View>

		);
	}
	closeHandler= ()=>{
		this.setState( {isLoginComplete:false} );
	};

	onLogin= ()=>{
		this.setState( {isLoginComplete:true} );
	};
	ShowLoggingIn = () =>{
		let that = this;
		if( this.state.isLoginComplete ) {
			setTimeout(() => {
				that.closeHandler();
				that.props.toolbarActions.SetLoggedIn(true);
			}, 1500);
		}
		return (
			<View style={{
				flex: 1,
				flexDirection: 'column',
				justifyContent: 'center',
				alignItems: 'center'
			}}>

				<View style={styles.loggingIn}>
					<Text style={{fontSize:24, fontWeight:'bold'}}>Signing in....</Text>
				</View>
			</View>
		);
	};

}



function mapStateToProps(state, props) {
	return {};
}
function mapDispatchToProps(dispatch) {
	return {
		toolbarActions:bindActionCreators(ToolbarActions, dispatch)
	};
}

export default  connect(mapStateToProps, mapDispatchToProps)(CustomerEdit);

const styles = StyleSheet.create({
	headerText: {
		fontSize: 24,
		alignSelf: 'center',
		backgroundColor: 'white',
		width: 400,
		margin: 5
	},
		imgBackground: {
		width: '100%',
		height: '100%',
		flex: 1
	},
	signIn: {
		backgroundColor:"#2858a7",
		borderRadius:20,
		marginTop:40,

	},
	inputContainer:{
		borderWidth:5,
		borderRadius:15,
		borderColor:"#2858a7",
		backgroundColor:'white'
	},
	headerText:{
		fontSize:24,
		alignSelf:'center',
		backgroundColor:'white',
		width:400,
		margin:5

	},
	buttonText:{
		fontWeight:'bold',
		fontSize:28,
		color:'white',
		textAlign:'center',
		width:300
	},
	loggingIn: {
		height:100,
		width:500,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor:'#ABC1DE',
		borderColor:"#2858a7",
		borderWidth:5,
		borderRadius:10
	},
	logoSize: {
		width: 200,
		height: 200,
	},



});


