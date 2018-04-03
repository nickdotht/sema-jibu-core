import React from 'react';
import { Switch, Route } from 'react-router-dom';
import SeamaWaterQuality from "./SeamaWaterQuality";
import SeamaSales from "./SeamaSales";
import SeamaDistributionMap from "./SeamaDistributionMap";
import SeamaDeliverySchedule from "./SeamaDeliverySchedule";
import SeamaInventoryManagement from "./SeamaInventoryManagement";
import SeamaFinancials from "./SeamaFinancials";

const Main = (props) => (
    <main>
        <Switch>
            <Route exact path='/' render={(routeProps) =>(<SeamaWaterQuality {...routeProps } {...props} /> )}/>
            <Route path='/Sales' render={(routeProps) =>(<SeamaSales {...routeProps } {...props} /> )}/>
            <Route path='/DistributionMap' render={(routeProps) =>(<SeamaDistributionMap {...routeProps } {...props} /> )}/>
            <Route path='/DeliverySchedule' render={(routeProps) =>(<SeamaDeliverySchedule {...routeProps } {...props} /> )}/>
            <Route path='/InventoryManagement' render={(routeProps) =>(<SeamaInventoryManagement {...routeProps } {...props} /> )}/>
            <Route path='/Financials' render={(routeProps) =>(<SeamaFinancials {...routeProps } {...props} /> )}/>
        </Switch>
    </main>
);

export default Main
