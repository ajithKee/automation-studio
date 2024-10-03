const http = require('http');
const retry = require('async-retry');
const { v4 } = require('uuid');

/**
 * Code from electron-puppeteer npm library modified to target embedded WebViews instead of the main browser window page.
 */

const readJson = async (port) =>
    new Promise((resolve, reject) => {
        let json = '';
        const request = http.request(
            {
                host: '127.0.0.1',
                path: '/json/version',
                port,
            },
            (response) => {
                response.on('error', reject);
                response.on('data', (chunk) => {
                    json += chunk.toString();
                });

                response.on('end', () => {
                    resolve(JSON.parse(json));
                });
            }
        );
        request.on('error', reject);
        request.end();
    });

const initialize = async (app, port = 8315) => {
    if (!app) {
        throw new Error(
            "The parameter 'app' was not passed in. " +
                'This may indicate that you are running in node rather than electron.'
        );
    }

    if (app.isReady()) {
        throw new Error(
            'Must be called at startup before the electron app is ready.'
        );
    }

    if (port < 0 || port > 65535) {
        throw new Error(`Invalid port ${port}.`);
    }

    if (app.commandLine.getSwitchValue('remote-debugging-port')) {
        throw new Error(
            'The electron application is already listening on a port. Double `initialize`?'
        );
    }

    const actualPort = port;
    app.commandLine.appendSwitch('remote-debugging-port', `${actualPort}`);
    app.commandLine.appendSwitch('remote-debugging-address', '127.0.0.1');
    const electronMajor = parseInt(app.getVersion().split('.')[0], 10);
    // NetworkService crashes in electron 6.
    if (electronMajor >= 7) {
        app.commandLine.appendSwitch('enable-features', 'NetworkService');
    }
};

const connect = async (app, puppeteer) => {
    if (!puppeteer) {
        throw new Error("The parameter 'puppeteer' was not passed in.");
    }

    const port = app.commandLine.getSwitchValue('remote-debugging-port');
    if (!port) {
        throw new Error(
            'The electron application was not setup to listen on a port. Was `initialize` called at startup?'
        );
    }

    await app.whenReady();
    const json = await retry(() => readJson(port));

    return await puppeteer.connect({
        browserWSEndpoint: json.webSocketDebuggerUrl,
        defaultViewport: null,
    });
};

const getWebViewWindowPage = async (
    browser,
    window,
    allowBlankNavigate = true
) => {
    if (!browser) {
        throw new Error("The parameter 'browser' was not passed in.");
    }

    if (!window) {
        throw new Error("The parameter 'window' was not passed in.");
    }

    if (window.webContents.getURL() === '') {
        if (allowBlankNavigate) {
            await window.webContents.loadURL('about:blank');
        } else {
            throw new Error(
                'In order to get the puppeteer Page, we must be able ' +
                    'to execute JavaScript which requires the window having loaded a URL.'
            );
        }
    }

    // Added code to target the embedded webView Page instead of the main browser page.
    const webviewTarget = await browser.waitForTarget(
        (e) => e.type() === 'webview'
    );

    const page = webviewTarget.page();

    if (!page) {
        throw new Error(
            'Unable to find puppeteer Page from BrowserWindow. Please report this.'
        );
    }
    return page;
};

module.exports = {
    readJson,
    connect,
    getWebViewWindowPage,
    initialize,
};
