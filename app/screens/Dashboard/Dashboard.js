import './Dashboard.scss';
import React, { useState, useEffect } from 'react';
import {
    Layout,
    Icon,
    Row,
    Col,
    Button,
    Input,
    Badge,
    Table,
    Skeleton,
    Popconfirm,
    Tag,
    message,
    Tooltip
} from 'antd';
import ButtonGroup from 'antd/lib/button/button-group';
import SkillSet from '../../components/SkillSet';
import Search from 'antd/lib/input/Search';
import TopBar from '../../components/TopBar';
import CandidateDetail from '../../components/CandidateDetail';
import Upload from '../../components/Upload';
import Api from '../../api/Resume';
import CandidateForm from '../../components/CandidateForm';
import moment from 'moment';

const TableHead = props => (
    <div className="header-table-candidate">
        <span>
            <Icon
                type="team"
                style={{ fontSize: '20px', marginRight: '0.5em' }}
            />
            List of Candidates
        </span>
        <Icon
            type="sync"
            style={{ marginLeft: '0.5em', color: '#bbb', fontSize: '12px' }}
            onClick={props.onRefresh}
        />
    </div>
);

const getColHead = props => {
    const columns = [
        {
            title: <TableHead {...props} />,
            key: 'abc',
            render: row => {
                return (
                    <Candidate
                        data={row}
                        onDelete={props.onDelete}
                        onRescan={props.onRescan}
                        onEdit={props.onEdit}
                    />
                );
            }
        }
    ];
    return columns;
};

export default () => {
    const [data, setData] = useState([]);
    const [uploading, setUploading] = useState(false);
    const [pagination, setPagination] = useState({
        current: 1,
        total: 20,
        pageSize: 20
    });
    const [loading, setLoading] = useState(true);
    const [query, setQuery] = useState(null);
    const [editing, setEditing] = useState(false);
    const [candidate, setCandidate] = useState({});
    const loadPage = (page, query) => {
        setLoading(true);
        if (query)
            Api.search(query, page)
                .then(res => {
                    setData([...res.data.data]);
                    setPagination({
                        ...pagination,
                        total: res.data.pages * 20
                    });
                })
                .catch(err => console.log(err))
                .finally(() => {
                    setLoading(false);
                });
        else
            Api.list(page)
                .then(res => {
                    setData([...res.data.data]);
                    setPagination({
                        ...pagination,
                        total: res.data.pages * 20
                    });
                })
                .catch(err => console.log(err))
                .finally(() => {
                    setLoading(false);
                });
    };

    // useEffect(() => {
    //     window.scrollTo(0, 0);
    // }, [data]);

    useEffect(() => {
        document.title = 'Candidates management';
        loadPage();
    }, []);
    useEffect(() => {
        document.title = 'Candidates management';
    }, [document.title]);

    useEffect(() => {
        loadPage(pagination.current, query);
    }, [pagination.current, query]);

    const onEnterQuery = q => {
        if (q.trim().length) {
            return setQuery(q);
        }
        setQuery(null);
    };

    const onChangeQuery = q => {
        if (q.target.value.trim().length === 0) {
            setQuery(null);
        }
    };

    const onDelete = candidate => {
        setLoading(true);
        Api.delete(candidate._id)
            .then(res => {
                loadPage(pagination.current, query);
            })
            .catch(err => message.error('Ooops something went wrong!'))
            .finally(() => setLoading(false));
    };

    const onRescan = candidate => {
        setLoading(true);
        Api.reread(candidate._id)
            .then(res => {
                message.success(candidate.file_name + ' in proccessing');
                loadPage(pagination.current, query);
            })
            .catch(err => message.error('Ooops something went wrong!'))
            .finally(() => setLoading(false));
    };

    const onRefresh = () => {
        loadPage(pagination.current, query);
    };

    const onEdit = candidate => {
        setEditing(true);
        setCandidate(candidate);
    };

    const onSubmit = candidate => {
        onCancelEdit();
        message.loading({
            content: `Updating ${candidate.name}`,
            key: 'update'
        });
        Api.update(candidate._id, candidate)
            .then(res => {
                message.success({
                    content: `Updated ${candidate.name}`,
                    key: 'update'
                });
                loadPage(pagination.current, query);
            })
            .catch(err =>
                message.error({
                    content: 'Ooops something went wrong!',
                    key: 'update'
                })
            );
    };

    const onCancelEdit = () => {
        setCandidate({});
        setEditing(false);
    };

    const tableProps = {
        onDelete: onDelete,
        onRescan: onRescan,
        onRefresh: onRefresh,
        onEdit: onEdit
    };
    const closeUploader = () => {
        setUploading(false);
        loadPage(pagination.current, query);
    };
    return (
        <Layout className="dashboard-container">
            <TopBar />
            {editing && (
                <CandidateForm
                    visible={editing}
                    close={onCancelEdit}
                    data={candidate}
                    onSubmit={onSubmit}
                />
            )}
            <Layout.Content>
                <div className="content">
                    <Row style={{ marginBottom: '1em' }}>
                        <Col span={12} type="flex" align="space-between">
                            <Button
                                type="dashed"
                                icon="import"
                                onClick={() => setUploading(true)}
                            >
                                Import
                            </Button>
                            {uploading && (
                                <Upload
                                    visible={uploading}
                                    onClose={closeUploader}
                                />
                            )}
                        </Col>
                        <Col span={12}>
                            <Row type="flex" justify="center">
                                <Col span={6} type="flex" justify="flex-end">
                                    {/* <Button type="link">
                                        <Icon type="sync" />
                                        Refresh
                                    </Button> */}
                                </Col>
                                <Col span={18}>
                                    <Search
                                        placeholder="Search"
                                        onSearch={onEnterQuery}
                                        onChange={onChangeQuery}
                                        allowClear
                                    />
                                </Col>
                            </Row>
                        </Col>
                    </Row>

                    <Table
                        rowKey="ac"
                        pagination={pagination}
                        onChange={p => setPagination(p)}
                        loading={loading}
                        columns={getColHead(tableProps)}
                        dataSource={data}
                    />
                </div>
            </Layout.Content>
        </Layout>
    );
};

