import React, { useState, useEffect } from 'react';
import {
    Row,
    Col,
    Descriptions,
    Tag,
    Divider,
    Form,
    Select,
    Checkbox,
    Button,
    message,
    Result,
    Icon,
    List,
    Spin,
    Dropdown,
    Menu,
    Tooltip,
    Modal,
    Input,
    InputNumber
} from 'antd';
import moment from 'moment';
import Degree from '../../api/Degree';
import School from '../../api/School';
import Major from '../../api/Major';
import Position from '../../api/Position';
import Skill from '../../api/Skill';
import CandidateDetail from '../../components/CandidateDetail';
import './Position.scss';
import NumberForm from '../../components/NumberForm';

export default props => {
    const [candidate, setCandidate] = useState(null);
    const [visible, setVisible] = useState(false);
    const [file, setFile] = useState(null);
    const onSave = v => {
        const majors = v.majors ? v.majors.map(m => m.label) : [];
        const schools = v.schools ? v.schools.map(m => m.label) : [];
        const skills = v.skills ? v.skills.map(m => m.label) : [];
        const degrees = v.degrees || [];
        Position.update(props.data._id, {
            ...v,
            majors,
            schools,
            skills,
            degrees
        })
            .then(res => message.success(`Updated ${v.title} criterions`))
            .catch(err => message.error('Oops something went wrong!'));
    };

    useEffect(() => {
        if (props.data.status === 'In processing') props.reload();
    }, [props.data.status]);

    const ranking = () => {
        Position.ranking(props.data._id)
            .then(res => {
                message.success('The request is in progress');
                props.reload();
            })
            .catch(err => message.error('Oops something went wrong!'));
    };
    const onShowCandidate = d => {
        setCandidate(d);
        setVisible(true);
    };
    const onClose = () => {
        setCandidate(null);
        setVisible(false);
    };
    const modifyRanking = (id, value) => {
        Position.modifyRanking(props.data._id, {
            _id: typeof id === 'string' ? [id] : id,
            selected: value
        })
            .then(res => {
                props.reload();
            })
            .catch(err => {
                message.error('Oops something went wrong!');
            });
    };
    const exportExcel = (n = 0) => {
        Position.exportExcel(props.data._id, n)
            .then(res => setFile(res.data.file))
            .catch(err => message.error('Oops something went wrong'));
    };

    const exportK = () => {
        const num = prompt(
            'Please enter how many result you want to get:',
            '1'
        );
        try {
            const number = parseInt(num);
            if (number) exportExcel(number);
        } catch (err) {
            message.warn('Your input not valid');
        }
    };
    const setResult = (number = 0, check = true) => {
        const listId = props.data.ranked.reduce((rs, e) => {
            if (rs.length < number || !number) rs.push(e._id);
            return rs;
        }, []);
        modifyRanking(listId, check);
    };

    const setResultK = () => {
        const num = prompt(
            'Please enter how many result you want to set:',
            '1'
        );
        try {
            const number = parseInt(num);
            if (number) setResult(number);
        } catch (err) {
            message.warn('Your input not valid');
        }
    };
    const clearList = () => {
        Position.clearRank(props.data._id)
            .then(res => {
                props.reload();
            })
            .catch(err => {
                message.error('Oops something went wrong!');
            });
    };

    const menuExport = (
        <Menu>
            <Menu.Item onClick={() => exportExcel()}>Export All</Menu.Item>
            <Menu.Item onClick={() => exportK()}>Export Top K</Menu.Item>
        </Menu>
    );
    const menuSet = (
        <Menu>
            <Menu.Item onClick={() => setResult()}>Accept All</Menu.Item>
            <Menu.Item onClick={() => setResult(0, false)}>
                Restore All
            </Menu.Item>
            <Menu.Item onClick={() => setResultK()}>Accept Top K</Menu.Item>
        </Menu>
    );
    const InputK = (
        <Modal title="How many candidate do you want to get?">
            <InputNumber
                min={1}
                max={props.data.ranked.length}
                defaultValue={1}
            />
        </Modal>
    );
    return (
        <div>
            <Row>
                <Col
                    span={12}
                    style={{
                        paddingRight: '1em',
                        borderRight: '#ccc 1px solid'
                    }}
                >
                    <Descriptions title="" layout="vertical">
                        <Descriptions.Item label="Total candidate">
                            <Tag>{props.data.resumes.length}</Tag>
                        </Descriptions.Item>
                        <Descriptions.Item label="Randked candidates">
                            <Tag>{props.data.ranked.length}</Tag>
                        </Descriptions.Item>
                        <Descriptions.Item label="Result (Accepted/All)">
                            <Tag>
                                {props.data.ranked.reduce(
                                    (rs, e) => (e.selected ? ++rs : rs),
                                    0
                                )}{' '}
                                / {props.data.ranked.length}
                            </Tag>
                        </Descriptions.Item>
                    </Descriptions>
                    <Divider />
                    <Row>
                        <WrappedPositionForm
                            data={props.data}
                            onSubmit={onSave}
                            onRanking={ranking}
                        />
                    </Row>
                </Col>
                <Col
                    span={12}
                    style={{
                        paddingLeft: '1em'
                    }}
                >
                    {props.data.ranked.length ? (
                        props.data.status === 'In processing' ? (
                            <Row>
                                <Button
                                    type="primary"
                                    style={{ marginLeft: '1em' }}
                                    onClick={ranking}
                                >
                                    Rank
                                </Button>
                                <Result
                                    icon={<Icon type="sync" spin />}
                                    title="In processing!"
                                />
                            </Row>
                        ) : (
                            <>
                                <Row type="flex" justify="space-between">
                                    <Col span={4}>
                                        <Button
                                            type="primary"
                                            style={{ marginLeft: '1em' }}
                                            onClick={ranking}
                                        >
                                            Rank
                                        </Button>
                                    </Col>
                                    <Col span={20}>
                                        <Dropdown
                                            overlay={menuSet}
                                            placement="bottomLeft"
                                        >
                                            <Button type="primary" ghost>
                                                Set result
                                            </Button>
                                        </Dropdown>
                                        <Dropdown
                                            overlay={menuExport}
                                            placement="bottomLeft"
                                        >
                                            <Button
                                                type="dashed"
                                                icon="export"
                                                style={{ marginLeft: '1em' }}
                                            >
                                                Export
                                                <div
                                                    style={{ display: 'none' }}
                                                >
                                                    <iframe
                                                        src={
                                                            file &&
                                                            `${API_BASE_DOMAIN}/res/${file}`
                                                        }
                                                    />
                                                </div>
                                            </Button>
                                        </Dropdown>
                                        <Button
                                            type="link"
                                            style={{ marginLeft: '1em' }}
                                            onClick={clearList}
                                        >
                                            Clear List
                                        </Button>
                                    </Col>
                                </Row>
                                {candidate && (
                                    <CandidateDetail
                                        data={candidate}
                                        visible={visible}
                                        close={onClose}
                                    />
                                )}
                                <Row style={{ marginTop: '1em' }}>
                                    <List
                                        header={<b>Ranking</b>}
                                        footer={<></>}
                                        bordered
                                        dataSource={props.data.ranked}
                                        renderItem={item => (
                                            <List.Item
                                                key={item}
                                                style={{
                                                    opacity: item.selected
                                                        ? '100%'
                                                        : '70%'
                                                }}
                                            >
                                                <Tooltip
                                                    title={`M: ${
                                                        item.point
                                                    } - P: ${item.potential ||
                                                        0}`}
                                                >
                                                    <Tag color="#108ee9">
                                                        {item.total ||
                                                            '0.00000'}
                                                    </Tag>
                                                </Tooltip>
                                                <Row
                                                    type="flex"
                                                    justify="space-between"
                                                    style={{
                                                        width: '100%'
                                                    }}
                                                >
                                                    <Col
                                                        span={19}
                                                        onClick={() =>
                                                            onShowCandidate(
                                                                item
                                                            )
                                                        }
                                                        style={{
                                                            cursor: 'pointer'
                                                        }}
                                                    >
                                                        <b
                                                            style={{
                                                                marginRight:
                                                                    '0.5m'
                                                            }}
                                                        >
                                                            {item.name}
                                                        </b>
                                                        <br />
                                                        <i>{item.email}</i>
                                                        <br />
                                                        <i>{item.phones}</i>
                                                    </Col>
                                                    <Tooltip
                                                        title={
                                                            item.selected
                                                                ? 'Passed'
                                                                : 'Ignored'
                                                        }
                                                    >
                                                        <Col span={3}>
                                                            <Icon
                                                                type="like"
                                                                theme="twoTone"
                                                                theme="filled"
                                                                style={{
                                                                    cursor:
                                                                        'pointer',
                                                                    color: item.selected
                                                                        ? '#52c41a'
                                                                        : '#9e9e9e'
                                                                }}
                                                                onClick={() =>
                                                                    modifyRanking(
                                                                        item._id,
                                                                        true
                                                                    )
                                                                }
                                                            />
                                                            <Icon
                                                                type="dislike"
                                                                theme="twoTone"
                                                                theme="filled"
                                                                style={{
                                                                    cursor:
                                                                        'pointer',
                                                                    color: item.selected
                                                                        ? '#9e9e9e'
                                                                        : '#ef4832',
                                                                    marginLeft:
                                                                        '1em'
                                                                }}
                                                                onClick={() =>
                                                                    modifyRanking(
                                                                        item._id,
                                                                        false
                                                                    )
                                                                }
                                                            />
                                                        </Col>
                                                    </Tooltip>
                                                </Row>
                                            </List.Item>
                                        )}
                                    />
                                </Row>
                            </>
                        )
                    ) : (
                        <>
                            <Row type="flex" justify="center">
                                <Button
                                    type="primary"
                                    style={{ marginLeft: '1em' }}
                                    onClick={ranking}
                                >
                                    Rank
                                </Button>
                            </Row>
                            <Result
                                icon={<Icon type="smile" theme="twoTone" />}
                                title="The ranking not set yet!"
                            />
                        </>
                    )}
                </Col>
            </Row>
        </div>
    );
};

