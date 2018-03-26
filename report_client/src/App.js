import React, { Component } from 'react';
import { Navbar, Jumbotron, Button, Nav,NavItem,NavDropdown,MenuItem } from 'react-bootstrap';
import logo from './logo.svg';
import './App.css';
import SeamaToolbar from "./components/SeamaToolbar";
import SeamaSidebar from "./components/SeamaSidebar";
import SeamaWaterQualityContainer from "./components/SeamaWaterQualityContainer";


var menuStyle = { background:"blue"}
var dividerStyle = { background:"white"}


class App extends Component {

  render() {
    return (
      <div className="App">
          <SeamaToolbar/>
          <SeamaSidebar/>
          <SeamaWaterQualityContainer/>
     </div>
    );
  }
}

export default App;
