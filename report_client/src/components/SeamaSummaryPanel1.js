
import React, { Component } from 'react';
import { Panel } from 'react-bootstrap';
import 'App.css';

var SeamaPanel1Style = {
    borderRadius: "25px",
    borderColor:"rgb(101,139,194)",
    borderStyle:"solid",
    borderWidth:"medium"
}
var SeamaPanel2Style = {
    marginTop:"20px"
}

class SeamaSummaryPanel1 extends Component {
    render() {
        return (<div style={SeamaPanel2Style}>
                <Panel style={SeamaPanel1Style}>
                    <Panel.Body>
                        <Panel.Title componentClass="h3">{this.props.title}</Panel.Title>
                        <p style={{fontSize:"x-large"}}>{this.props.value}</p>
                        <p>{this.props.units}</p>
                    </Panel.Body>
                </Panel>
            </div>
        );
    }
}
export default SeamaSummaryPanel1;


