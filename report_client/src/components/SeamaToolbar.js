import React, { Component } from 'react';
import { Navbar, Label, Nav,NavItem,NavDropdown,MenuItem } from 'react-bootstrap';
import 'App.css';
import * as RestServices from "actions/RestServices"

var menuStyle = {}

const ImageStyle = {
    resize:"both",
    width:"180px",
    height:"60px",
};

const LabelStyleLeft = {
    float:"left",
    background:"none",
    marginTop:"15px",
    fontSize:"14px",
    fontWeight: "normal"
};
const LabelStyleRight = {
    float:"right",
    background:"none",
    marginTop:"15px",
    fontSize:"14px",
    fontWeight: "normal"
};

class SeamaToolbar extends Component {
    constructor(props, context) {
        super(props, context);
        console.log("SeamaToolbar-constructor");
        this.handleSelect = this.handleSelect.bind(this);
        this.buildMenuItems = this.buildMenuItems.bind(this);

        this.state = {title: "--Kiosks--"};
    }

    componentDidMount() {
        RestServices.fetchSeamaUser();
        RestServices.fetchSeamaKiosks();
    }

    handleSelect(eventKey, foo){
        console.log(eventKey, this.props.seamaState.seamaKiosk[eventKey].name);
        this.setState({title: this.props.seamaState.seamaKiosk[eventKey].name});
        var kioskParams = {kioskID:this.props.seamaState.seamaKiosk[eventKey].id};
        RestServices.fetchWaterQuality(kioskParams);
    };

    buildMenuItems(){
         var menuItems = [];
        if( this.props.seamaState.seamaKiosk){
            var keys = Object.keys(this.props.seamaState.seamaKiosk);
            for( var i = 0; i < keys.length; i++ ){
                var kiosk = this.props.seamaState.seamaKiosk[keys[i]];
                 menuItems.push(<MenuItem eventKey={keys[i]}style={menuStyle}>{kiosk.name}</MenuItem>);
            }
        }
        return menuItems;
    }
    render() {
        return (
            <div>
                <Navbar bsStyle="inverse">
                    <Navbar.Header >
                        <Navbar.Brand>
                            {<img src={require('images/dlo_image.png')} alt="logo" style={ImageStyle} />}
                        </Navbar.Brand>
                    </Navbar.Header>
                    <Label  eventKey={1} href="#" style={LabelStyleLeft}>
                        Version {this.props.seamaState.Version}
                    </Label>
                    <Label  eventKey={1} href="#" style={LabelStyleLeft}>
                        Kiosk
                    </Label>
                    <Nav >
                        <NavDropdown eventKey={3} title={this.state.title} onSelect={this.handleSelect} id="basic-nav-dropdown" >
                            {this.buildMenuItems()}
                        </NavDropdown>
                    </Nav>
                    <Label  eventKey={1} href="#" style={LabelStyleRight}>
                        Logout
                    </Label>
                    <Label  eventKey={1} href="#" style={LabelStyleRight}>
                        Fred O'Leary
                    </Label>
                </Navbar>
            </div>
        );
    }
}

export default SeamaToolbar;
