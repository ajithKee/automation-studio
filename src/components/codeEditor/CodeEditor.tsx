import React from 'react';
import MonacoEditor from 'react-monaco-editor';

type codeEditorProps = {
    pageTitle: string
};

function CodeEditor({pageTitle}: codeEditorProps) {
    return (
        <>
            <div className={'code-editor-container'}>
                <MonacoEditor
                    className={'code-editor-container'}
                    width="500"
                    height="300"
                    language="javascript"
                    theme="vs-dark"
                    value={`Current Page Title: ${pageTitle}`}
                />
            </div>
        </>
    );
}

export default CodeEditor;
