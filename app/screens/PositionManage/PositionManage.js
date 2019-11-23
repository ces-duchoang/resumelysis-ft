import React, { useState, useEffect } from 'react';
import TopBar from '../../components/TopBar';
import {
    Layout,
    Row,
    Col,
    Button,
    Table,
    Icon,
    message,
    Tag,
    Popconfirm
} from 'antd';
import Search from 'antd/lib/input/Search';
import PostionForm from '../../components/PositionForm';
import Position from '../../api/Position';
import ButtonGroup from 'antd/lib/button/button-group';
import moment from 'moment';
import { Link } from 'react-router-dom';
import Api from '../../api/Resume';

const PositionManage = props => {
    const [loading, setLoading] = useState(false);
    const [pagination, setPagination] = useState({
        current: 1,
        total: 20,
        pageSize: 20
    });
    const [query, setQuery] = useState(null);
    const [data, setData] = useState([]);
    const [position, setPosition] = useState(null);
    const [isFormShow, setFormShow] = useState(false);
    const closePositionForm = () => {
        setFormShow(false);
        setPosition(null);
    };

    const onSubmit = v => {
        setFormShow(false);
        const majors = v.majors ? v.majors.map(m => m.label) : [];
        const schools = v.schools ? v.schools.map(m => m.label) : [];
        const skills = v.skills ? v.skills.map(m => m.label) : [];
        const degrees = v.degrees || [];
        if (position) {
            setPosition(null);
            setLoading(true);
            Position.update(v._id, {
                ...v,
                expireAt: v.expireAt.format('YYYY-MM-DD'),
                majors,
                schools,
                skills,
                degrees
            })
                .then(res => {
                    message.success(`Updated ${v.title}`);
                    loadPage();
                })
                .catch(err => message.error('Oops something went wrong!'))
                .finally(() => setLoading(false));
        } else {
            Position.create({
                ...v,
                expireAt: v.expireAt.format('YYYY-MM-DD'),
                majors,
                schools,
                skills,
                degrees
            })
                .then(res => {
                    message.success(`Created ${v.title}`);
                    loadPage();
                })
                .catch(err => message.error('Oops something went wrong!'));
        }
    };
    const loadPage = (page = pagination.current, query) => {
        setLoading(true);
        if (query) {
            Position.search(query, page)
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
        } else
            Position.list(page)
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
    useEffect(() => {
        loadPage();
        document.title = 'Position management';
    }, []);
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [data]);
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
    const onEdit = r => {
        setFormShow(true);
        setPosition(r);
    };
    const onDelete = r => {
        Position.delete(r._id)
            .then(res => {
                message.success(`Deleted ${r.title}`);
                loadPage(null, query);
            })
            .catch(err => message.error('Oops something went wrong'));
    };
    const tableProps = {
        onDelete: onDelete,
        onEdit: onEdit
    };
    return (
        <Layout className="dashboard-container">
            <TopBar />
            <Layout.Content>
                <div className="content">
                    <Row type="flex" justify="space-between">
                        <Col span={12} type="flex" align="space-between">
                            <Button
                                type="dashed"
                                icon="plus"
                                onClick={() => setFormShow(true)}
                            >
                                Create
                            </Button>
                            {isFormShow && (
                                <PostionForm
                                    visible={isFormShow}
                                    data={position}
                                    closePositionForm={closePositionForm}
                                    onSubmit={onSubmit}
                                />
                            )}
                        </Col>
                        <Col span={9}>
                            <Search
                                placeholder="Search"
                                onSearch={onEnterQuery}
                                onChange={onChangeQuery}
                                allowClear
                            />
                        </Col>
                    </Row>
                    <Row style={{ marginTop: '1em' }}>
                        <Table
                            columns={getColHead(tableProps)}
                            loading={loading}
                            pagination={pagination}
                            dataSource={data}
                            onChange={p => setPagination(p)}
                        />
                    </Row>
                </div>
            </Layout.Content>
        </Layout>
    );
};

const getColHead = props => {
    const columns = [
        {
            title: 'Title',
            dataIndex: 'title',
            width: 200
        },
        {
            title: 'Description',
            dataIndex: 'description',
            render: row => {
                const text = extractTextFromHTML(row);
                return text.length > 256 ? text.slice(0, 253) + '...' : text;
            }
        },
        {
            title: 'Candidates',
            dataIndex: 'resumes',
            width: 100,
            align: 'center',
            render: row => (
                <Tag>
                    {row.length + ' '}
                    <Icon type="user" />
                </Tag>
            )
        },
        {
            title: 'Status',
            width: 50,
            dataIndex: 'expireAt',
            align: 'center',
            render: row =>
                isPassedDate(row) ? (
                    <Tag color="#f50">Expired</Tag>
                ) : (
                    <Tag color="#87d068">Active</Tag>
                )
        },
        {
            title: <></>,
            width: 100,
            align: 'center',
            render: row => (
                <Link to={`/apply/${row._id}`} target="_blank">
                    <Icon type="link" />
                </Link>
            )
        },
        {
            title: <></>,
            width: 100,
            align: 'center',
            render: row => <Link to={`/position/${row._id}`}>Manage</Link>
        },
        {
            title: <></>,
            width: 100,
            align: 'center',
            render: row => (
                <ButtonGroup>
                    <Button icon="edit" onClick={() => props.onEdit(row)} />
                    <Popconfirm
                        title="Are you sure delete this postition?"
                        placement="left"
                        okText="Yes"
                        cancelText="No"
                        onConfirm={() => props.onDelete(row)}
                    >
                        <Button icon="delete" />
                    </Popconfirm>
                </ButtonGroup>
            )
        }
    ];
    return columns;
};

const isPassedDate = date => {
    return moment(new Date().toISOString().split('T')[0], 'YYYY-MM-DD').isAfter(
        moment(date, 'YYYY-MM-DD')
    );
};
const extractTextFromHTML = summary => {
    if (!summary) {
        return '';
    }
    if (!summary.startsWith('<') && !summary.endsWith('>')) {
        return summary;
    } else {
        return summary
            .replace(/</g, '\n<')
            .replace(/>/g, '>\n')
            .replace(/\n\n/g, '\n')
            .replace(/^\n/g, '')
            .replace(/\n$/g, '')
            .split('\n')
            .filter(function(item) {
                return !item.startsWith('<');
            })
            .join('')
            .replace(/&nbsp;?|<br\s*\/*>/gi, '');
    }
};

export default PositionManage;