class PositionForm extends React.Component {
    state = {
        skillData: [],
        schools: [],
        majors: [],
        degrees: [],
        editor: ''
    };
    handleSubmit = e => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (err) return;
            this.props.onSubmit({
                ...this.props.data,
                ...values,
                description: this.state.editor
            });
        });
    };
    handleChange = e => {
        this.setState({ editor: e });
    };
    fetchSkill = v => {
        if (!v.trim().length) return;
        this.setState({ gettingSkill: true });
        Skill.search(v)
            .then(res => {
                this.setState({
                    skillData: res.data.map(s => ({
                        value: s._id,
                        label: s.name
                    }))
                });
            })
            .catch(err => message.error('Oops something went wrong!'))
            .finally(() => this.setState({ gettingSkill: false }));
    };
    componentDidMount() {
        Degree.list()
            .then(res => {
                this.setState({
                    degrees: res.data.map(d => ({
                        label: d.name,
                        value: d.name
                    }))
                });
            })
            .catch(err => message.error('Oops something went wrong!'));
        School.list()
            .then(res => {
                this.setState({
                    schools: res.data.map(d => ({
                        label: d.name,
                        value: d.name
                    }))
                });
            })
            .catch(err => message.error('Oops something went wrong!'));
        Major.list()
            .then(res => {
                this.setState({
                    majors: res.data.map(d => ({
                        label: d.name,
                        value: d.name
                    }))
                });
            })
            .catch(err => message.error('Oops something went wrong!'));
        if (this.props.data)
            this.setState({ editor: this.props.data.description });
    }
    render() {
        const formItemLayout = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 4 }
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 20 }
            }
        };
        const { getFieldDecorator } = this.props.form;
        return (
            <Form {...formItemLayout} onSubmit={this.handleSubmit}>
                <b>Requirements</b>
                <Form.Item label="Skills">
                    {getFieldDecorator('skills', {
                        initialValue:
                            (this.props.data &&
                                this.props.data.skills.map(s => ({
                                    key: s,
                                    label: s
                                }))) ||
                            []
                    })(
                        <Select
                            mode="multiple"
                            labelInValue
                            placeholder="Select skills"
                            notFoundContent={
                                this.state.gettingSkill ? (
                                    <Spin size="small" />
                                ) : null
                            }
                            filterOption={false}
                            onSearch={this.fetchSkill}
                            style={{ width: '100%' }}
                        >
                            {this.state.skillData.map(d => (
                                <Select.Option key={d.label}>
                                    {d.label}
                                </Select.Option>
                            ))}
                        </Select>
                    )}
                </Form.Item>
                <Form.Item label="Majors">
                    {getFieldDecorator('majors', {
                        initialValue:
                            (this.props.data &&
                                this.props.data.majors.map(s => ({
                                    key: s,
                                    label: s
                                }))) ||
                            []
                    })(
                        <Select
                            mode="multiple"
                            labelInValue
                            placeholder="Select majors"
                            style={{ width: '100%' }}
                        >
                            {this.state.majors.map(d => (
                                <Select.Option key={d.label}>
                                    {d.label}
                                </Select.Option>
                            ))}
                        </Select>
                    )}
                </Form.Item>
                <Form.Item label="Degrees">
                    {getFieldDecorator('degrees', {
                        initialValue:
                            this.props.data &&
                            this.props.data.degrees.map(s => s)
                    })(<Checkbox.Group options={this.state.degrees} />)}
                </Form.Item>
                <Form.Item label="Schools">
                    {getFieldDecorator('schools', {
                        initialValue:
                            (this.props.data &&
                                this.props.data.schools.map(s => ({
                                    key: s,
                                    label: s
                                }))) ||
                            []
                    })(
                        <Select
                            mode="multiple"
                            labelInValue
                            placeholder="Select schools"
                            style={{ width: '100%' }}
                        >
                            {this.state.schools.map(d => (
                                <Select.Option key={d.label}>
                                    {d.label}
                                </Select.Option>
                            ))}
                        </Select>
                    )}
                </Form.Item>
                <Row type="flex" justify="center">
                    <Button type="primary" htmlType="submit">
                        Save
                    </Button>
                </Row>
            </Form>
        );
    }
}

const WrappedPositionForm = Form.create({ name: 'position_form' })(
    PositionForm
);
