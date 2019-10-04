import "./PrivateRoute.scss";
import React from "react";
import { Route, withRouter } from "react-router-dom";
import { isValidSession, getToken } from "../../api/Session";
import { Result } from "antd";

export default withRouter(({ component: Component, ...rest }) => {
  return (
    <Route
      {...rest}
      render={props => {
        if (isGrantAccess()) {
          return <Component {...props} {...rest} />;
        }
        rest.history.push("/login");
      }}
    />
  );
});

const isGrantAccess = () => {
  return getToken();
};
