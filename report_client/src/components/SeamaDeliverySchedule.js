import React, { Component } from 'react';
import 'App.css';
import 'css/SeamaDeliverySchedule.css';

class SeamaDeliverySchedule extends Component {
    constructor(props, context) {
        super(props, context);
        console.log("SeamaDistributionMap - Constructor");
    }

    render() {
        return this.showDeliverySchedule();
    }

    showDeliverySchedule(){
        return (
            <div className="DeliverySchedule">
                <h2 style={{textAlign:"center", color:"white"}}>Not Yet Implemented</h2>
            </div>
        );

    }
}

export default SeamaDeliverySchedule;
