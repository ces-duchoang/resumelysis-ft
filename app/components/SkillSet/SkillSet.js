import React, { useState } from 'react';
import { Tag, Button } from 'antd';
import './SkillSet.scss';

export default props => {
    const [isMore, setMore] = useState(props.isShow || false);
    const toggle = () => setMore(!isMore);
    return (
        <>
            {(isMore ? props.data : props.data.slice(0, 10)).map(i => (
                <Tag style={{marginTop: '2px'}} color="blue">{i}</Tag>
            ))}
            {props.data.length > 10 && (
                <Button
                    type="link"
                    onClick={e => toggle()}
                    className="toggle-show"
                >
                    {isMore ? 'Show less' : 'Show more'}
                </Button>
            )}
        </>
    );
};
