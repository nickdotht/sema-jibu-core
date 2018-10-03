import React, { Component } from 'react';
import './App.css';
import './css/SeamaNav.css'
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import {
	authActions
} from 'actions';
import { history } from './utils';
import {
	Router
} from 'react-router-dom';
import {
	SemaContainer,
	SemaLogin
} from 'components';

class App extends Component {
	userIsValid(){
		if( this.props.auth.currentUser ){
			let now = Date.now()/1000;
			if( now < this.props.auth.currentUser.exp ){
				console.log("Token is valid - Proceed to home page");
				return true;
			}
		}
		return false;
	}

	render() {
		return (
			<Router history={ history }>
				{this.userIsValid() ?
					<SemaContainer /> :
					<SemaLogin />
				}
			</Router>
		);
	}
}

function mapDispatchToProps(dispatch) {
	return {
		authActions: bindActionCreators(authActions, dispatch),
	};
}

function mapStateToProps(state) {
	return {
		auth: state.auth
	};
}


export default connect(
	mapStateToProps,
	mapDispatchToProps
)(App);
