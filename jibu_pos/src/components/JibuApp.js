import React, {Component} from "react";
import {
    StyleSheet,
    View,
	NetInfo,
} from 'react-native';

import Toolbar from './Toolbar';
import {CustomerViews} from './customers/CustomerViews'
import CustomerBar from "./customers/CustomerBar";
import OrderView from "./orders/OrderView"
import {bindActionCreators} from 'redux';

import {connect} from "react-redux";
import * as CustomerActions from '../actions/CustomerActions';
import * as NetworkActions from '../actions/NetworkActions';


import PosStorage from "../database/PosStorage";
import Synchronization from "../services/Synchronization";

console.ignoredYellowBox = ['Warning: isMounted'];

class JibuApp extends Component {
	constructor(props) {
		super(props);

		this.state = {synchronization: {customersLoaded:false,
										productsLoaded:false},
					  isConnected: false};
		this.posStorage = new PosStorage();
	}
	componentDidMount() {
		console.log("Mounted");
		this.posStorage.Initialize().then( (isInitialized) => {
			let timeout = 200;
			if (isInitialized) {
				// Data already configured
				this.state.synchronization.customersLoaded = true;
				this.props.customerActions.SetCustomers(this.posStorage.GetCustomers());
				timeout = 20000;	// First sync after a bit
			}
			Synchronization.scheduleSync( this.state.synchronization, timeout, this.props.customerActions.LoadCustomers );

		});
		NetInfo.isConnected.addEventListener('connectionChange', this.handleConnectivityChange);

		console.log("Mounted-Done");

	}
    render() {
        return (

            <View style={{ flex: 1 }}>
                <Toolbar/>
				<CustomerBar/>
				<ViewSwitcher Jibu={this}/>
				{/*<View style={{flex: this.props.showView.showCustomers}}>*/}
					{/*<CustomerViews screenProps={{parent:this}}/>*/}
				{/*</View>*/}
				{/*<View style={{flex: this.props.showView.showNewOrder}}>*/}
					{/*<OrderView/>*/}
				{/*</View>*/}
				<CustomerLoaderWatcher parent={ this}/>
             </View>
        );
    }
    // customerSelectionChanged( customer ){
    // 	console.log("customerSelectionChanged");
		// // that.props.CustomerSelected( customer)
    // }

    SynchronizeCustomers() {
		console.log("SynchronizeCustomers");
		this.state.synchronization.customersLoaded = true;
		this.posStorage.AddCustomers( this.props.customers);
	}

	handleConnectivityChange = isConnected => {
		console.log("handleConnectivityChange: " + isConnected);
		this.props.networkActions.NetworkConnection(isConnected);
	};
}
class ViewSwitcher extends Component {

	render() {
		if (this.props.Jibu.props.showView.showNewOrder ) {
			return (<OrderView/>)
		} else {
			return (<CustomerViews screenProps={{parent: this.props.Jibu}}/>)
		}
	}
}

function mapStateToProps(state, props) {
	return {
		selectedCustomer: state.customerReducer.selectedCustomer,
		customers: state.customerReducer.customers,
		isNWConnected: state.networkReducer.isNWConnected,
		showView: state.customerBarReducer.showView

	};
}

function mapDispatchToProps(dispatch) {
	return {customerActions:bindActionCreators(CustomerActions, dispatch),
		networkActions:bindActionCreators(NetworkActions, dispatch)};
}

//Connect everything
export default connect(mapStateToProps, mapDispatchToProps)(JibuApp);

class CustomerLoaderWatcher extends React.Component {
	render() {
		return this.loaderEvent();

	}
	loaderEvent(){
		console.log("CustomerLoaderWatcher. No of customers: " + this.props.parent.props.customers.length);
		if( this.props.parent.props.customers.length > 0 && this.props.parent.state.synchronization.customersLoaded  === false){
			// Must synchronize loaded customers with the ones we have
			this.props.parent.SynchronizeCustomers();
		}
		return null;
	}
}

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
