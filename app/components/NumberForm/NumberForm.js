import React from 'react';
import './NumberForm.scss';
import { Modal, Form, InputNumber, Button } from 'antd';

const NumberModal = props => {
    return (
        <WrappedNumberForm
            {...props}
            closeNumberForm={props.closeNumberForm}
            onSubmit={props.onSubmit}
        />
    );
};

class NumberForm extends React.Component {
    state = {
        number: 1
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
            <Modal
                title={'Enter number of result'}
                visible={this.props.visible}
                onCancel={this.props.closeNumberForm}
                footer={
                    <Button form="myForm" key="submit" htmlType="submit">
                        Submit
                    </Button>
                }
            >
                <Form {...formItemLayout} onSubmit={this.handleSubmit}>
                    <Form.Item label="Number">
                        {getFieldDecorator('title', {
                            rules: [
                                {
                                    required: true,
                                    message:
                                        'Please input how many result you want to get!'
                                }
                            ],
                            initialValue: 1
                        })(<InputNumber placeholder="Number" />)}
                    </Form.Item>
                    <Button form="myForm" key="submit" htmlType="submit">
                        Submit
                    </Button>
                </Form>
            </Modal>
        );
    }
}

const WrappedNumberForm = Form.create({ name: 'number_form' })(NumberForm);

export default NumberModal;
