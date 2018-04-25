import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
//import { createStore } from 'redux'
import configureStore from 'store/configureStore';

import './index.css';
import 'bootstrap/dist/css/bootstrap.css';
//import 'bootstrap/dist/css/bootstrap-theme.css';
import 'bootstrap/dist/css/bootstrap_cerulean.min.css';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import registerServiceWorker from './registerServiceWorker';
//import rootReducer from 'reducers/RootReducer'

const store = configureStore();

ReactDOM.render(

    <Provider  store={store}>
        <BrowserRouter>
            <App store={store}/>
        </BrowserRouter>
    </Provider>,
    document.getElementById('root'));
registerServiceWorker();
