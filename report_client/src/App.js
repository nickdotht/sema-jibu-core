import React, { Component } from 'react';
import './App.css';
import SeamaToolbar from "./components/SeamaToolbar";
import SeamaWaterQualityContainer from "./components/SeamaWaterQualityContainer";
import * as RestServices from "actions/RestServices"
import moment from 'moment';


class App extends Component {

    constructor(props, context) {
        super(props, context);

        this.state = {
            Version: "0.0.0.2",
            Summary: {
                totalGallons:20,
                sitePressure:42.4,
                flowRate: 7.24
            },
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

    render() {
        return (
          <div className="App">
              <SeamaToolbar seamaState={this.state}/>
              <SeamaWaterQualityContainer seamaState={this.state}/>
         </div>
        );
    }
    udpdateHealthCheck( status){
        this.setState( status);
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

export default App;
