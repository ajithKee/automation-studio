const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
    executeCurrentLineAndWait: (message) => {
        ipcRenderer.send('execute-current-line-of-code', message);
    },
});
