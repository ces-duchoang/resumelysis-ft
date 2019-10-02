import React, { Component } from "react";
import "./App.scss";
import { Switch, Route, BrowserRouter, Link as Router } from "react-router-dom";
import Home from "./screens/Home";
import Login from "./screens/Login";
import { isValidSession, clearSession } from "./api/Session";
import { Result } from "antd";
import DashBoard from "./screens/Dashboard";
import PrivateRoute from "./components/PrivateRoute";
import Initializing from "./components/Initializing";

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
          <Route path="/" exact component={Home} />
          <Route path="/login" exact component={Login} />
          <PrivateRoute path="/dashboard" component={DashBoard} />
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
