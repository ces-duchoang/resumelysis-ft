import './TopBar.scss';
import React from 'react';
import { Row, Col, Menu, Icon } from 'antd';
import { Link } from 'react-router-dom';
import SubMenu from 'antd/lib/menu/SubMenu';
import ResumeLogo from '../../images/resume-logo.png';

export default props => (
    <Row className="top-menu">
        <Col span={23} push={1}>
            <Menu mode="horizontal">
                <Menu.Item key="mail">
                    <Link to="/">
                        <Icon type="database" />
                        Candidate
                    </Link>
                </Menu.Item>
                <Menu.Item key="positions">
                    <Link to="/positions">
                        <Icon type="idcard" />
                        Position
                    </Link>
                </Menu.Item>
            </Menu>
        </Col>
        <Col span={1} pull={23}>
            <img src={ResumeLogo} className="resume-logo" />
        </Col>
    </Row>
);
