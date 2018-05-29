import React, {Component} from "react";
import {
    StyleSheet,
    Text,
    View,
    ToolbarAndroid
} from 'react-native';

import Toolbar from './Toolbar';
import {CustomerViews} from './CustomerViews'
import CustomerBar from "./CustomerBar";

import {connect} from "react-redux";
import {bindActionCreators} from 'redux';
import * as CustomerActions from '../actions/CustomerActions';
import customerReducer from "../reducers/CustomerReducer";
import {CUSTOMERS_LOADED} from "../actions/CustomerActions";
import mock_customers from "../mock_data/customers";
// import InitializeDB from "../database/InitializeDatabase";
import PosStorage from "../database/PosStorage";
let that = null;

class JibuApp extends Component {
	constructor(props) {
		super(props);

		this.state = {customersLoaded:false};
		this.posStorage = new PosStorage();
	}
	componentDidMount() {
		console.log("Mounted");
		this.posStorage.Initialize();
		this.props.LoadCustomers();
		// let database = new InitializeDB();
		// database.InitializeDatabase().then(() => {
		// 	console.log("succeeded");
		// }).catch( (error) =>{
		// 	console.log("failed");
		// });
		console.log("Mounted-Done");
		//this.props.LoadCustomers();

	}
    render() {
        return (

            <View style={{ flex: 1 }}>
                <Toolbar/>
				<CustomerBar/>
				<CustomerViews screenProps={{customerSelectionChanged:this.customerSelectionChanged,
											 foo: "foobar"}}/>
				<CustomerLoaderWatcher parent={ this}/>
             </View>
        );
    }
    customerSelectionChanged( customer ){
    	console.log("customerSelectionChanged");
		// that.props.CustomerSelected( customer)
    }

    SynchronizeCustomers() {
		console.log("SynchronizeCustomers");
	}
}

class CustomerLoaderWatcher extends React.Component {
	render() {
		return this.loaderEvent();

	}
	loaderEvent(){
		console.log("CustomerLoaderWatcher");
		console.log("CustomerLoaderWatcher" + this.props.parent.props.customers.length);
		if( this.props.parent.props.customers.length > 0 && this.props.parent.state.customersLoaded  === false){
			// Must synchronize loaded customers with the ones we have
			this.props.parent.SynchronizeCustomers();
		}
		return null;
	}
}

function mapStateToProps(state, props) {
	return {
		SelectedCustomer: state.customerReducer.SelectedCustomer,
		customers: state.customerReducer.customers
	};
}

function mapDispatchToProps(dispatch) {
	return bindActionCreators(CustomerActions, dispatch);
}


//Connect everything
export default connect(mapStateToProps, mapDispatchToProps)(JibuApp);


const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
    },
    welcome: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10,
    },
    instructions: {
        textAlign: 'center',
        color: '#333333',
        marginBottom: 5,
    },
});
