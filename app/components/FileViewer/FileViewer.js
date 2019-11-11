import React from 'react';
import FileViewerR from 'react-file-viewer';
import './FileViewer.scss';

const FileViewer = props => {
    return (
        <div className="resume-file-viewer">
            <div className="header">Original resume</div>
            {props.type === 'pdf' || props.type === 'docx' ? (
                <FileViewerR fileType={props.type} filePath={props.file} />
            ) : (
                <div className="message">
                    Sorry this file can not display, you can{' '}
                    <a href={props.file}>Click here</a> to read it.
                </div>
            )}
        </div>
    );
};

export default FileViewer;
