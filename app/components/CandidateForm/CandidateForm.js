import './CandidateForm.scss';
import React, { useState } from 'react';
import {
    Modal,
    Form,
    Input,
    Button,
    Divider,
    Select,
    Spin,
    Checkbox,
    Row,
    Icon
} from 'antd';
import Skill from '../../api/Skill';
import Degree from '../../api/Degree';
import School from '../../api/School';
import Major from '../../api/Major';

const CandidateModal = props => {
    const handleSubmit = e => {
        e.preventDefault();
        console.log('object');
    };
    return (
        <Modal
            title={props.data.name && `Edit - ${props.data.name}`}
            visible={props.visible}
            onCancel={props.close}
            width={600}
            onOk={handleSubmit}
            footer={<></>}
        >
            <WrappedCandidateForm
                closeForm={props.close}
                data={props.data}
                onSubmit={props.onSubmit}
            />
        </Modal>
    );
};

class CandidateForm extends React.Component {
    state = {
        name: '',
        email: '',
        phone: '',
        skillData: [],
        schools: [],
        majors: [],
        degrees: [],
        query: ''
    };
    handleSubmit = e => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (err) return;
            const resValue = {
                ...this.props.data,
                ...values,
                links: values.links.split(','),
                skills: values.skills.map(e => e.label),
                majors: values.majors.map(e => e.label),
                degrees: values.degrees.map(e => e),
                schools: values.schools.map(e => e.label)
            };
            this.props.onSubmit(resValue);
        });
    };
    fetchSkill = v => {
        if (!v.trim().length) return;
        this.setState({ gettingSkill: true });
        this.setState({ query: v });
        Skill.search(v)
            .then(res => {
                this.setState({
                    skillData: res.data.map(s => ({
                        value: s.name,
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
                <b>Contact Informations</b>
                <Form.Item label="Name">
                    {getFieldDecorator('name', {
                        rules: [
                            {
                                required: true,
                                message: 'This field is required'
                            }
                        ],
                        initialValue: this.props.data.name
                    })(<Input placeholder="Name" />)}
                </Form.Item>
                <Form.Item label="Telephone">
                    {getFieldDecorator('telephone', {
                        initialValue:
                            (this.props.data.phones &&
                                this.props.data.phones[0]) ||
                            ''
                    })(<Input placeholder="Telephone" />)}
                </Form.Item>
                <Form.Item label="Email">
                    {getFieldDecorator('email', {
                        initialValue: this.props.data.email || ''
                    })(<Input placeholder="Email" />)}
                </Form.Item>
                <Form.Item label="References">
                    {getFieldDecorator('links', {
                        initialValue:
                            this.props.data.links &&
                            this.props.data.links.toString()
                    })(<Input placeholder="References" />)}
                </Form.Item>
                <Divider />
                <b>Candidate Informations</b>
                <Form.Item label="Skills">
                    {getFieldDecorator('skills', {
                        initialValue:
                            (this.props.data.skills &&
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
                            onInputKeyDown={(...v) => {
                                console.log(v);
                            }}
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
                            (this.props.data.majors &&
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
                            this.props.data.degrees &&
                            this.props.data.degrees.map(s => s)
                    })(<Checkbox.Group options={this.state.degrees} />)}
                </Form.Item>
                <Form.Item label="Schools">
                    {getFieldDecorator('schools', {
                        initialValue:
                            (this.props.data.schools &&
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
                        Submit
                    </Button>
                    <Button
                        type="ghost"
                        htmlType="reset"
                        style={{ marginLeft: '1em' }}
                        onClick={this.props.closeForm}
                    >
                        Cancel
                    </Button>
                </Row>
            </Form>
        );
    }
}
const WrappedCandidateForm = Form.create({ name: 'candidate_form' })(
    CandidateForm
);
export default CandidateModal;
