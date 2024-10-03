import React from 'react';
import './App.css';
import WebView from './components/webview/WebView';

function App() {
    return (
        <div className="App">
            <WebView url="about:blank"></WebView>
        </div>
    );
}

export default App;
