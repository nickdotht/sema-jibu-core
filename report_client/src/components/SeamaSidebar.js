import React, { Component } from 'react';
import { ListGroup } from 'react-bootstrap';
import 'App.css';

const SeamaSidebarStyle = {
    background:"rgb(24,55,106)",
    position:"fixed",
    width:"250px",
    height:"100%",
    top:"52px",
    borderRight:"1px",
    borderRightColor:"#e0e0e0",
    borderRightStyle:"solid"
};

const SeamaListStyleActive = {
    textAlign:"left",
    paddingLeft:"20px",
    backgroundColor:"rgb(24,55,106)",
    color:"white"
};

const SeamaListStyleInactive = {
    textAlign:"left",
    paddingLeft:"20px",
    color:"rgba(255,255,255,.7)",
    backgroundColor:"rgb(24,55,106)"
};

const ImageStyle = {
    resize:"both",
    width:"249px",
    height:"80px",
};


function CustomComponent1({ children }) {
    return (
        <li className="list-group-item" onClick={() => {}} style={SeamaListStyleActive}>
            {children}
        </li>
    );
}
function CustomComponent2({ children }) {
    return (
        <li className="list-group-item" onClick={() => {}} style={SeamaListStyleInactive}>
            {children}
        </li>
    );
}

class SeamaSidebar extends Component {
    render() {
        return (
            <div style={SeamaSidebarStyle}>
                <div>
                    {<img src={require('images/sema-sidebar-logo.png')} alt="logo" style={ImageStyle} />}
                </div>
                <ListGroup>
                    <CustomComponent1 href="#" active style={SeamaListStyleActive}><i class="glyphicon glyphicon-map-marker" style={{paddingRight:"15px"}}></i>Water Operations</CustomComponent1>
                    <CustomComponent2 href="#" active style={SeamaListStyleInactive}><i class="	glyphicon glyphicon-shopping-cart" style={{paddingRight:"15px"}}></i>Sales</CustomComponent2>
                    <CustomComponent2 href="#" disabled style={SeamaListStyleInactive}><i class="glyphicon glyphicon-globe" style={{paddingRight:"15px"}}></i>Distribution Map</CustomComponent2>
                    <CustomComponent2 href="#" disabled style={SeamaListStyleInactive}><i class="glyphicon glyphicon-time" style={{paddingRight:"15px"}}></i>Delivery Schedule</CustomComponent2>
                    <CustomComponent2 href="#" disabled style={SeamaListStyleInactive}><i class="glyphicon glyphicon-inbox" style={{paddingRight:"15px"}}></i>Inventory Management</CustomComponent2>
                    <CustomComponent2 href="#" disabled style={SeamaListStyleInactive}><i class="glyphicon glyphicon-usd" style={{paddingRight:"15px"}}></i>Financials</CustomComponent2>
                </ListGroup>;
            </div>
        );
    }
}

export default SeamaSidebar;
