import React from 'react';
import MonacoEditor from 'react-monaco-editor';

type codeEditorProps = {};

function CodeEditor(props: codeEditorProps) {
    return (
        <>
            <div className={'code-editor-container'}>
                <MonacoEditor
                    className={'code-editor-container'}
                    width="500"
                    height="300"
                    language="javascript"
                    theme="vs-dark"
                    value={'console.log("ajith")'}
                />
            </div>
        </>
    );
}

export default CodeEditor;
