import './ApplyPosition.scss';
import React from 'react';
import {
    Layout,
    Row,
    Col,
    Button,
    Input,
    Form,
    Upload,
    Divider,
    message,
    Skeleton,
    Result,
    Alert
} from 'antd';
import Position from '../../api/Position';
import ReactQuill from 'react-quill';
import moment from 'moment';

export default class ApplyPosition extends React.Component {
    state = {
        data: null,
        fileList: [],
        uploading: false,
        note: '',
        submited: false
    };
    componentDidMount() {
        document.title = 'Apply for job now';
        Position.get(this.props.computedMatch.params.positionId).then(res => {
            this.setState({ data: res.data });
            document.title = res.data.title;
        });
    }

    handleUpload = () => {
        const { fileList, note } = this.state;
        this.setState({
            uploading: true
        });
        Position.apply(
            this.props.computedMatch.params.positionId,
            fileList[0],
            note
        )
            .then(res => {
                message.success('upload successfully.');
                this.setState({ submited: true });
            })
            .catch(err => message.error('Oops something went wrong'))
            .finally(() =>
                this.setState({
                    fileList: [],
                    uploading: false,
                    note: ''
                })
            );
    };

    onNoteChange = e => {
        this.setState({ note: e.target.value });
    };
    render() {
        const { data, uploading, fileList } = this.state;
        const props = {
            onRemove: file => {
                this.setState(state => {
                    const index = state.fileList.indexOf(file);
                    const newFileList = state.fileList.slice();
                    newFileList.splice(index, 1);
                    return {
                        fileList: newFileList
                    };
                });
            },
            beforeUpload: file => {
                this.setState(state => ({
                    fileList: [...state.fileList, file]
                }));
                return false;
            },
            fileList
        };

        return (
            <Layout className="apply-container" style={{ minHeight: '100vh' }}>
                <Layout.Content className="apply-content">
                    <Row type="flex" justify="center" align="middle">
                        <Col>
                            <Form className="submit-form">
                                {data ? (
                                    <>
                                        <div className="job-title">
                                            {data && data.title}
                                        </div>
                                        <div className="job-description">
                                            <i
                                                style={{
                                                    borderBottom:
                                                        '#ccc 1px solid',
                                                    width: '100%',
                                                    display: 'block',
                                                    paddingBottom: '1em'
                                                }}
                                            >
                                                Description
                                            </i>
                                            <ReactQuill
                                                value={
                                                    this.state.data.description
                                                }
                                                readOnly={true}
                                                theme={'snow'}
                                            />
                                            <Divider />
                                            {isPassedDate(
                                                this.state.data.expireAt
                                            ) ? (
                                                <Alert
                                                    message="Expired"
                                                    description="This position has been expired and not available now."
                                                    type="warning"
                                                    showIcon
                                                />
                                            ) : !this.state.submited ? (
                                                <>
                                                    <div className="upload-item">
                                                        <div className="submit-title">
                                                            Submit your resume
                                                            now
                                                            <span> *</span>
                                                        </div>
                                                        <Upload
                                                            {...props}
                                                            className="upload-btn"
                                                        >
                                                            <UploadButton />
                                                        </Upload>
                                                    </div>
                                                </>
                                            ) : (
                                                <Result
                                                    status="success"
                                                    title="Summited!"
                                                    subTitle="Thank you for your attention, your resume will be saved and we will contact you soon!"
                                                />
                                            )}
                                        </div>
                                        {!isPassedDate(
                                            this.state.data.expireAt
                                        ) &&
                                            !this.state.submited && (
                                                <>
                                                    <Form.Item>
                                                        <span className="additional-note">
                                                            Additional note
                                                            (Optional)
                                                        </span>
                                                        <Input
                                                            onChange={
                                                                this
                                                                    .onNoteChange
                                                            }
                                                            value={
                                                                this.state.note
                                                            }
                                                            placeholder="Fill in your additional note"
                                                        />
                                                    </Form.Item>
                                                    <Form.Item>
                                                        <Button
                                                            type="primary"
                                                            className="btn-submit"
                                                            loading={uploading}
                                                            onClick={
                                                                this
                                                                    .handleUpload
                                                            }
                                                            disabled={
                                                                fileList.length ===
                                                                0
                                                            }
                                                        >
                                                            {uploading
                                                                ? 'Submiting'
                                                                : 'Submit'}
                                                        </Button>
                                                    </Form.Item>
                                                </>
                                            )}
                                    </>
                                ) : (
                                    <Skeleton
                                        active
                                        paragraph={{ rows: 5, width: 40 }}
                                    />
                                )}
                            </Form>
                        </Col>
                    </Row>
                </Layout.Content>
            </Layout>
        );
    }
}

const UploadButton = props => (
    <Button type="dashed" className="upload-btn" icon="upload">
        Upload your resume
    </Button>
);

const isPassedDate = date => {
    return moment(new Date().toISOString().split('T')[0], 'YYYY-MM-DD').isAfter(
        moment(date, 'YYYY-MM-DD')
    );
};
