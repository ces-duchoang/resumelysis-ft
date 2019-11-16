import React, { useState, useEffect } from 'react';
import './Upload.scss';
import { Modal, Upload, message, Icon, Divider, Table, Button } from 'antd';
import { getToken } from '../../api/Session';
import Search from 'antd/lib/input/Search';
import Api from '../../api/Resume';
import Position from '../../api/Position';
const { Dragger } = Upload;

const p = {
    name: 'file',
    multiple: true,
    action: `${API_BASE_DOMAIN}/api/resumes`,
    headers: {
        Authorization: `Bearer ${getToken()}`
    },
    onChange(info) {
        const { status } = info.file;
        if (status !== 'uploading') {
            console.log(info.file, info.fileList);
        }
        if (status === 'done') {
            message.success(`${info.file.name} file uploaded successfully.`);
        } else if (status === 'error') {
            message.error(`${info.file.response.message}`);
        }
    }
};

const Uploader = props => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [pagination, setPagination] = useState({});
    const [query, setQuery] = useState(null);
    const [selected, setSelected] = useState([]);
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const rowSelection = {
        onChange: (selectedRowKeys, selectedRows) => {
            setSelected(selectedRows);
            setSelectedRowKeys(selectedRowKeys);
        }
    };
    useEffect(() => {
        document.title = props.data
            ? `Add candidate to ${props.data.title}`
            : `Import candidate`;
        props.data && loadPage();
        console.log(getToken());
    }, []);
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
        resetSelected();
    };

    const resetSelected = () => {
        setSelected([]);
        setSelectedRowKeys([]);
    };

    const onAddResumse = () => {
        Position.addListResumes(props.data._id, selected.map(e => e._id))
            .then(res => message.success('Added successful'))
            .catch(err => message.error('Oops somthing went wrong!'));
        resetSelected();
    };
    return (
        <Modal
            visible={props.visible}
            title={props.data?"Add candidate":"Import candidate from resume files"}
            onCancel={props.onClose}
            footer={<></>}
        >
            <Dragger {...p} {...props}>
                <p className="ant-upload-drag-icon">
                    <Icon type="inbox" />
                </p>
                <p className="ant-upload-text">
                    Click or drag file to this area to upload
                </p>
                <p className="ant-upload-hint">Support for *.pdf;*.docx</p>
            </Dragger>
            {props.data && (
                <>
                    <Divider>OR</Divider>
                    <Search
                        placeholder="Enter candidate's name"
                        onSearch={onEnterQuery}
                        onChange={onChangeQuery}
                        allowClear
                    />
                    <Table
                        loading={loading}
                        rowSelection={{ ...rowSelection, selectedRowKeys }}
                        columns={[
                            {
                                dataIndex: 'name',
                                title: (
                                    <Button
                                        disabled={selected.length === 0}
                                        onClick={onAddResumse}
                                    >
                                        Import{' '}
                                        {selected.length
                                            ? `(${selected.length})`
                                            : ''}
                                    </Button>
                                ),
                                key: 'name',
                                name: 'name',
                                render: row => row?row:<i>In proccessing</i>
                            }
                        ]}
                        dataSource={data}
                    />
                </>
            )}
        </Modal>
    );
};

export default Uploader;