const Candidate = props => {
    const [isDetailShow, setDetailShow] = useState(false);
    const { data } = props;
    const isProcessing = data.status === 'Processing';
    return (
        <Row
            style={{ width: '100%' }}
            type="flex"
            justify="space-around"
            align="middle"
        >
            {!isProcessing && (
                <CandidateDetail
                    key={data._id}
                    visible={isDetailShow}
                    data={data}
                    close={() => setDetailShow(false)}
                />
            )}
            <Col span={21}>
                <Row type="flex" justify="space-around" align="middle">
                    <Col
                        span={12}
                        onClick={() => setDetailShow(true)}
                        style={isProcessing ? {} : { cursor: 'pointer' }}
                    >
                        <div>
                            {moment().diff(moment(data.createdDate), 'hours') <
                                1 && <Tag color="red">New</Tag>}
                            {isProcessing ? (
                                <Skeleton
                                    active
                                    paragraph={{ rows: 1, width: 40 }}
                                />
                            ) : (
                                <>
                                    <div className="can-name">
                                        {data.name || 'Noname'}
                                    </div>
                                    <div className="can-email">
                                        {data.email || '-'}
                                    </div>
                                    <div className="can-phone">
                                        {data.phones[0] || '-'}
                                    </div>
                                </>
                            )}
                        </div>
                    </Col>
                    <Col span={8}>
                        {isProcessing ? (
                            <Tag color="orange">{data.file_name}</Tag>
                        ) : (
                            <SkillSet data={data.skills} />
                        )}
                    </Col>
                    <Col span={2} offset={1} type="flex" justify="end">
                        {isProcessing ? (
                            <Badge status="processing" text="Processing" />
                        ) : (
                            <Badge status="success" text={data.status} />
                        )}
                    </Col>
                </Row>
            </Col>
            <Col span={3}>
                <ButtonGroup>
                    <Tooltip title="Download">
                        <Button
                            icon="vertical-align-bottom"
                            onClick={() =>
                                window.open(
                                    `${API_BASE_DOMAIN}/res/${data.file_name}`,
                                    '_blank'
                                )
                            }
                        />
                    </Tooltip>
                    <Tooltip title="Edit">
                        <Button
                            icon="edit"
                            disabled={isProcessing}
                            onClick={() => props.onEdit(data)}
                        />
                    </Tooltip>
                    <Tooltip title="Re-scan">
                        <Button
                            icon="scan"
                            onClick={() => props.onRescan(data)}
                        />
                    </Tooltip>
                    <Tooltip title="Delete">
                        <Popconfirm
                            title="Are you sure delete this candidate?"
                            okText="Yes"
                            cancelText="No"
                            onConfirm={() => props.onDelete(data)}
                        >
                            <Button icon="delete" />
                        </Popconfirm>
                    </Tooltip>
                </ButtonGroup>
            </Col>
        </Row>
    );
};
