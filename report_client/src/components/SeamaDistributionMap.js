import React, { Component } from 'react';
import 'App.css';
import 'css/SeamaDistributionMap.css';

class SeamaDistributionMap extends Component {
    constructor(props, context) {
        super(props, context);
        console.log("SeamaDistributionMap - Constructor");
    }

    render() {
        return this.showDistributionMap();
    }

    showDistributionMap(){
        return (
            <div className="DistributionMap">
                <div className = "SalesDummyContainer">
                </div>
            </div>
        );

    }
}

export default SeamaDistributionMap;
