import React, { Component } from 'react';
import 'App.css';
import SeamaSummaryPanel1 from "./SeamaSummaryPanel1";
import SeamaWaterOperationsChart from "./SeamaWaterOperationsChart";
import SeamaSidebar from "./SeamaSidebar";
import 'css/Seama.css';



class SeamaWaterQualityContainer extends Component {
    constructor(props, context) {
        super(props, context);

    }

    render() {
        return (
            <div className="SeamaGridContainer">
                <div className ="SeamaSidebar">
                    <SeamaSidebar/>
                </div>
                <div className = "SeamaSummaryContainer">
                    <div className ="SeamaWaterQualitySummary">
                        <SeamaSummaryPanel1 title="Total Production" units={"Gallons"} value={this.props.seamaState.seamaWaterQuality["totalProduction"]}/>
                    </div>
                    <div className ="SeamaWaterQualitySummary">
                        <SeamaSummaryPanel1 title="Site Pressure" units={"PSI"} value={this.props.seamaState.seamaWaterQuality["sitePressure"]}/>
                    </div>
                    <div className ="SeamaWaterQualitySummary">
                        <SeamaSummaryPanel1 title="Flow Rate" units={"GPM"} value={this.props.seamaState.seamaWaterQuality["flowRate"]}/>
                    </div>
                </div>
                <div className = "SeamaChartContainer">
                    <div className= "SeamaWaterQualityMainChart">
                         <SeamaWaterOperationsChart chartData={this.props.seamaState.seamaWaterQuality["production"]}/>
                    </div>
                    <div className= "SeamaWaterQualitySecondaryChart1">
                        <SeamaWaterOperationsChart chartData={this.props.seamaState.seamaWaterQuality["production"]}/>
                    </div>
                    <div className= "SeamaWaterQualitySecondaryChart2">
                        <SeamaWaterOperationsChart chartData={this.props.seamaState.seamaWaterQuality["production"]}/>
                    </div>
                </div>

                {/*<div style={colFixed160}>Fixed 160px</div>*/}
                {/*<div className="col-md-12" style={colOffset400}>*/}
                    {/*<div className="row">*/}
                        {/*<Grid style={SeamaGridStyle}>*/}
                            {/*<Row className="show-grid" style={{height:"30vh", background:"rgb(171,193,222"}}>*/}
                                {/*<Col xs={4} md={4} style={{height:"100%", display:"table"}} >*/}
                                    {/*<SeamaSummaryPanel1 title="Total Production" units={"Gallons"} value={this.props.seamaState.seamaWaterQuality["totalProduction"]}></SeamaSummaryPanel1>*/}
                                {/*</Col>*/}
                                {/*<Col xs={4} md={4} style={{height:"100%", display:"table"}}>*/}
                                {/*</Col>*/}
                                {/*<Col xs={4} md={4} style={{height:"100%", display:"table"}}>*/}
                                    {/*<SeamaSummaryPanel1 title="Flow Rate" units={"GPM"} value={this.props.seamaState.seamaWaterQuality["flowRate"]}></SeamaSummaryPanel1>*/}
                                {/*</Col>*/}
                            {/*</Row>*/}
                            {/*<Row className="show-grid" style={{background:"white", height:"70vh"}}>*/}
                                {/*<Col xs={12} md={12} style={{height:"100%"}}>*/}
                                    {/*<SeamaWaterOperationsChart chartData={this.props.seamaState.seamaWaterQuality["production"]}></SeamaWaterOperationsChart>*/}
                                {/*</Col>*/}
                            {/*</Row>*/}
                        {/*</Grid>*/}
                    {/*</div>*/}
                {/*</div>*/}
            </div>
        );
    }
}

export default SeamaWaterQualityContainer;
