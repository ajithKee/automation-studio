import React from 'react';
import './WebView.css';

type WebViewProps = {
    url: string;
};

/**
 * Component that renders the embedded browser
 * @param url:: Initial URL to load.
 */
function WebView({ url }: WebViewProps) {
    return (
        <div className={'webview-container'}>
            <webview id="web-view" src={url} className={'webview'}></webview>
        </div>
    );
}

export default WebView;
