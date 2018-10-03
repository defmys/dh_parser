'use strict';

import { app, BrowserWindow } from 'electron';

let win = null;

function createWindow () {
    win = new BrowserWindow({ width: 1080, height: 600 });
    win.loadFile('src/index.html');
    // win.webContents.openDevTools();

    win.on('closed', () => {
        win = null
    })
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
});

app.on('activate', () => {
    if (win === null) {
        createWindow()
    }
});