import React, { Component } from 'react';
import { Grid, Row, Col } from 'react-bootstrap';
import 'App.css';
import SeamaSummaryPanel1 from "./SeamaSummaryPanel1";
import SeamaWaterOperationsChart from "./SeamaWaterOperationsChart";
import SeamaSidebar from "./SeamaSidebar";

var SeamaWaterQualityContainerStyle = {
    background:"#f0fff0",
    position:"fixed",
    width:"100%",
    height:"100%",
    // top:"52px",
//    left:"250px"
}

var SeamaGridStyle = {
     width:"100%"
}

const colFixed240 = {
    width:"240px",
    background:"rgb(255,0,0)",
    position:"fixed",
    height:"100%",
    zIndex:"1"
}


const colOffset400 ={
    paddingLeft:"240px",
    paddingRight:"0",
    background:"(0,255,0)",
    position:"fixed",
    height:"100%",
    zIndex:"0"
}
class SeamaWaterQualityContainer extends Component {
    constructor(props, context) {
        super(props, context);

    }

    render() {
        return (
            <div className="container" style={{marginLeft:0, marginRight:0}}>
                <div className="row">
                    <div style={colFixed240}>
                        <SeamaSidebar/>
                    </div>
                    {/*<div style={colFixed160}>Fixed 160px</div>*/}
                    <div className="col-md-12" style={colOffset400}>
                        <div className="row">
                            <Grid style={SeamaGridStyle}>
                                <Row className="show-grid" style={{height:"30vh", background:"rgb(171,193,222"}}>
                                    <Col xs={4} md={4} style={{height:"100%"}} >
                                        <SeamaSummaryPanel1 title="Total Production" units={"Gallons"} value={this.props.seamaState.seamaWaterQuality["totalProduction"]}></SeamaSummaryPanel1>
                                    </Col>
                                    <Col xs={4} md={4} style={{height:"100%"}}>
                                        <SeamaSummaryPanel1 title="Site Pressure" units={"PSI"} value={this.props.seamaState.seamaWaterQuality["sitePressure"]}></SeamaSummaryPanel1>
                                    </Col>
                                    <Col xs={4} md={4} style={{height:"100%"}}>
                                        <SeamaSummaryPanel1 title="Flowrate" units={"GPM"} value={this.props.seamaState.seamaWaterQuality["flowRate"]}></SeamaSummaryPanel1>
                                    </Col>
                                </Row>
                                <Row className="show-grid" style={{background:"white", height:"70vh"}}>
                                    <Col xs={12} md={12} style={{height:"100%"}}>
                                        <SeamaWaterOperationsChart chartData={this.props.seamaState.seamaWaterQuality["production"]}></SeamaWaterOperationsChart>
                                    </Col>
                                </Row>
                            </Grid>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default SeamaWaterQualityContainer;
