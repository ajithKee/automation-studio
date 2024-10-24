import React, { useEffect, useRef, useState } from 'react';
import './WebView.css';
import Draggable from 'react-draggable';
import { WebviewTag, NativeImage, DesktopCapturer } from 'electron';

import IconButton from '@mui/material/IconButton';
import { ArrowForward, VideoCall } from '@mui/icons-material';
import MonacoEditor from 'react-monaco-editor';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import VideocamIcon from '@mui/icons-material/Videocam';
import VideocamOffIcon from '@mui/icons-material/VideocamOff';

type WebViewProps = {
    url: string;
    sendTitleToCodeEditor: (title: string) => void;
    textFromCodeEditor: string;
};

let desktopCapturer: DesktopCapturer;

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
            //webview.openDevTools();
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
    }, [textFromCodeEditor]);

    function executeCurrentLine(): void {
        // @ts-ignore
        window.electronAPI.executeCurrentLineAndWait();
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
                </div>
            </Draggable>
        </>
    );
}

export default WebView;
