import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';
import { createBrowserHistory } from "history";
import { Router, Route, Switch } from "react-router-dom";
import "assets/css/material-dashboard-react.css";

import indexRoutes from "routes/index.jsx";

import configureStore from './store/configureStore';

import './index.css';
import registerServiceWorker from './registerServiceWorker';

const store = configureStore();
const hist = createBrowserHistory();

ReactDOM.render(
    <Provider store={store}>
        <Router history={hist}>
            <Switch>
                {indexRoutes.map((prop, key) => {
                return <Route path={prop.path} component={prop.component} key={key} />;
                })}
            </Switch>
        </Router>
    </Provider>,
    document.getElementById("root"));
registerServiceWorker();
