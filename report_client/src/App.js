import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import StuffList from './StuffList';

import appRoutes from "./routes/app.js";

class App extends Component {
    state = {users: []}

    // componentDidMount() {
    //     fetch('/users')
    //         .then(res => res.json())
    // .then(users => this.setState({ users }));
    // }

    render() {
        return (
            <div className="app">
                <StuffList />
            </div>
        );
    }
}
export default App;
