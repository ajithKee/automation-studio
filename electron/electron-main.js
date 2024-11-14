const { app, BrowserWindow, ipcMain, contextBridge } = require('electron');
const path = require('path');
const pie = require('./puppeteer/electron-puppeteer');
const puppeteer = require('puppeteer-core');
const { performSampleTest } = require('./puppeteer/sample-test');
var fs = require('fs');

const { PuppeteerScreenRecorder } = require('puppeteer-screen-recorder');

let browser, studioWindow, page;
let recorder;
let currentIndex = 0;

/**
 * connect the app with Puppeteer.
 */
(async () => {
    await pie.initialize(app, 8315);
    browser = await pie.connect(app, puppeteer);
})();

app.on('ready', async () => {
    createStudioWindow();
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
            nodeIntegrationInSubFrames: true,
            webviewTag: true,
            preload: path.join(__dirname, 'electron-main-preload.js'),
        },
    };

    studioWindow = new BrowserWindow(config);
    studioWindow.loadURL('http://localhost:3000');
    studioWindow.webContents.openDevTools();
    studioWindow.maximize();
    studioWindow.show();

    studioWindow.webContents.on('dom-ready', async () => {
        page = await pie.getWebViewWindowPage(browser, studioWindow);
        recorder = new PuppeteerScreenRecorder(page);
        //await performSampleTest(page);
    });
};

/*
    On next button click, splits the code to get just the line and then execute it. Just proof of concept. Needs more secure implementation
 */
ipcMain.on('execute-current-line-of-code', async () => {
    let sampleScript = `page.goto('https://www.healthcare.gov');
    page.click('xpath/' + "//a[contains(text(),'Log in')]");
    page.click('xpath/' + "//a[contains(text(),'Español')]")`;
    let line = sampleScript.split(';');
    eval(line[currentIndex].trim());
    currentIndex++;
});

ipcMain.on('execute-capture-screenshot', async (event, imageData) => {
    let filePath = path.join(__dirname, 'test_image.png');
    fs.writeFile(filePath, imageData, (err) => {
        if (err) {
            console.error('Error writing file:', err);
        } else {
            console.log('File written successfully.');
        }
    });
});

ipcMain.on('start-screen-recording', async (event) => {
    const SavePath = './demo-screen-capture.mp4';
    await recorder.start(SavePath);
});

ipcMain.on('stop-screen-recording', async (event) => {
    await recorder.stop();
});
