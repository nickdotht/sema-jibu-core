import React, {Component} from "react";
import {
	StyleSheet,
	Text,
	View,
	TextInput,
	Button,
} from 'react-native';
import * as CustomerSelectedActions from "../actions/CustomerSelected";
import {bindActionCreators} from "redux";
import {connect} from "react-redux";

class SelectedCustomerDetails extends React.Component {
	render() {
		return (
			<View style = {styles.commandBarContainer}>
				<View style={{ flexDirection:'row', height:40 }}>
					<Text style={styles.selectedCustomerText}>Account Name</Text>
					<Text style={styles.selectedCustomerText}>{this.getName()}</Text>
				</View>
				<View style={{ flexDirection:'row', height:40 }}>
					<Text style={styles.selectedCustomerText}>Telephone #</Text>
					<Text style={styles.selectedCustomerText}>(408)656-2041</Text>
				</View>
			</View>
		);
	}
	getName (){
		if( this.props.selectedCustomer.hasOwnProperty("name")){
			return this.props.selectedCustomer.name.first + ' ' + this.props.selectedCustomer.name.last;
		}else{
			return "";
		}
	};
}
class CustomerBarButton extends React.Component {
	render() {
		return (
			<View style={styles.Button}>
				<Button
					onPress={this.props.handler}
					title={this.props.title}
					color='#2858a7'
				/>
			</View>
		);
	}
}

class CustomerBar extends Component {
	render() {
		return (

			<View style={{ flexDirection:'row', height:100, backgroundColor:'white',  }}>
				<CustomerBarButton
					title = "Order"
					handler = {this.onOrder}
				/>
				<CustomerBarButton
					title = "Edit"
					handler = {this.onEdit}
				/>

				<CustomerBarButton
					title = "Delete"
					handler = {this.onDelete}
				/>

				<TextInput
					// Adding hint in Text Input using Place holder.
					placeholder="Search by Name or Telephone"

					// Making the Under line Transparent.
					underlineColorAndroid='transparent'
					onChangeText = {this.onTextChange}
					// Calling the custom TextInputStyleClass.
					style={ [styles.SearchInput]}/>
				<SelectedCustomerDetails selectedCustomer = {this.props.SelectedCustomer}/>
			</View>
		);
	}
	onTextChange(){

	}
	onDelete(){
		console.log("delete!")
	}
	onEdit(){
		console.log("edit!")
	}
	onOrder(){
		console.log("order!")
	}

}

function mapStateToProps(state, props) {
	return {
		SelectedCustomer: state.customerSelectedReducer.SelectedCustomer
	};
}

function mapDispatchToProps(dispatch) {
	return bindActionCreators(CustomerSelectedActions, dispatch);
}
export default connect(mapStateToProps, mapDispatchToProps)(CustomerBar);

const styles = StyleSheet.create({

	SearchInput : {
		textAlign: 'left',
		height: 50,
		borderWidth: 2,

		borderColor: '#404040',
		borderRadius: 10,
		backgroundColor: "#FFFFFF",
		flex:.25,
		alignSelf:'center',
		marginLeft:30
	},
	Button: {
		flex: .1,
		alignSelf:'center',
		height:50,
		marginLeft:30
	},
	commandBarContainer :{
		flex: .45,
		backgroundColor:'#ABC1DE',
		height:80,
		alignSelf:'center',
		marginLeft:20,
		marginRight:20
	},
	selectedCustomerText: {
		marginLeft:10,
		alignSelf:'center',
		flex:.5,
		color:'black'
	}
});

