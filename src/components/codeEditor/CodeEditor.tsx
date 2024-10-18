import React, { useState } from 'react';
import MonacoEditor from 'react-monaco-editor';
import { ArrowForward } from '@mui/icons-material';
import IconButton from '@mui/material/IconButton';

type codeEditorProps = {
    pageTitle: string;
    sendEditorTextToWebview: (text: string) => void;
};

function CodeEditor({ pageTitle, sendEditorTextToWebview }: codeEditorProps) {
    let [editorText, setEditorText] = useState('');

    function getEditorText(text: string) {
        setEditorText(text);
    }

    return (
        <>
            <div className={'code-editor-container'}>
                <MonacoEditor
                    className={'code-editor-container'}
                    width="500"
                    height="200"
                    language="javascript"
                    theme="vs-dark"
                    value={editorText}
                    onChange={getEditorText}
                />

                <div>
                    <IconButton
                        aria-label="next"
                        size="small"
                        color={'error'}
                        onClick={() => sendEditorTextToWebview(editorText)}
                    >
                        <ArrowForward />
                    </IconButton>
                </div>
            </div>
        </>
    );
}

export default CodeEditor;
