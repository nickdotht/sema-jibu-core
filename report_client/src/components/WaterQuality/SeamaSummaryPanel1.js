
import React, { Component } from 'react';
import { Panel } from 'react-bootstrap';
import 'App.css';
import 'css/SeamaWaterOperations.css';


class SeamaSummaryPanel1 extends Component {
    render() {
        return (<div style={{width:"60%"}}>
                <Panel className="WaterQualitySummaryPanel">
                    <Panel.Body  style={{padding:"7px"}}>
                        <Panel.Title componentClass="h3" style={{margin:"0"}}>{this.props.title}</Panel.Title>
                        <p style={{fontSize:"x-large",margin:"0" }}>{SeamaSummaryPanel1.format(this.props.value)}</p>
                        <p style={{margin:"0"}}>{this.props.units}</p>
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


