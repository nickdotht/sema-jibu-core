import React from 'react';
import { Switch } from 'react-router-dom';
import SemaUsers from './SemaUsers';
import SemaProducts from './SemaProducts';
import { PrivateRoute, SemaNotFound } from '.';

const Routes = props => (
  <Switch>
    <PrivateRoute exact path="/" component={SemaUsers} />
    <PrivateRoute path="/products" component={SemaProducts} />
    <PrivateRoute component={SemaNotFound} />
  </Switch>
);

export default Routes;
