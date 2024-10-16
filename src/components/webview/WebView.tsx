import React, { useEffect, useRef } from 'react';
import './WebView.css';
import Draggable from 'react-draggable';
import { WebviewTag } from 'electron';
import IconButton from '@mui/material/IconButton';
import { ArrowForward } from '@mui/icons-material';

type WebViewProps = {
    url: string;
    sendTitleToCodeEditor: (title: string) => void;
};

/**
 * Component that renders the embedded browser
 * @param url:: Initial URL to load.
 */
function WebView({ url, sendTitleToCodeEditor }: WebViewProps) {
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
            // webview.openDevTools();
            webview.setZoomFactor(0.5);
            extractPageTitle(webview);
        });
    }, []);

    function executeCurrentLine(): void {
        // @ts-ignore
        window.electronAPI.executeCurrentLineAndWait();
    }

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
                            allowpopups
                            id="web-view"
                            src={url}
                            className={'webview'}
                            nodeintegration
                        ></webview>
                    </div>
                </div>
            </Draggable>
        </>
    );
}

export default WebView;
