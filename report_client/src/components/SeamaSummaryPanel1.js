
import React, { Component } from 'react';
import { Panel } from 'react-bootstrap';
import 'App.css';
import SeamaWaterQualityContainer from "./SeamaWaterQualityContainer";

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


// #rcorners2 {
//     border-radius: 25px;
//     border: 2px solid #73AD21;
//     padding: 20px;
//     width: 200px;
//     height: 150px;
// }
