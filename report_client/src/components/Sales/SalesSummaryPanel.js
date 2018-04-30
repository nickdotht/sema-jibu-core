
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
                        <p style={SemaSummaryPanel.calcDeltaStyle(this.props.delta)}>{this.props.delta} {this.props.label}</p>
                    </Panel.Body>
                </Panel>
            </div>
        );
    }
    static format( value ){
        if( typeof value === "string") return value;
        return Math.round(value);
    }
    static calcDeltaStyle( value ){
    	if( typeof value=== "string") {
			return {margin: "0", color:"gray"}
		}else if( value == 0 ){
			return {margin: "0"}
		}else if( value < 0 ){
			return {margin: "0", color:"red"}
		}else{
			return {margin: "0", color:"green"}
		}
	}
}
export default SemaSummaryPanel;


