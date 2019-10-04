import "./Initializing.scss";
import React from "react";
import { Spin } from "antd";

export default props => (
  <div className="loading-container">
    <Spin tip="INITIALIZING..." size="large" />
  </div>
);
