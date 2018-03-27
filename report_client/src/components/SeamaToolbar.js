import React, { Component } from 'react';
import { Navbar, Jumbotron, Button, Nav,NavItem,NavDropdown,MenuItem } from 'react-bootstrap';
import 'App.css';
import * as RestServices from "actions/RestServices"

var menuStyle = {}
var dividerStyle = {}


class SeamaToolbar extends Component {
    constructor(props, context) {
        super(props, context);

        this.handleSelect = this.handleSelect.bind(this);
        this.buildMenuItems = this.buildMenuItems.bind(this);

        this.state = {
            title: "fooyxxx",
            temp:"xxxxxxx",
            Menu: {3.1: "Action",
                3.2: "fred was here  ddd",
                3.3: "Barbara was here",
                3.4: "Seperator..."
            }

        };
        console.log("boo");
        this.menuItems = [];
        var keys = Object.keys(this.state.Menu);
        for( var i = 0; i < keys.length; i++ ){
            console.log( this.state.Menu[keys[i]]);
            this.menuItems.push(<MenuItem eventKey={keys[i]}style={menuStyle}>{this.state.Menu[keys[i]]}</MenuItem>);
        }
    }

    componentDidMount() {
        RestServices.fetchSeamaUser();
        RestServices.fetchSeamaKiosks();
    }

    handleSelect(eventKey, foo){
        console.log(eventKey, this.props.seamaState.seamaKiosk[eventKey].name);
        this.setState({title: this.props.seamaState.seamaKiosk[eventKey].name});
    };

    buildMenuItems(){
        console.log("whiskey")
        var menuItems = [];
        if( this.props.seamaState.seamaKiosk){
            var keys = Object.keys(this.props.seamaState.seamaKiosk);
            for( var i = 0; i < keys.length; i++ ){
                var kiosk = this.props.seamaState.seamaKiosk[keys[i]];
                console.log( kiosk);
                menuItems.push(<MenuItem eventKey={keys[i]}style={menuStyle}>{kiosk.name}</MenuItem>);
            }
        }
        return menuItems;
    }
    render() {
        return (
            <div>
                <Navbar>
                    <Button>{this.props.seamaState.seamaUser}</Button>
                    <Navbar.Header >
                        <Navbar.Brand>
                            <a  href="#home">React-Bootstrap</a>
                        </Navbar.Brand>
                    </Navbar.Header>
                    <Nav style={{color:"white !important"}}>
                        <NavItem style={{color:"white !important"}} eventKey={1} href="#">
                            Linkaa
                        </NavItem>
                        <NavItem eventKey={2} href="#">
                            Linkcc
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
                </Navbar>
            </div>
        );
    }
}

export default SeamaToolbar;
