import React from 'react';
import { Switch } from 'react-router-dom';
import SemaVolume from "./SemaVolume";
import SemaCustomer from "./SemaCustomer";
import SemaSales from "./SemaSales";
import {
	PrivateRoute,
	SemaNotFound
} from './';

const Main = (props) => (
    <main>
        <Switch>
			<PrivateRoute path='/Sales' component={SemaSales}/>
            <PrivateRoute exact path='/' component={SemaVolume}/>
            <PrivateRoute path='/Demographics' component={SemaCustomer}/>
            {/*<PrivateRoute path='/DistributionMap' component={SeamaDistributionMap}/>*/}
            {/*<PrivateRoute path='/DeliverySchedule' component={SeamaDeliverySchedule}/>*/}
            {/*<PrivateRoute path='/InventoryManagement' component={SeamaInventoryManagement}/>*/}
            {/*<PrivateRoute path='/Financials' component={SeamaFinancials}/>*/}
            <PrivateRoute component={SemaNotFound}/>
        </Switch>
    </main>
);

export default Main
