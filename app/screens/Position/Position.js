import './Position.scss';
import React from 'react';
import { Layout, Row, Tabs, Tag, Col, Skeleton, Icon } from 'antd';
import PositionApi from '../../api/Position';
import TopBar from '../../components/TopBar';
import { Link } from 'react-router-dom';
import SubmitList from './SubmitList';
import Ranking from './Ranking';
const { TabPane } = Tabs;

export default class Position extends React.Component {
    state = {
        data: null,
        candidate: null
    };
    componentDidMount() {
        document.title = 'Candidate of position';
        this.reload();
    }

    reload() {
        console.log('reloading')
        PositionApi.get(this.props.computedMatch.params.positionId).then(
            res => {
                this.setState({ data: res.data });
                document.title = 'Candidate - ' + res.data.title;
            }
        );
    }
    onChangeTab = tab => {
        switch (parseInt(tab)) {
            case 1:
                document.title = 'List candidates of position';
                break;

            case 2:
                document.title = 'List ranked candidates of position';
                break;
            default:
                if (this.state.data)
                    document.title = 'Candidate - ' + this.state.data.title;
                else document.title = 'Candidate of position';
        }
    };

    render() {
        return (
            <Layout
                className="position-container"
                style={{ minHeight: '100vh' }}
            >
                <TopBar />
                <Layout.Content className="position-content">
                    <div
                        style={{
                            backgroundColor: 'white',
                            borderRadius: '5px',
                            padding: '1em',
                            minHeight: '90vh'
                        }}
                    >
                        {this.state.data ? (
                            <>
                                <Row type="flex" justify="space-between">
                                    <Col>
                                        <Tag color="#2db7f5">
                                            {this.state.data &&
                                                this.state.data.title}
                                        </Tag>
                                        <Icon
                                            type="sync"
                                            style={{
                                                marginLeft: '0.5em',
                                                color: '#bbb',
                                                fontSize: '12px'
                                            }}
                                            onClick={()=>this.reload()}
                                        />
                                    </Col>
                                    <Col>
                                        <Link
                                            to={`/apply/${this.state.data._id}`}
                                            target="_blank"
                                        >
                                            <Icon type="link" /> View submit
                                            page
                                        </Link>
                                    </Col>
                                </Row>
                                <Tabs
                                    defaultActiveKey="2"
                                    onChange={t => this.onChangeTab(t)}
                                >
                                    <TabPane tab="List candidates" key="1">
                                        <SubmitList data={this.state.data} />
                                    </TabPane>
                                    <TabPane tab="Ranked candidates" key="2">
                                        <Ranking
                                            data={this.state.data}
                                            reload={() => this.reload()}
                                        />
                                    </TabPane>
                                </Tabs>
                            </>
                        ) : (
                            <Skeleton active paragraph={{ rows: 5 }} />
                        )}
                    </div>
                </Layout.Content>
            </Layout>
        );
    }
}
