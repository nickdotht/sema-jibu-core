import React from 'react';
import { Switch, Route } from 'react-router-dom';
import SeamaWaterQuality from "./SeamaWaterQuality";
import SemaSales from "./SemaSales";
import SeamaDistributionMap from "./SeamaDistributionMap";
import SeamaDeliverySchedule from "./SeamaDeliverySchedule";
import SeamaInventoryManagement from "./SeamaInventoryManagement";
import SeamaFinancials from "./SeamaFinancials";

const Main = (props) => (
    <main>
        <Switch>
            <Route exact path='/' component={SeamaWaterQuality}/>
            <Route path='/Sales' component={SemaSales}/>
            <Route path='/DistributionMap' render={(routeProps) =>(<SeamaDistributionMap {...routeProps } {...props} /> )}/>
            <Route path='/DeliverySchedule' render={(routeProps) =>(<SeamaDeliverySchedule {...routeProps } {...props} /> )}/>
            <Route path='/InventoryManagement' render={(routeProps) =>(<SeamaInventoryManagement {...routeProps } {...props} /> )}/>
            <Route path='/Financials' render={(routeProps) =>(<SeamaFinancials {...routeProps } {...props} /> )}/>
        </Switch>
    </main>
);

export default Main
