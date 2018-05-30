import React, {Component} from "react";
import {
	StyleSheet,
	Text,
	View,
	TextInput,
	Button,
} from 'react-native';
import * as CustomerActions from "../actions/CustomerActions";
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import PosStorage from "../database/PosStorage";

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
					title = "Add"
					handler = {this.onAdd}
				/>
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
					value={this.props.searchString}
					style={ [styles.SearchInput]}/>
				<SelectedCustomerDetails selectedCustomer = {this.props.selectedCustomer}/>
			</View>
		);
	}
	onTextChange = (searchText) =>{
		console.log( searchText );
		this.props.SearchCustomers( searchText);
		console.log( "onTextChange ---" + this.props.customers.length);

	};

	onDelete(){
		console.log("delete!");
		let posStorage = new PosStorage();
		posStorage.ClearAll();
	}
	onEdit(){
		console.log("edit!")
	}
	onOrder(){
		console.log("order!");
		let posStorage = new PosStorage();
		posStorage.Initialize();

	}
	onAdd(){
		console.log("Add!")

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
	return bindActionCreators(CustomerActions, dispatch);
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

