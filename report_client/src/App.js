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
            Version: "0.0.0.1",
            Summary: {
                totalGallons:20,
                sitePressure:42.4,
                flowRate: 7.24
            },
            seamaUser:"N/A",
            seamaWaterQuality:{
                totalProduction:"N/A",
                sitePressure:"N/A",
                flowRate:"N/A",
                production :{
                    labels: [],
                    datasets: [
                        {
                            label: "",
                            data: [],
                            backgroundColor: 'rgb(53, 91, 183)',
                        },

                    ],
                }

            }
        };
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
    updateWaterQualityState( waterQuality){
        console.log("updateWaterQualityState");
        let newWaterQuality = {};
        newWaterQuality.flowRate = waterQuality.flowRate;
        newWaterQuality.sitePressure = waterQuality.sitePressure;
        newWaterQuality.totalProduction = waterQuality.totalProduction;
        if( ! waterQuality.hasOwnProperty("production")){
            // FIXUP/TDOD - We need default properties... chart will break if it is called with no data
            newWaterQuality.production = {
                labels: [],
                x_axis:[],
                datasets: [
                    {
                        label: "",
                        data: []
                    },
                ],
            }
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
                fill:false,
                pointRadius:0,
                borderWidth:5
            };
            newWaterQuality.production.datasets.unshift(lineSet )
        }
        this.setState( {seamaWaterQuality:newWaterQuality});
    }
}

export default App;
