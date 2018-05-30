import React, {Component} from "react";
import {
    StyleSheet,
    View,
} from 'react-native';

import Toolbar from './Toolbar';
import {CustomerViews} from './CustomerViews'
import CustomerBar from "./CustomerBar";

import {connect} from "react-redux";
import {bindActionCreators} from 'redux';
import * as CustomerActions from '../actions/CustomerActions';

import PosStorage from "../database/PosStorage";
import Synchronization from "../services/Synchronization";

console.ignoredYellowBox = ['Warning: isMounted'];

class JibuApp extends Component {
	constructor(props) {
		super(props);

		this.state = {synchronization: {customersLoaded:false,
										productsLoaded:false}};
		this.posStorage = new PosStorage();
	}
	componentDidMount() {
		console.log("Mounted");
		this.posStorage.Initialize().then( (isInitialized) => {
			let timeout = 200;
			if (isInitialized) {
				// Data already configured
				this.state.synchronization.customersLoaded = true;
				this.props.SetCustomers(this.posStorage.GetCustomers());
				timeout = 20000;	// First sync after a bit
			}
			Synchronization.scheduleSync( this.state.synchronization, timeout, this.props.LoadCustomers );

		});

		console.log("Mounted-Done");

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
		this.state.synchronization.customersLoaded = true;
		this.posStorage.AddCustomers( this.props.customers);
	}
}

class CustomerLoaderWatcher extends React.Component {
	render() {
		return this.loaderEvent();

	}
	loaderEvent(){
		console.log("CustomerLoaderWatcher" + this.props.parent.props.customers.length);
		if( this.props.parent.props.customers.length > 0 && this.props.parent.state.synchronization.customersLoaded  === false){
			// Must synchronize loaded customers with the ones we have
			this.props.parent.SynchronizeCustomers();
		}
		return null;
	}
}

function mapStateToProps(state, props) {
	return {
		selectedCustomer: state.customerReducer.selectedCustomer,
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
