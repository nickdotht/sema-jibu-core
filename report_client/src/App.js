import React, { Component } from 'react';
import './App.css';
import './css/SeamaNav.css'
import SeamaToolbar from "./components/SeamaToolbar";
import SeamaMain from "./components/SeamaMain";
import SeamaSidebar from "./components/SeamaSidebar";
import * as RestServices from "actions/RestServices"
import moment from 'moment';
// import SeamaDatabaseError from "./components/SeamaDatabaseErrr";
import SeamaLogIn from "components/SeamaLog";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import * as loginActions from 'actions/LoginActions';

class App extends Component {

    constructor(props, context) {
        super(props, context);
        console.log("App Constructor, saveLogState");
        this.onUnload = this.onUnload.bind(this);
        var loginState =  "NotLoggedIn";
        if(typeof(window.sessionStorage) !== "undefined") {
            if( sessionStorage.getItem("saveLogState" )){
                loginState = sessionStorage.getItem("saveLogState" )
                console.log("saveLogState:", loginState);
                if( loginState !=  "NotLoggedIn"){
					this.props.loginActions.setLogin(loginState);
				}
            }
        }
//		this.props.logState = loginState;
        this.state = {
            Version: "0.0.0.3",
            LogState: loginState, // NotLoggedIn, LoggedIn, LoggedOut, NoService, BadCredentials
            // Summary: {
            //     totalGallons:20,
            //     sitePressure:42.4,
            //     flowRate: 7.24
            // },
            seamaUser:"N/A",
            seamaWaterQuality:{
                totalProduction:"N/A",
                sitePressure:"N/A",
                flowRate:"N/A"
            }
        };
        App.initializeEmptyChart( this.state.seamaWaterQuality, "production");
        App.initializeEmptyChart( this.state.seamaWaterQuality, "chlorine");
        App.initializeEmptyChart( this.state.seamaWaterQuality, "tds");
        RestServices.initializeState(this);
    }

    componentDidMount() {
        window.addEventListener("beforeunload", this.onUnload)
    }

    onUnload(event) { // the method that will be used for both add and remove event
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
                <SeamaLogIn seamaState={this.state}/>
            );
    }
    showContent() {
        return (
          <div className="SeamaNav">
              <SeamaToolbar seamaState={this.state}/>
              <SeamaSidebar seamaState={this.state}/>
              <SeamaMain seamaState={this.state}/>
         </div>
        );
    }


    udpdateHealthCheck( status){
        this.setState( status);
    }

    updateLogin( login ){
        this.setState(login);
    }
    updateWaterQualityState( waterQuality){
        console.log("updateWaterQualityState");
        let newWaterQuality = {};
        newWaterQuality.flowRate = waterQuality.flowRate;
        newWaterQuality.sitePressure = waterQuality.sitePressure;
        newWaterQuality.totalProduction = waterQuality.totalProduction;
        if( ! waterQuality.hasOwnProperty("production")){
            // FIXUP/TDOD - We need default properties... chart will break if it is called with no data
            newWaterQuality.production = { labels: [], datasets: [ { label: "", data: [],},]}
        }else{
            newWaterQuality.production = {
                labels:waterQuality.production.x_axis,
                datasets: waterQuality.production.datasets
            };
            newWaterQuality.production.datasets[0].backgroundColor = 'rgb(53, 91, 183)';
            newWaterQuality.production.labels = newWaterQuality.production.labels.map(function(time)
                {return moment(time ).format("MMM Do YY")});

            // Create the line series. This needs to be a trend line, dummy for now
            let lineSet = {
                label: "Forecast",
                data: newWaterQuality.production.datasets[0].data.map(function (value) {
                    return (value * .8)
                }),
                type: "line",
                borderColor:'rgb(231, 113, 50)',
                backgroundColor:'rgb(231, 113, 50)',
                fill:false,
                pointRadius:0,
                borderWidth:5
            };
            newWaterQuality.production.datasets.unshift(lineSet )
        }
        if( ! waterQuality.hasOwnProperty("chlorine")){
            newWaterQuality.chlorine = { labels: [], datasets: [ { label: "", data: [],},]}
        }else{
            newWaterQuality.chlorine = {
                labels:waterQuality.chlorine.x_axis,
                datasets: waterQuality.chlorine.datasets
            };
            newWaterQuality.chlorine.datasets[0].backgroundColor='rgb(53, 91, 183)';
            newWaterQuality.chlorine.datasets[0].fill=false;
            newWaterQuality.chlorine.datasets[0].pointRadius=0;
            newWaterQuality.chlorine.datasets[0].borderColor='rgb(53, 91, 183)';
            newWaterQuality.chlorine.labels = newWaterQuality.chlorine.labels.map(function(time)
                {return moment(time ).format("MMM Do YY")});
            App.createGuide(newWaterQuality.chlorine.datasets, 6.0, "red", "High");
            App.createGuide(newWaterQuality.chlorine.datasets, 2.0, "yellow", "Low");
            App.createGuide(newWaterQuality.chlorine.datasets, 4.0, "green", "ideal");
        }
        if( ! waterQuality.hasOwnProperty("tds")){
            newWaterQuality.tds = { labels: [], datasets: [ { label: "", data: [],},]}
        }else{
            newWaterQuality.tds = {
                labels:waterQuality.tds.x_axis,
                datasets: waterQuality.tds.datasets
            };
            newWaterQuality.tds.datasets[0].backgroundColor='rgb(53, 91, 183)';
            newWaterQuality.tds.datasets[0].fill=false;
            newWaterQuality.tds.datasets[0].pointRadius=0;
            newWaterQuality.tds.datasets[0].borderColor='rgb(53, 91, 183)';
            newWaterQuality.tds.labels = newWaterQuality.tds.labels.map(function(time)
                {return moment(time ).format("MMM Do YY")});
            App.createGuide(newWaterQuality.tds.datasets, 1200, "red", "Shutdown");
            App.createGuide(newWaterQuality.tds.datasets, 900, "yellow", "Risk");
            App.createGuide(newWaterQuality.tds.datasets, 600, "rgb(198,209,232", "Fair");
            App.createGuide(newWaterQuality.tds.datasets, 300, "green", "Good");
        }

        this.setState( {seamaWaterQuality:newWaterQuality});
    }
    static initializeEmptyChart( state, key ){
        state[key] = { labels: [], datasets: [ { label: "", data: [],},]}
    }
    static createGuide( datasets, yValue, color, label){
        let guideData = new Array(datasets[0].data.length);
        guideData.fill( yValue);
        let guide = {
            label: label,
            data: guideData,
            type: "line",
            borderColor:color,
            backgroundColor:color,
            fill:false,
            pointRadius:0,
            borderWidth:2
        };
        datasets.push(guide )

    }
}

function mapDispatchToProps(dispatch) {
	return {
		loginActions: bindActionCreators(loginActions, dispatch)
	};
}

function mapStateToProps(state) {
	console.log("App.mapStateToProps", JSON.stringify(state))
	return {
		logState: state.logIn.LogState
	};
}


export default connect(
	mapStateToProps,
	mapDispatchToProps
)(App);


