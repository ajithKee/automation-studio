import React, { useEffect, useState } from 'react';
import './App.css';
import WebView from './components/webview/WebView';
import CodeEditor from './components/codeEditor/CodeEditor';
import SplitPane from 'react-split-pane';
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
        // @ts-ignore
        <SplitPane
            split="vertical"
            allowResize={true}
            defaultSize={550}
            className={'main'}
        >
            {/*// @ts-ignore*/}
            <SplitPane
                split="horizontal"
                allowResize={true}
                defaultSize={350}
                className={'main'}
            >
                <CodeEditor
                    pageTitle={pageTitle}
                    sendEditorTextToWebview={getTextFromCodeEditor}
                ></CodeEditor>
                <Dag></Dag>
            </SplitPane>

            <WebView
                url="http://www.google.com"
                sendTitleToCodeEditor={getPageTitleFromWebView}
                textFromCodeEditor={textFromCodeEditor}
            ></WebView>
        </SplitPane>
    );
}

export default App;
