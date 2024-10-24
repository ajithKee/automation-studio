import React, { useEffect, useState } from 'react';
import './App.css';
import WebView from './components/webview/WebView';
import CodeEditor from './components/codeEditor/CodeEditor';
import Dag from './components/dag/Dag';

function App() {
    let [pageTitle, setPageTitle] = useState('');
    let [textFromCodeEditor, setTextFromCodeEditor] = useState('');

    const getPageTitleFromWebView = (title: string) => {
        setPageTitle(title);
    };

    const getTextFromCodeEditor = (text: string) => {
        setTextFromCodeEditor(text);
    };

    return (
        <>
            <CodeEditor
                pageTitle={pageTitle}
                sendEditorTextToWebview={getTextFromCodeEditor}
            ></CodeEditor>
            <Dag></Dag>

            <WebView
                url="http://www.google.com"
                sendTitleToCodeEditor={getPageTitleFromWebView}
                textFromCodeEditor={textFromCodeEditor}
            ></WebView>
        </>
    );
}

export default App;
