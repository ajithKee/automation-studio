import React, { useEffect, useRef, useState } from 'react';
import './WebView.css';
import Draggable from 'react-draggable';
import { WebviewTag, NativeImage, DesktopCapturer } from 'electron';

import IconButton from '@mui/material/IconButton';
import { ArrowForward, VideoCall } from '@mui/icons-material';
import MonacoEditor from 'react-monaco-editor';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import VideocamOffIcon from '@mui/icons-material/VideocamOff';

type WebViewProps = {
    url: string;
    sendTitleToCodeEditor: (title: string) => void;
    textFromCodeEditor: string;
};


/**
 * Component that renders the embedded browser
 * @param url:: Initial URL to load.
 */
function WebView({
    url,
    sendTitleToCodeEditor,
    textFromCodeEditor,
}: WebViewProps) {
    const webviewRef = useRef(null);

    let [content, setContent] = useState('');
    /* Code to extract the page title from the webview */
    const extractPageTitle = (webview: WebviewTag) => {
        let pageTitle = webview.getTitle();
        sendTitleToCodeEditor(pageTitle);
    };

    /* Code to control the webview display props and devTools */
    useEffect(() => {
        const webview = document.getElementById(
            'web-view'
        ) as unknown as WebviewTag;
        webview.addEventListener('dom-ready', function () {
            webview.openDevTools();
            webview.setZoomFactor(0.5);
            extractPageTitle(webview);






        });
    }, []);

    useEffect(() => {
        const webview = document.getElementById(
            'web-view'
        ) as unknown as WebviewTag;

        if (textFromCodeEditor !== '') {
            webview
                .executeJavaScript(textFromCodeEditor)
                .then((response) => setContent(response));
        }


        /* Inject a custom event function into webview */
        const testScript = `document.addEventListener('keypress', function(event) {
        if (event.ctrlKey && event.key === 'E') {
        console.log(document.documentElement.innerHTML);
        return document.documentElement.innerHTML;
        }});`;

        webview.addEventListener('dom-ready', function () {
            webview
                .executeJavaScript(testScript);
        });

    }, []);

    function executeCurrentLine(): void {
        // @ts-ignore
        window.electronAPI.executeCurrentLineAndWait();
    }

    function extractTopLevelElements(): void {
        const webview = document.getElementById(
            'web-view'
        ) as unknown as WebviewTag;

        const testScript = `function extractTopLevelDivs() {
                const rootElement = document.documentElement;
                const bodyElement = rootElement.querySelector("body");
                const divList = bodyElement.querySelectorAll("body:scope > div");
                console.log(divList);
                return divList;
            };
                
                extractTopLevelDivs();
            `;

        webview
            .executeJavaScript(testScript)
            .then((response) => console.log(response));
    }

    function captureScreenshot(): void {
        const webview = document.getElementById(
            'web-view'
        ) as unknown as WebviewTag;

        webview.capturePage().then((image: NativeImage) => {
            let imagePng = image.toPNG();
            // @ts-ignore
            window.electronAPI.captureWebViewScreenshot(imagePng);
        });
    }

    function captureVideo(): void {
        // @ts-ignore
        window.electronAPI.startScreenRecording();
    }

    function endCaptureVideo(): void {
        // @ts-ignore
        window.electronAPI.stopScreenRecording();
    }

    // @ts-ignore
    // @ts-ignore
    return (
        <>
            <Draggable disabled={true}>
                <div className={'webview-container-parent'}>
                    <IconButton
                        aria-label="next"
                        size="small"
                        color={'error'}
                        onClick={executeCurrentLine}
                    >
                        <ArrowForward />
                    </IconButton>

                    <div className={'webview-container'}>
                        <webview
                            ref={webviewRef}
                            id="web-view"
                            src={url}
                            className={'webview'}
                        ></webview>
                    </div>

                    <IconButton
                        aria-label="next"
                        size="small"
                        color={'error'}
                        onClick={captureScreenshot}
                    >
                        <CameraAltIcon />
                    </IconButton>

                    <IconButton
                        aria-label="next"
                        size="small"
                        color={'error'}
                        onClick={captureVideo}
                    >
                        <VideoCall />
                    </IconButton>

                    <IconButton
                        aria-label="next"
                        size="small"
                        color={'error'}
                        onClick={endCaptureVideo}
                    >
                        <VideocamOffIcon />
                    </IconButton>

                    <MonacoEditor
                        className={'code-editor-container'}
                        width="500"
                        height="200"
                        language="javascript"
                        theme="vs-dark"
                        value={content}
                    />

                    <IconButton
                        aria-label="next"
                        size="small"
                        color={'error'}
                        onClick={extractTopLevelElements}
                    >
                        <ArrowForward />
                    </IconButton>
                </div>
            </Draggable>
        </>
    );
}

export default WebView;
