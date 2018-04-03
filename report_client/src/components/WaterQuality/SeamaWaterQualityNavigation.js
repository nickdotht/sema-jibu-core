import React, { Component } from 'react';
import { Nav, NavDropdown,MenuItem } from 'react-bootstrap';
import 'App.css';
import 'css/CustomDropdown.css';


class SeamaWaterQualityNavigation extends Component {
    constructor(props, context) {
        super(props, context);
        console.log("SeamaWaterQualityNavigation-constructor");
        this.handleSelect = this.handleSelect.bind(this);
        // this.buildMenuItems = this.buildMenuItems.bind(this);

        this.state = {title: "LAST 30 DAYS"};
    }

    componentDidMount() {
        console.log("componentDidMount");
    }

    handleSelect(eventKey){
        console.log(eventKey);
        // this.setState({title: this.props.seamaState.seamaKiosk[eventKey].name});
        // var kioskParams = {kioskID:this.props.seamaState.seamaKiosk[eventKey].id};
        // RestServices.fetchWaterQuality(kioskParams);
    };

    // buildMenuItems(){
    //     var menuItems = [];
    //     if( this.props.seamaState.seamaKiosk){
    //         var keys = Object.keys(this.props.seamaState.seamaKiosk);
    //         for( var i = 0; i < keys.length; i++ ){
    //             var kiosk = this.props.seamaState.seamaKiosk[keys[i]];
    //             menuItems.push(<MenuItem eventKey={keys[i]}style={menuStyle}>{kiosk.name}</MenuItem>);
    //         }
    //     }
    //     return menuItems;
    // }
    render() {
        return (
            <div>
                <Nav bsStyle="pills" >
                <NavDropdown eventKey={7} title={this.state.title} onSelect={this.handleSelect} id="basic-nav-dropdown" >
                    <MenuItem eventKey={7.1} >LAST 30 DAYS</MenuItem>
                    <MenuItem divider  />
                    <MenuItem eventKey={7.2} >MONTHLY</MenuItem>
                    <MenuItem eventKey={7.3} >WEEKLY</MenuItem>
                    <MenuItem eventKey={7.4} >YEARLY</MenuItem>
                </NavDropdown>
                </Nav>
            </div>
        );
    }
}

export default SeamaWaterQualityNavigation;
