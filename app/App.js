import React, { Component } from 'react';
import './App.scss';
import { Switch, Route, BrowserRouter, Link as Router } from 'react-router-dom';
import Login from './screens/Login';
import { isValidSession, clearSession } from './api/Session';
import { Result } from 'antd';
import DashBoard from './screens/Dashboard';
import PrivateRoute from './components/PrivateRoute';
import Initializing from './components/Initializing';
import ApplyPosition from './screens/ApplyPosition';
import Position from './screens/Position';
import PositionManage from './screens/PositionManage';

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isInitializing: true
        };
    }
    async componentWillMount() {
        (await isValidSession()) || clearSession();
        this.setState({ isInitializing: false });
    }

    render() {
        return this.isInitializing ? (
            <Initializing />
        ) : (
            <BrowserRouter>
                <Switch>
                    <PrivateRoute path="/" exact component={DashBoard} />
                    <Route path="/login" exact component={Login} />
                    <PrivateRoute path="/dashboard" component={DashBoard} />
                    <PrivateRoute path="/apply/:positionId" component={ApplyPosition} />
                    <PrivateRoute path="/position/:positionId" component={Position} />
                    <PrivateRoute path="/positions" component={PositionManage} />
                    <Route component={NotFound} />
                </Switch>
            </BrowserRouter>
        );
    }
}

const NotFound = () => (
    <Result
        status="404"
        title="404"
        subTitle="Sorry, the page you visited does not exist."
        className="result-center"
    />
);

export default App;
