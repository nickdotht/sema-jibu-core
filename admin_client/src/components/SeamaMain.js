import React from "react";
import { Switch } from "react-router-dom";
import SemaUsers from "./SemaUsers";
import SemaProducts from "./SemaProducts";
import { PrivateRoute, SemaNotFound } from "./";

const Main = props => (
  <main>
    <Switch>
      <PrivateRoute exact path="/" component={SemaUsers} />
      <PrivateRoute path="/Products" component={SemaProducts} />
      <PrivateRoute component={SemaNotFound} />
    </Switch>
  </main>
);

export default Main;
