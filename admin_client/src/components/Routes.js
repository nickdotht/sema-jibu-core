import React from 'react';
import { Switch } from 'react-router-dom';
import SemaUsers from './SemaUsers';
import ProductsContainer from '../containers/ProductsContainer';
import Product from './Product';
import { PrivateRoute, SemaNotFound } from '.';

const Routes = props => (
  <Switch>
    <PrivateRoute exact path="/" component={SemaUsers} />
    <PrivateRoute exact path="/products" component={ProductsContainer} />
    <PrivateRoute path="/products/:id" component={Product} />
    <PrivateRoute component={SemaNotFound} />
  </Switch>
);

export default Routes;
