import React, {Component} from "react";
import {
	StyleSheet,
	Text,
	View,
	TextInput,
	Button,
} from 'react-native';

import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import PosStorage from "../database/PosStorage";
import * as NetworkActions from "../actions/NetworkActions";
import * as CustomerActions from "../actions/CustomerActions";
import * as CustomerBarActions from "../actions/CustomerBarActions";

import CustomerBarButton from './CustomerBarButton';

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
					<Text style={styles.selectedCustomerText}>{this.getPhone()}</Text>
				</View>
			</View>
		);
	}
	getName (){
		if( this.props.selectedCustomer.hasOwnProperty("contact_name")){
			return this.props.selectedCustomer.contact_name;
		}else{
			return "";
		}
	};
	getPhone (){
		if( this.props.selectedCustomer.hasOwnProperty("phone_number")){
			return this.props.selectedCustomer.phone_number;
		}else{
			return "";
		}
	};

}

class CustomerBar extends Component {
	constructor(props) {
		super(props);

		this.state = {
			addFunction: true,
			orderFunction: true,
			editFunction: true,
			deleteFunction: true
		}
	}

	render() {
		return (

			<View style={{ flexDirection:'row', height:100, backgroundColor:'white',  }}>
				<CustomerBarButton
					title = "Add"
					handler = {this.onAdd}
					enabled = {this.state.addFunction}
				/>
				<CustomerBarButton
					title = "Order"
					handler = {this.onOrder}
					enabled = {this.state.orderFunction}
				/>
				<CustomerBarButton
					title = "Edit"
					handler = {this.onEdit}
					enabled = {this.state.editFunction}
				/>

				<CustomerBarButton
					title = "Delete"
					handler = {this.onDelete}
					enabled = {this.state.deleteFunction}
				/>

				<TextInput
					// Adding hint in Text Input using Place holder.
					placeholder="Search by Name or Telephone"

					// Making the Under line Transparent.
					underlineColorAndroid='transparent'
					onChangeText = {this.onTextChange}
					value={this.props.searchString}
					style={ [styles.SearchInput]}/>
				<SelectedCustomerDetails selectedCustomer = {this.props.selectedCustomer}/>
			</View>
		);
	}
	onTextChange = (searchText) =>{
		console.log( searchText );
		this.props.customerActions.SearchCustomers( searchText);
		console.log( "onTextChange ---" + this.props.customers.length);

	};

	onDelete = () =>{
		console.log("delete!");
		let posStorage = new PosStorage();
		posStorage.ClearAll();
	}
	onEdit = () =>{
		console.log("edit!")
		this.props.customerBarActions.ShowHideCustomers(1);
		this.setState({'addFunction' : true } )
		this.setState({'deleteFunction' : true } )
		this.setState({'orderFunction' : true } )
	}
	onOrder = () =>{
		console.log("order!");
		this.props.customerBarActions.ShowHideCustomers(0);
		this.setState({'addFunction' : false } )
		this.setState({'deleteFunction' : false } )
		this.setState({'orderFunction' : false } )

	}
	onAdd = () =>{
		console.log("Add!")
		let posStorage = new PosStorage();
		posStorage.Initialize();

	}


}

function mapStateToProps(state, props) {
	return {
		selectedCustomer: state.customerReducer.selectedCustomer,
		customers: state.customerReducer.customers,
		searchString: state.customerReducer.searchString,
	};
}

function mapDispatchToProps(dispatch) {
	return {customerActions:bindActionCreators(CustomerActions, dispatch),
		networkActions:bindActionCreators(NetworkActions, dispatch),
		customerBarActions:bindActionCreators(CustomerBarActions, dispatch)};
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

