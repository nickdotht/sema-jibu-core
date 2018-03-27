import React, { Component } from 'react';
import { Navbar, Jumbotron, Button, Nav,NavItem,NavDropdown,MenuItem } from 'react-bootstrap';
import logo from './logo.svg';
import './App.css';
import SeamaToolbar from "./components/SeamaToolbar";
import SeamaSidebar from "./components/SeamaSidebar";
import SeamaWaterQualityContainer from "./components/SeamaWaterQualityContainer";
import * as RestServices from "actions/RestServices"

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
}

export default App;
