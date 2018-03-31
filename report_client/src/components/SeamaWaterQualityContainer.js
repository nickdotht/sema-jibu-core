import React, { Component } from 'react';
import 'App.css';
import SeamaSummaryPanel1 from "./SeamaSummaryPanel1";
import SeamaWaterProductionChart from "./SeamaWaterProductionChart";
import SeamaWaterChlorineChart from "./SeamaWaterChlorineChart";
import SeamaWaterTdsChart from "./SeamaWaterTdsChart";
import SeamaSidebar from "./SeamaSidebar";
import 'css/Seama.css';
import SeamaWaterQualityNavigation from "./SeamaWaterQualityNavigation";
import { Alert } from 'react-bootstrap';
import SeamaServiceError from "./SeamaServiceError";
import SeamaDatabaseError from "./SeamaDatabaseError";

class SeamaWaterQualityContainer extends Component {
    constructor(props, context) {
        super(props, context);

    }

    render() {
        // return this.showWaterQuality();
        return this.showContent();
    }
    showContent(props){
        if( this.props.seamaState.hasOwnProperty("healthCheck")){
            if( this.props.seamaState.healthCheck.server != "Ok" ){
                return SeamaServiceError(props);
            }else  if( this.props.seamaState.healthCheck.database != "Ok" ){
                return SeamaDatabaseError(props)
            }
        }
        return this.showWaterQuality();

    }

    showWaterQuality( props ){
        return (
            <div className="WaterQualityContainer">
                <div className ="SeamaSidebarItem">
                    <SeamaSidebar/>
                </div>
                <div className = "WaterQualitySummaryContainer">
                    <div className ="WaterQualitySummaryItem">
                        <SeamaSummaryPanel1 title="Total Production" units={"Gallons"} value={this.props.seamaState.seamaWaterQuality["totalProduction"]}/>
                    </div>
                    <div className ="WaterQualitySummaryItem">
                        <SeamaSummaryPanel1 title="Site Pressure" units={"PSI"} value={this.props.seamaState.seamaWaterQuality["sitePressure"]}/>
                    </div>
                    <div className ="WaterQualitySummaryItem">
                        <SeamaSummaryPanel1 title="Flow Rate" units={"GPM"} value={this.props.seamaState.seamaWaterQuality["flowRate"]}/>
                    </div>
                </div>
                <div className ="WaterQualityNavigtionItem">
                    <SeamaWaterQualityNavigation/>
                </div>
                <div className = "WaterQualityChartContainer">
                    <div className= "WaterQualityMainChartItem">
                        <SeamaWaterProductionChart chartData={this.props.seamaState.seamaWaterQuality["production"]}/>
                    </div>
                    <div className= "WaterQualitySecondaryChart1Item">
                        <SeamaWaterChlorineChart chartData={this.props.seamaState.seamaWaterQuality["chlorine"]}/>
                    </div>
                    <div className= "WaterQualitySecondaryChart2Item">
                        <SeamaWaterTdsChart chartData={this.props.seamaState.seamaWaterQuality["tds"]}/>
                    </div>
                </div>

            </div>
        );

    }
}

export default SeamaWaterQualityContainer;
