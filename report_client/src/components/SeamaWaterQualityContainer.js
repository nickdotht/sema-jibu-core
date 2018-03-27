import React, { Component } from 'react';
import { Grid, Row, Col } from 'react-bootstrap';
import 'App.css';
import SeamaSummaryPanel1 from "./SeamaSummaryPanel1";
import SeamaWaterOperationsChart from "./SeamaWaterOperationsChart";

var SeamaWaterQualityContainerStyle = {
    background:"#f0f0f0",
    position:"fixed",
    width:"100%",
    height:"100%",
    top:"52px",
    left:"250px"
}

var SeamaGridStyle = {
    marginLeft:"0px",
    // paddingLeft:"0px",
    marginRight:"0px",
    // paddingRight:"0px"

}

class SeamaWaterQualityContainer extends Component {
    constructor(props, context) {
        super(props, context);

    }

    render() {
        return (
            <div fluid="true" style={SeamaWaterQualityContainerStyle}>
                <Grid style={SeamaGridStyle}>
                    <Row className="show-grid" style={{height:"30vh", background:"pink"}}>
                        <Col xs={4} md={4} >
                            <SeamaSummaryPanel1 title="Total Production" units={"Gallons"} value={this.props.seamaState.seamaWaterQuality["totalProduction"]}></SeamaSummaryPanel1>
                        </Col>
                        <Col xs={4} md={4} >
                            <SeamaSummaryPanel1 title="Site Pressure" units={"PSI"} value={this.props.seamaState.seamaWaterQuality["sitePressure"]}></SeamaSummaryPanel1>
                        </Col>
                        <Col xs={4} md={4} >
                            <SeamaSummaryPanel1 title="Flowrate" units={"GPM"} value={this.props.seamaState.seamaWaterQuality["flowRate"]}></SeamaSummaryPanel1>
                        </Col>
                    </Row>
                    <Row className="show-grid" style={{background:"white", height:"70vh"}}>
                        <Col xs={12} md={12} >
                            <SeamaWaterOperationsChart chartData={this.props.seamaState.seamaWaterQuality["production"]}></SeamaWaterOperationsChart>
                        </Col>
                    </Row>
                </Grid>
            </div>
        );
    }
}

export default SeamaWaterQualityContainer;
