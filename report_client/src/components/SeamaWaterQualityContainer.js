import React, { Component } from 'react';
import 'App.css';
import SeamaSummaryPanel1 from "./SeamaSummaryPanel1";
import SeamaWaterProductionChart from "./SeamaWaterProductionChart";
import SeamaWaterChlorineChart from "./SeamaWaterChlorineChart";
import SeamaWaterTdsChart from "./SeamaWaterTdsChart";
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
                         <SeamaWaterProductionChart chartData={this.props.seamaState.seamaWaterQuality["production"]}/>
                    </div>
                    <div className= "SeamaWaterQualitySecondaryChart1">
                        <SeamaWaterChlorineChart chartData={this.props.seamaState.seamaWaterQuality["chlorine"]}/>
                    </div>
                    <div className= "SeamaWaterQualitySecondaryChart2">
                        <SeamaWaterTdsChart chartData={this.props.seamaState.seamaWaterQuality["tds"]}/>
                    </div>
                </div>

            </div>
        );
    }
}

export default SeamaWaterQualityContainer;
