
import React, { Component } from 'react';
import { Panel } from 'react-bootstrap';
import 'App.css';

var SeamaPanel1Style = {
    borderRadius: "25px",
}
var SeamaPanel2Style = {
    marginTop:"20px"
}

class SeamaSummaryPanel1 extends Component {
    render() {
        return (<div style={SeamaPanel2Style}>
                <Panel style={SeamaPanel1Style}>
                    <Panel.Heading style={SeamaPanel1Style}>
                        <Panel.Title componentClass="h3">{this.props.title}</Panel.Title>
                    </Panel.Heading>
                    <Panel.Body>
                        <p style={{fontSize:"x-large"}}>{this.props.value}</p>
                        <p>{this.props.units}</p>
                    </Panel.Body>
                </Panel>
            </div>
        );
    }
}
export default SeamaSummaryPanel1;


