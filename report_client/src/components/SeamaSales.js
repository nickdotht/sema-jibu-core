import React, { Component } from 'react';
import 'App.css';
import 'css/SeamaSales.css';
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import * as healthCheckActions from 'actions/healthCheckActions';
import { withRouter } from 'react-router'

class SeamaSales extends Component {
    constructor(props, context) {
        super(props, context);
        console.log("SeamaSales - Constructor");
    }

    render() {
        return this.showSales();
    }

    showSales(){
        return (
            <div className="Sales">
                <img src = {require('images/seama-sales-mock.png')} alt="" style={{marginLeft:"auto", marginRight:"auto"}}></img>
                <img src = {require('images/seama-sales-2-mock.png')} alt="" style={{marginLeft:"auto", marginRight:"auto"}}></img>
                {/*<h2 style={{textAlign:"center", color:"white"}}>Not Yet Implemented</h2>*/}
            </div>
        );

    }
}

function mapStateToProps(state) {
	return {
		healthCheck: state.healthCheck
	};
}

function mapDispatchToProps(dispatch) {
	return {
		healthCheckActions: bindActionCreators(healthCheckActions, dispatch)
	};
}

export default withRouter(connect(
	mapStateToProps,
	mapDispatchToProps
)(SeamaSales));

