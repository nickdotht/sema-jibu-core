import React from 'react';
import { Switch, Route } from 'react-router-dom';
import SeamaWaterQualityContainer from "./SeamaWaterQualityContainer";
import SeamaSales from "./SeamaSales";
import SeamaDistributionMap from "./SeamaDistributionMap";

const Main = (props) => (
    <main>
        <Switch>
            <Route exact path='/' render={(routeProps) =>(<SeamaWaterQualityContainer {...routeProps } {...props} /> )}/>
            <Route path='/Sales' render={(routeProps) =>(<SeamaSales {...routeProps } {...props} /> )}/>
            <Route path='/DistributionMap' render={(routeProps) =>(<SeamaDistributionMap {...routeProps } {...props} /> )}/>
        </Switch>
    </main>
);

export default Main
