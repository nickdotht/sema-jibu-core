
import React, { Component } from 'react';
import { Panel } from 'react-bootstrap';
import 'App.css';
import 'css/Seama.css';

const SeamaPanel1Style = {
    borderRadius: "25px",
    borderColor:"rgb(101,139,194)",
    borderStyle:"solid",
    borderWidth:"medium",
    margin:"0"
};

class SeamaSummaryPanel1 extends Component {
    render() {
        return (<div className="SeamaSummaryPanelContainer">
                <Panel className="SeamaSummaryPanel">
                    <Panel.Body>
                        <Panel.Title componentClass="h3" style={{marginBottom:"5px"}}>{this.props.title}</Panel.Title>
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


