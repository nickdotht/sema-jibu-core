
import React, { Component } from 'react';
import { Panel } from 'react-bootstrap';
import 'App.css';

const SeamaPanel1Style = {
    borderRadius: "25px",
    borderColor:"rgb(101,139,194)",
    borderStyle:"solid",
    borderWidth:"medium",
    margin:"0"
};
const SeamaPanel2Style = {
    position:"absolute",
    width:"50%",
    height:"50%",
    margin:"auto",
    left:"0",
    top:"0",
    right:"0",
    bottom:"0"

};

class SeamaSummaryPanel1 extends Component {
    render() {
        return (<div style={SeamaPanel2Style}>
                <Panel style={SeamaPanel1Style}>
                    <Panel.Body>
                        <Panel.Title componentClass="h3">{this.props.title}</Panel.Title>
                        <p style={{fontSize:"x-large"}}>{SeamaSummaryPanel1.format(this.props.value)}</p>
                        <p>{this.props.units}</p>
                    </Panel.Body>
                </Panel>
            </div>
        );
    }
    static format( value ){
        if( typeof value === "string") return value;
        return Math.round(value);
    }
}
export default SeamaSummaryPanel1;


