const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
    executeCurrentLineAndWait: (message) => {
        ipcRenderer.send('execute-current-line-of-code', message);
    },
    captureWebViewScreenshot: (imageBuffer) => {
        ipcRenderer.send('execute-capture-screenshot', imageBuffer);
    },
    startScreenRecording: () => {
        ipcRenderer.send('start-screen-recording');
    },
    stopScreenRecording: () => {
        ipcRenderer.send('stop-screen-recording');
    },
});
