import React, { Component } from 'react';
import 'App.css';
import 'css/SeamaSales.css';

class SeamaSales extends Component {
    constructor(props, context) {
        super(props, context);
        console.log("SeamaSales - Constructor");
    }

    render() {
        // return this.showWaterQuality();
        return this.showSales();
    }

    showSales(){
        return (
            <div className="SeamaSales">
                <div className = "SalesDummyContainer">
                </div>
            </div>
        );

    }
}

export default SeamaSales;
