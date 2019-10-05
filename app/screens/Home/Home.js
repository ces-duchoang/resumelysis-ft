import React from "react";
import { Link } from "react-router-dom";
import "./Home.scss";
import { Layout, Menu } from "antd";
const { Header } = Layout;

export default class Home extends React.Component {
  
  componentDidMount() {
    document.title = "Trang chủ";
  }

  render() {
    return (
      <Layout>
        <Header>
          <Menu
            theme="dark"
            mode="horizontal"
            defaultSelectedKeys={["2"]}
            style={{ lineHeight: "64px" }}
          >
            <Menu.Item key="1">
              <Link to="/login">Đăng nhập</Link>
            </Menu.Item>
            <Menu.Item key="2">
              <Link to="/">Trang chủ</Link>
            </Menu.Item>
          </Menu>
        </Header>
      </Layout>
    );
  }
}
