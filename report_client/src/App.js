import React, { Component } from 'react';
import { Navbar, Jumbotron, Button, Nav,NavItem,NavDropdown,MenuItem } from 'react-bootstrap';
import logo from './logo.svg';
import './App.css';
import SeamaToolbar from "./components/SeamaToolbar";
import SeamaSidebar from "./components/SeamaSidebar";
import SeamaWaterQualityContainer from "./components/SeamaWaterQualityContainer";
import * as RestServices from "actions/RestServices"
import moment from 'moment';

var menuStyle = { background:"blue"}
var dividerStyle = { background:"white"}


class App extends Component {

    constructor(props, context) {
        super(props, context);

        this.state = {
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
                    labels: ["red", "green", "blue", "black"],
                    datasets: [
                        {
                            label: "Color",
                            data: [100, 200, 300, 250, 120, 400]
                        },
                    ],
                    backgroundColor: ['rgb(200, 200, 250)'],

                }

            }
        };
        RestServices.initializeState(this);
    }

    render() {
        return (
          <div className="App">
              <SeamaToolbar seamaState={this.state}/>
              <SeamaSidebar/>
              <SeamaWaterQualityContainer seamaState={this.state}/>
         </div>
        );
    }
    updateWaterQualityState( waterQuality){
        console.log("updateWaterQualityState");
        var foo = moment("2017-01-23T13:56:24.000Z");
        var newWaterQuality = {};
        newWaterQuality.flowRate = waterQuality.flowRate;
        newWaterQuality.sitePressure = waterQuality.sitePressure;
        newWaterQuality.totalProduction = waterQuality.totalProduction;
        if( ! waterQuality.hasOwnProperty("production")){
            // FIXUP/TDOD - We need default properties... chart will break if it is called with no data
            newWaterQuality.production = {
                labels: [],
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

            }
        }
        this.setState( {seamaWaterQuality:newWaterQuality});
    }
}

export default App;
