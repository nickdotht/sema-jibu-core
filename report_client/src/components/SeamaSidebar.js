import React, { Component } from 'react';
import { Navbar, Jumbotron, Button, Nav,NavItem,NavDropdown,MenuItem } from 'react-bootstrap';
import 'App.css';

var SeamaSidebarStyle = {
    background:"#f8f8f8",
    position:"fixed",
    width:"250px",
    height:"100%",
    top:"52px",
    borderRight:"1px",
    borderRightColor:"#e0e0e0",
    borderRightStyle:"solid"
}


class SeamaSidebar extends Component {
    render() {
        return (
            <div style={SeamaSidebarStyle}>
            </div>
        );
    }
}

export default SeamaSidebar;
