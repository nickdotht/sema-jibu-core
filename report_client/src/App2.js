import React, { Component } from 'react';
import { Navbar, Jumbotron, Button, Nav,NavItem,NavDropdown,MenuItem } from 'react-bootstrap';
import logo from './logo.svg';
import './App.css';

var gridStyle = {color:"orange !important", background:"pink"}
class App2 extends Component {
  render() {
    return (
      <div className="Wrapper">
          <div style={gridStyle}>One</div>
          <div style={gridStyle}>Two </div>
          <div style={gridStyle}>Three </div>
          <div style={gridStyle}>Four </div>
          <div style={gridStyle}>Five </div>
      </div>
    );
  }
}

export default App2;

