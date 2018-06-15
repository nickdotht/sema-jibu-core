import React, {Component}  from "react";
import { View, Text, TouchableHighlight, TextInput, StyleSheet, Modal, Image, Picker } from "react-native";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import * as ToolbarActions from "../../actions/ToolBarActions";

class CustomerEdit extends Component {
	constructor(props) {
		super(props);
		this.state = {isEditInProgress : false};
	}
	componentDidMount() {
		console.log("CustomerEdit = Mounted");
	}

	render() {
		return (
			<View style={{flex:1}}>
				<View style = {{flexDirection:'row'}}>

					<View style ={{flexDirection:'row', flex:1, alignItems:'center', height:100}}>
						<Text style = {[styles.headerText]}>{this.getHeaderText()}</Text>
					</View>
					<View style ={{flexDirection:'row-reverse', flex:1, alignItems:'center', height:100}}>
						<TouchableHighlight
							onPress={() => this.onCancelEdit()}>
							<Image source={require('../../images/icons8-cancel-50.png')} style={{marginRight:100}}/>
						</TouchableHighlight>
						{/*<Image source={require('../../images/icons8-cancel-50.png')} />;*/}
					</View>
				</View>

				<KeyboardAwareScrollView
						style={{flex:1}}
						resetScrollToCoords={{ x: 0, y: 0 }}
						scrollEnabled={false}>
						<View style ={{flex:1, alignItems:'center' }}>
							<View style ={[{marginTop:10}, styles.inputContainer]}>
								<TextInput
									style = {[styles.inputText, ]}
									underlineColorAndroid='transparent'
									placeholder = 'Telephone Number'/>

							</View>
							<View style ={[{marginTop:40}, styles.inputContainer]}>
								<TextInput
									style = {[styles.inputText, ]}
									underlineColorAndroid='transparent'
									placeholder = 'Name'/>
							</View>
							<View style ={[{marginTop:40}, styles.inputContainer]}>
								<TextInput
									style = {[styles.inputText, ]}
									underlineColorAndroid='transparent'
									placeholder = 'Address'/>
							</View>
							<Picker
								selectedValue={"js"}
								style={{ height: 50, width: 100, fontSize:20 }}
								mode={'dropdown'}
								onValueChange={(itemValue, itemIndex) => this.setState({language: itemValue})}>
								<Picker.Item label="Java" value="java" />
								<Picker.Item label="JavaScript" value="js" />
							</Picker>

							<View style={styles.submit}>
								<View style={{justifyContent:'center', height:100, width:'30%', alignItems:'center'}}>
									<TouchableHighlight underlayColor = '#c0c0c0'
														onPress={() => this.onEdit()}>
										<Text style={ [ {paddingTop:30, paddingBottom:30, width:300 }, styles.buttonText]}>{this.getSubmitText()}</Text>
									</TouchableHighlight>
								</View>
							</View>

							<Modal visible = {this.state.isEditInProgress}
								   backdropColor={'red'}
								   transparent ={true}
								   onRequestClose ={this.closeHandler}>
								{this.showEditInProgress()}
							</Modal>
						</View>

					</KeyboardAwareScrollView>
			</View>

		);
	}
	getHeaderText(){
		return this.props.isEdit ? "Edit Customer" : "New Customer";
	}
	getSubmitText(){
		return this.props.isEdit ? "Update Customer" : "Create Customer";
	}
	onCancelEdit (){
		this.props.toolbarActions.ShowScreen("main");
	}
	closeHandler= ()=>{
		this.setState( {isEditInProgress:false} );
		this.onCancelEdit();
	};

	onEdit= ()=>{
		this.setState( {isEditInProgress:true} );
	};
	showEditInProgress = () =>{
		let that = this;
		if( this.state.isEditInProgress ) {
			setTimeout(() => {
				that.closeHandler();
			}, 1000);
		}
		return (
			<View style={{
				flex: 1,
				flexDirection: 'column',
				justifyContent: 'center',
				alignItems: 'center'
			}}>

				<View style={styles.updating}>
					<Text style={{fontSize:24, fontWeight:'bold'}}>Updating....</Text>
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
		color: 'black',
		marginLeft:100
	},
	submit: {
		backgroundColor:"#2858a7",
		borderRadius:20,
		marginTop:40,

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
		width:300
	},
	inputText:{
		fontSize:24,
		alignSelf:'center',
		backgroundColor:'white',
		width:400,
		margin:5

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


