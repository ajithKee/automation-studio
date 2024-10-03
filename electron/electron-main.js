const { app, BrowserWindow } = require('electron');
const path = require('path');
const pie = require('./puppeteer/electron-puppeteer');
const puppeteer = require('puppeteer-core');
const {performSampleTest} = require('./puppeteer/sample-test')

let browser, studioWindow;

/**
 * connect the app with Puppeteer.
 */
(async () => {
    await pie.initialize(app, 8315);
    browser = await pie.connect(app, puppeteer);
})();


app.on('ready', async () => {
    createStudioWindow();

    /* Stub code to test the puppeteer-electron integration. */
    setTimeout(async ()=> {
        const page = await pie.getWebViewWindowPage(browser, studioWindow);
        await performSampleTest(page)
    }, 2000)
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});

/**
 * Create the automation studio window.
 */
const createStudioWindow = () => {
    let config = {
        width: 1000,
        height: 800,
        title: 'Automation Studio',
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: true,
            webviewTag: true,
            preload: path.join(__dirname, 'electron-main-preload.js'),
        },
    };

    studioWindow = new BrowserWindow(config);
    studioWindow.loadURL('http://localhost:3000');
    studioWindow.maximize();
    studioWindow.show();
};
