
import React, { Component } from 'react';
import { Panel } from 'react-bootstrap';
import 'App.css';
import 'css/SemaCustomer.css';
let dateFormat = require('dateformat');

class CustomerSummaryPanel extends Component {
    render() {
        return (<div style={{width:"90%"}}>
                <Panel className="CustomerSummaryPanel">
                    <Panel.Body  style={{padding:"7px"}}>
                        <Panel.Title componentClass="h3" style={{margin:"0"}}>{this.props.title}</Panel.Title>
						<p style={{fontSize:"large",margin:"0", color:this.props.valueColor }}>{this.format()} <span style={{fontSize:"medium",margin:"0", color:"black" }}>{this.props.units}</span></p>
                    </Panel.Body>
                </Panel>
            </div>
        );
    }
    format(){
    	let props = this.props;
		if( typeof this.props.value === "string") return this.props.value;
    	if( this.props.value ){
			return Math.round(this.props.value);
		}else{
    		return "N/A"
		}

    }

}
export default CustomerSummaryPanel;


