import React from 'react';
import './PositionForm.scss';
import {
    Modal,
    Form,
    Input,
    Button,
    Row,
    Divider,
    message,
    Select,
    Spin,
    Checkbox,
    DatePicker
} from 'antd';
import Api from '../../api/Skill';
import Degree from '../../api/Degree';
import School from '../../api/School';
import Major from '../../api/Major';
import ReactQuill from 'react-quill';
import moment from 'moment';

const PositionModal = props => {
    return (
        <Modal
            title={props.data ? 'Edit Position' : 'Create Position'}
            visible={props.visible}
            footer={<></>}
            onCancel={props.closePositionForm}
            width={800}
        >
            <WrappedPositionForm
                closePositionForm={props.closePositionForm}
                data={props.data}
                onSubmit={props.onSubmit}
            />
        </Modal>
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
        Api.search(v)
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
                <Divider />
                <b>Informations</b>
                <Form.Item label="Title">
                    {getFieldDecorator('title', {
                        rules: [
                            {
                                required: true,
                                message: 'Please input position title!'
                            }
                        ],
                        initialValue: this.props.data && this.props.data.title
                    })(<Input placeholder="Title" />)}
                </Form.Item>
                <Form.Item label="Description"></Form.Item>
                <ReactQuill
                    theme={'snow'}
                    value={this.state.editor}
                    onChange={this.handleChange}
                    className="rich-ed"
                />
                <Form.Item label="Expire date">
                    {getFieldDecorator('expireAt', {
                        rules: [
                            {
                                required: true,
                                message: 'Please input expire date!'
                            }
                        ],
                        initialValue:
                            this.props.data && moment(this.props.data.expireAt)
                    })(<DatePicker />)}
                </Form.Item>
                <Row type="flex" justify="center">
                    <Button type="primary" htmlType="submit">
                        Submit
                    </Button>
                    <Button
                        type="ghost"
                        htmlType="reset"
                        style={{ marginLeft: '1em' }}
                        onClick={this.props.closePositionForm}
                    >
                        Cancel
                    </Button>
                </Row>
            </Form>
        );
    }
}

const WrappedPositionForm = Form.create({ name: 'position_form' })(
    PositionForm
);

export default PositionModal;
