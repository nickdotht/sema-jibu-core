import React, { Component } from 'react';
import { Navbar, Label, Nav,NavItem,NavDropdown,MenuItem } from 'react-bootstrap';
import 'App.css';
import * as RestServices from "actions/RestServices"

var menuStyle = {}
var dividerStyle = {}

const ImageStyle = {
    resize:"both",
    width:"180px",
    height:"60px",
};

const LabelStyle = {
    float:"right",
    background:"none",
    color:"rgb(119, 119, 119)",
    marginTop:"20px",
    fontSize:"14px"
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
                <Navbar style={{background:"rgba(200,200,200,.5"}}>
                    <Navbar.Header >
                        <Navbar.Brand>
                            {<img src={require('images/dlo_image.png')} alt="logo" style={ImageStyle} />}
                        </Navbar.Brand>
                    </Navbar.Header>
                    <Nav >
                        <NavItem style={{color:"white !important"}} eventKey={1} href="#">
                            Kiosk
                        </NavItem>
                        <NavDropdown eventKey={3} title={this.state.title} onSelect={this.handleSelect} id="basic-nav-dropdown" >
                            {this.buildMenuItems()}
                            {/*{this.menuItems}*/}
                            {/*<MenuItem eventKey={3.1} style={menuStyle}>{this.state.Menu["3.1"]}</MenuItem>*/}
                            {/*<MenuItem eventKey={3.2} style={menuStyle}>{this.state.Menu["3.2"]}</MenuItem>*/}
                            {/*<MenuItem eventKey={3.3} style={menuStyle}>{this.state.Menu["3.3"]}</MenuItem>*/}
                            {/*<MenuItem divider style={dividerStyle} />*/}
                            {/*<MenuItem eventKey={3.4} style={menuStyle}>{this.state.Menu["3.4"]}</MenuItem>*/}
                        </NavDropdown>
                    </Nav>
                    <Label  eventKey={1} href="#" style={LabelStyle}>
                        Logout
                    </Label>
                    <Label  eventKey={1} href="#" style={LabelStyle}>
                        Fred O'Leary
                    </Label>
                </Navbar>
            </div>
        );
    }
}

export default SeamaToolbar;
