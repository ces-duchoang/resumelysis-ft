import React from "react";
import "./Login.scss";
import ShieldIcon from "../../images/shieldicon.png";
import {
  Layout,
  Form,
  Input,
  Button,
  Icon,
  Checkbox,
  Row,
  Avatar,
  notification,
  message
} from "antd";
import Particles from "react-particles-js";
import { validateEmail, validatePassword } from "../../validators/Account";
import Api from "../../api/Auth";
import { getToken, save } from "../../api/Session";
import { withRouter } from "react-router-dom";

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      remember: true,
      alert: {},
      disLoginBtn: false
    };
  }
  async componentDidMount() {
    document.title = "Đăng nhập";
    if (getToken()) this.props.history.push("/dashboard");
  }
  setFormState = (key, value) => {
    this.setState({ [key]: value, alert: {} });
  };
  handleSubmit = e => {
    e.preventDefault();
    if (!this.isValidForm()) {
      this.setState({ disLoginBtn: true });
      Api.auth(this.state.email, this.state.password, this.state.remember)
        .then(res => {
          save(res.data);
          message.success("Welcome back user");
        })
        .catch(err => {
          notification["error"]({
            message: `Error ${err.response.status}`,
            description: err.response.data.message
          });
        })
        .finally(() => {
          getToken()
            ? this.props.history.push("/dashboard")
            : this.setState({ disLoginBtn: false });
        });
    }
  };
  isValidForm = () => {
    const email = validateEmail(this.state.email);
    const password = validatePassword(this.state.password);
    this.setState({ alert: { email, password } });
    return email || password;
  };
  render() {
    return (
      <Layout.Content className="login-form-container">
        <Particles
          className="ani-bg"
          params={{
            particles: {
              number: {
                value: 50
              },
              size: {
                value: 3
              }
            },
            interactivity: {
              events: {
                onhover: {
                  enable: true,
                  mode: "repulse"
                }
              }
            }
          }}
        />
        <Row type="flex" justify="center" align="middle" className="form-row">
          <Form
            layout="vertical"
            className="login-form"
            onSubmit={e => this.handleSubmit(e)}
          >
            <Row type="flex" justify="center" align="middle">
              <Avatar
                size={128}
                style={{ backgroundColor: "#87d068" }}
                icon="user"
                className="login-avatar"
              />
            </Row>
            <Form.Item {...this.state.alert.email}>
              <Input
                prefix={
                  <Icon type="user" style={{ color: "rgba(0,0,0,.25)" }} />
                }
                placeholder="Email"
                onChange={e => {
                  this.setFormState("email", e.target.value);
                }}
              />
            </Form.Item>
            <Form.Item {...this.state.alert.password}>
              <Input
                prefix={
                  <Icon type="lock" style={{ color: "rgba(0,0,0,.25)" }} />
                }
                type="password"
                placeholder="Password"
                onChange={e => {
                  this.setFormState("password", e.target.value);
                }}
              />
            </Form.Item>
            <Form.Item>
              <Checkbox
                defaultChecked={true}
                onChange={e => this.setFormState("remember", e.target.value)}
              >
                Remember me
              </Checkbox>
              <a className="login-form-forgot" href="">
                Forgot password
              </a>
            </Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="login-form-button"
            >
              Log in
            </Button>
          </Form>
        </Row>
      </Layout.Content>
    );
  }
}

export default withRouter(Login);
