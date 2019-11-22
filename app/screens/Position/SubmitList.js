import React, { useState, useEffect } from 'react';
import {
    Table,
    Row,
    Col,
    Skeleton,
    Tag,
    Badge,
    Popconfirm,
    Button,
    Icon,
    Tooltip,
    message
} from 'antd';
import SkillSet from '../../components/SkillSet';
import ButtonGroup from 'antd/lib/button/button-group';
import Search from 'antd/lib/input/Search';
import Uploader from '../../components/Upload';
import CandidateDetail from '../../components/CandidateDetail';
import Position from '../../api/Position';
import Resume from '../../api/Resume';
import moment from 'moment';
import CandidateForm from '../../components/CandidateForm';

const TableHead = props => (
    <div className="header-table-candidate">
        <Icon type="team" style={{ fontSize: '20px', marginRight: '0.5em' }} />
        List of Candidates
    </div>
);

const getColHead = props => {
    const columns = [
        {
            title: <TableHead />,
            key: 'abc',
            render: row => {
                return (
                    <Candidate
                        data={row}
                        onDelete={props.onDelete}
                        onRemove={props.onRemove}
                        onRescan={props.onRescan}
                        onEdit={props.onEdit}
                    />
                );
            }
        }
    ];
    return columns;
};
export default props => {
    const [data, setData] = useState([]);
    const [full, setFull] = useState([]);
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
    const loadPage = () => {
        if (query) {
            setData(data.filter(d => d.name.includes(query)));
        } else {
            setLoading(true);
            Position.getResumes(props.data._id)
                .then(res => {
                    setData([...res.data]);
                    setFull([...res.data]);
                    setPagination({
                        ...pagination,
                        total: res.data.length
                    });
                })
                .catch(err => console.log(err))
                .finally(() => {
                    setLoading(false);
                });
        }
    };

    useEffect(() => {
        window.scrollTo(0, 0);
        loadPage();
    }, [props.data]);

    useEffect(() => {
        document.title = 'Candidates management';
        loadPage();
    }, []);

    useEffect(() => {
        loadPage();
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
        Resume.delete(candidate._id)
            .then(res => {
                message.success('Deleted ' + candidate.name);
                loadPage(pagination.current, query);
            })
            .catch(err => message.error('Ooops something went wrong!'))
            .finally(() => setLoading(false));
    };
    const onRemove = candidate => {
        setLoading(true);
        Position.removeResume(props.data._id, candidate._id)
            .then(res => {
                message.success('Removed ' + candidate.name);
                loadPage(pagination.current, query);
            })
            .catch(err => message.error('Ooops something went wrong!'))
            .finally(() => setLoading(false));
    };
    const onRescan = candidate => {
        setLoading(true);
        Resume.reread(candidate._id)
            .then(res => {
                message.success(candidate.file_name + ' in proccessing');
                loadPage(pagination.current, query);
            })
            .catch(err => message.error('Ooops something went wrong!'))
            .finally(() => setLoading(false));
    };
    const onEdit = candidate => {
        setEditing(true);
        setCandidate(candidate);
    };
    const tableProps = {
        onDelete: onDelete,
        onRemove: onRemove,
        onRescan: onRescan,
        onEdit: onEdit
    };
    const closeUploader = () => {
        setUploading(false);
        loadPage(pagination.current, query);
    };

    const onSubmit = candidate => {
        onCancelEdit();
        message.loading({
            content: `Updating ${candidate.name}`,
            key: 'update'
        });
        Resume.update(candidate._id, candidate)
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
    return (
        <div>
            <Row style={{ marginBottom: '1em' }}>
                <Col span={12} type="flex" align="space-between">
                    <Button
                        type="dashed"
                        icon="user-add"
                        onClick={() => setUploading(true)}
                    >
                        Add
                    </Button>
                    {uploading && (
                        <Uploader
                            data={props.data}
                            visible={uploading}
                            onClose={closeUploader}
                            action={`${API_BASE_DOMAIN}/api/positions/apply/${props.data._id}`}
                        />
                    )}
                    {editing && (
                        <CandidateForm
                            visible={editing}
                            close={onCancelEdit}
                            data={candidate}
                            onSubmit={onSubmit}
                        />
                    )}
                </Col>
                <Col span={12}>
                    <Row type="flex" justify="center">
                        <Col span={6}></Col>
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
            <Col span={20}>
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
                    <Col span={7}>
                        {isProcessing ? (
                            <Tag color="orange">{data.file_name}</Tag>
                        ) : (
                            <SkillSet data={data.skills} />
                        )}
                    </Col>
                    <Col span={3} offset={1} type="flex" justify="end">
                        {isProcessing ? (
                            <Badge status="processing" text="Processing" />
                        ) : (
                            <Badge status="success" text={data.status} />
                        )}
                    </Col>
                </Row>
            </Col>
            <Col span={4}>
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
                    <Tooltip title="Remove">
                        <Popconfirm
                            title="Are you sure remove this candidate?"
                            okText="Yes"
                            cancelText="No"
                            onConfirm={() => props.onRemove(data)}
                            placement="left"
                        >
                            <Button icon="exception" />
                        </Popconfirm>
                    </Tooltip>
                    <Tooltip title="Delete">
                        <Popconfirm
                            title="Are you sure delete this candidate profile?"
                            okText="Yes"
                            cancelText="No"
                            onConfirm={() => props.onDelete(data)}
                            placement="left"
                        >
                            <Button icon="delete" />
                        </Popconfirm>
                    </Tooltip>
                </ButtonGroup>
            </Col>
        </Row>
    );
};
