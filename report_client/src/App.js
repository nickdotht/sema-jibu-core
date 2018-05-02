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
import * as kioskActions from 'actions/KioskActions';
import { withRouter } from 'react-router'
import * as waterOperationsActions from 'actions/WaterOperationsActions';
import * as salesActions from 'actions/SalesActions';

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
    	let self = this;
		this.unlisten = this.props.history.listen((location, action) => {
			console.log("on route change", self);
			switch( location.pathname ){
				case "/":
					if( ! this.props.waterOperations.loaded ){
						this.props.waterOperationsActions.fetchWaterOperations(this.props.kiosk.selectedKiosk);
					}
					break;
				case "/Sales":
					// Hack to force the google map to update.
					let self = this;
					setTimeout(()=> {
						self.props.salesActions.forceUpdate();
					}, 100);
					if( ! this.props.sales.loaded ){
						this.props.kiosk.selectedKiosk.period="month";	// TODO Derive from filter
						this.props.salesActions.fetchSales(this.props.kiosk.selectedKiosk);
					}
					break;

			}
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
		loginActions: bindActionCreators(loginActions, dispatch),
		kioskActions: bindActionCreators(kioskActions, dispatch),
		waterOperationsActions: bindActionCreators(waterOperationsActions, dispatch),
		salesActions: bindActionCreators(salesActions, dispatch)
	};
}

function mapStateToProps(state) {
	return {
		logState: state.logIn.LogState,
		kiosk:state.kiosk,
		waterOperations:state.waterOperations,
		sales:state.sales
	};
}


export default withRouter(connect(
	mapStateToProps,
	mapDispatchToProps
)(App));


