
import React, { Component } from 'react';
import { Panel } from 'react-bootstrap';
import 'App.css';
import 'css/SemaSales.css';


class SemaSummaryPanel extends Component {
    render() {
        return (<div style={{width:"60%"}}>
                <Panel className="SalesSummaryPanel">
                    <Panel.Body  style={{padding:"7px"}}>
                        <Panel.Title componentClass="h3" style={{margin:"0"}}>{this.props.title}</Panel.Title>
                        <p style={{fontSize:"x-large",margin:"0" }}>{SemaSummaryPanel.format(this.props.value)}</p>
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
export default SemaSummaryPanel;


