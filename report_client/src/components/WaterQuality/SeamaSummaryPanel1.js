
import React, { Component } from 'react';
import { Panel } from 'react-bootstrap';
import 'App.css';
import 'css/SeamaWaterOperations.css';
let dateFormat = require('dateformat');

class SeamaSummaryPanel1 extends Component {
    render() {
        return (<div style={{width:"60%"}}>
                <Panel className="WaterQualitySummaryPanel">
                    <Panel.Body  style={{padding:"7px"}}>
                        <Panel.Title componentClass="h3" style={{margin:"0"}}>{this.props.title}</Panel.Title>
                        <p style={{fontSize:"x-large",margin:"0" }}>{this.format()}</p>
                        <p style={{margin:"0"}}>{this.props.units}</p>
						<p style={{margin:"0"}}>{this.formatDate()}</p>
                    </Panel.Body>
                </Panel>
            </div>
        );
    }
    format(){
        if( typeof this.props.value === "string") return this.props.value;
        return Math.round(this.props.value);
    }
	formatDate(){
    	console.log(this);
		if( this.props.date === "N/A") return "";
		return  dateFormat((Date.parse(this.props.date)), "ddd. mmm, d, yyyy");
	}

}
export default SeamaSummaryPanel1;


