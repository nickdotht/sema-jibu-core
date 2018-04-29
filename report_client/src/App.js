import React, { Component } from 'react';
import './App.css';
import './css/SeamaNav.css'
import SeamaToolbar from "./components/SeamaToolbar";
import SeamaMain from "./components/SeamaMain";
import SeamaSidebar from "./components/SeamaSidebar";
import SeamaLogIn from "components/SeamaLog";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import * as loginActions from 'actions/LoginActions';
import { withRouter } from 'react-router'

const Version = "0.0.0.5";
class App extends Component {

    constructor(props, context) {
        super(props, context);
        console.log("App Constructor, saveLogState");
        this.onUnload = this.onUnload.bind(this);
        let loginState =  "NotLoggedIn";
        if(typeof(window.sessionStorage) !== "undefined") {
            if( sessionStorage.getItem("saveLogState" )){
                loginState = sessionStorage.getItem("saveLogState" );
                console.log("saveLogState:", loginState);
                if( loginState !==  "NotLoggedIn"){
					this.props.loginActions.setLogin(loginState);
				}
            }
        }
    }
	componentWillMount() {
		this.unlisten = this.props.history.listen((location, action) => {
			console.log("on route change");
		});
	}
	componentWillUnmount() {
		this.unlisten();
	}

    componentDidMount() {
        window.addEventListener("beforeunload", this.onUnload)
    }

    onUnload() { // the method that will be used for both add and remove event
        if(typeof(window.sessionStorage) !== "undefined") {
            sessionStorage.setItem("saveLogState", this.props.logState );
        }
    }

    render() {
        return this.showContentOrLogin();
    }
    showContentOrLogin(){
        if( this.props.logState !== "LoggedIn" ){
            return this.showLogin();
        }else{
            return this.showContent()
        }
    }
    showLogin(){
        return(
                <SeamaLogIn/>
            );
    }
    showContent() {
        return (
          <div className="SeamaNav">
              <SeamaToolbar Version={Version}/>
              <SeamaSidebar/>
              <SeamaMain/>
         </div>
        );
    }
}

function mapDispatchToProps(dispatch) {
	return {
		loginActions: bindActionCreators(loginActions, dispatch)
	};
}

function mapStateToProps(state) {
	return {
		logState: state.logIn.LogState
	};
}


export default withRouter(connect(
	mapStateToProps,
	mapDispatchToProps
)(App));


