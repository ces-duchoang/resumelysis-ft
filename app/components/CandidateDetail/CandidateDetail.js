import './CandidateDetail.scss';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Modal, Checkbox, Descriptions, Tag, Button } from 'antd';
import SkillSet from '../SkillSet';
import FileViewer from '../FileViewer';

const CandidateDetail = props => {
    const [isShowPdf, setShowPdf] = useState(false);
    const { data } = props;
    const fileType = data.file_name.split('.')[
        data.file_name.split('.').length - 1
    ];
    const fileLink = `${API_BASE_DOMAIN}/res/${data.file_name}`;
    const toggleShowPdf = () => {
        setShowPdf(!isShowPdf);
    };
    return (
        <Modal
            visible={props.visible}
            title={`${data.name}`}
            width={800}
            onCancel={() => props.close()}
            footer={<></>}
        >
            <div>
                <Descriptions title="Contact informations" layout="vertical">
                    <Descriptions.Item label="Name">
                        {data.name}
                    </Descriptions.Item>
                    <Descriptions.Item label="Telephone">
                        {data.phones.length
                            ? data.phones.map(p => <Tag key={p}>{p}</Tag>)
                            : '-'}
                    </Descriptions.Item>
                    <Descriptions.Item label="Email">
                        {data.email || '-'}
                    </Descriptions.Item>
                </Descriptions>
                {data.links.length !== 0 && (
                    <Descriptions layout="horizontal">
                        <Descriptions.Item label="Hyperlinks">
                            {data.links.map(l => (
                                <Tag key={l}>
                                    <a href={l} style={{ cursor: 'pointer' }}>
                                        {l.length > 32
                                            ? l.slice(0, 29) + '...'
                                            : l}
                                    </a>
                                </Tag>
                            ))}
                        </Descriptions.Item>
                    </Descriptions>
                )}
                <Descriptions
                    title="Candidate informations"
                    layout="horizontal"
                >
                    <Descriptions.Item label="Schools">
                        {data.schools.length
                            ? data.schools.map(p => <Tag key={p}>{p}</Tag>)
                            : '-'}
                    </Descriptions.Item>
                    <Descriptions.Item label="Majors">
                        {data.majors.length
                            ? data.majors.map(p => <Tag key={p}>{p}</Tag>)
                            : '-'}
                    </Descriptions.Item>
                    <Descriptions.Item label="Degrees">
                        {data.degrees.length
                            ? data.degrees.map(p => <Tag key={p}>{p}</Tag>)
                            : '-'}
                    </Descriptions.Item>
                </Descriptions>
                <Descriptions layout="horizontal">
                    <Descriptions.Item label="Occupations">
                        {data.occupations.length
                            ? data.occupations.map(p => <Tag key={p}>{p}</Tag>)
                            : '-'}
                    </Descriptions.Item>
                </Descriptions>
                <Descriptions layout="horizontal">
                    <Descriptions.Item label="Skills">
                        <SkillSet isShow data={data.skills} />
                    </Descriptions.Item>
                </Descriptions>
                <Descriptions layout="horizontal">
                    <Descriptions.Item label="Source file">
                        {data.file_name}
                        <Link to={fileLink || '#'}>
                            <Button type="link" icon="vertical-align-bottom" />
                        </Link>
                        <Checkbox
                            onChange={() => toggleShowPdf()}
                            value={isShowPdf}
                            className="show-pdf-btn"
                        >
                            Show resume file
                        </Checkbox>
                    </Descriptions.Item>
                </Descriptions>
                <Descriptions layout="horizontal">
                    <Descriptions.Item label="Candidate's note">
                        {data.note || 'None'}
                    </Descriptions.Item>
                </Descriptions>
                {isShowPdf && <FileViewer type={fileType} file={fileLink} />}
            </div>
        </Modal>
    );
};

export default CandidateDetail;
