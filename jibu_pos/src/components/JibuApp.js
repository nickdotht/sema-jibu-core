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
let that = null;

class JibuApp extends Component {
	constructor(props) {
		super(props);

		this.state = {};
	}
	componentDidMount() {
		console.log("Mounted");
		this.props.LoadCustomers();
	}
    render() {
        return (

            <View style={{ flex: 1 }}>
                <Toolbar/>
				<CustomerBar/>
				<CustomerViews screenProps={{customerSelectionChanged:this.customerSelectionChanged,
											 foo: "foobar"}}/>
             </View>
        );
    }
    customerSelectionChanged( customer ){
    	console.log("customerSelectionChanged");
		// that.props.CustomerSelected( customer)
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
