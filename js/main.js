'use strict';

import { app, BrowserWindow } from 'electron';

let win = null;

function createWindow () {
    win = new BrowserWindow({ width: 1300, height: 800 });
    win.loadFile('src/index.html');
    // win.webContents.openDevTools();

    win.on('closed', () => {
        win = null
    })
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
    app.quit()
});

app.on('activate', () => {
    if (win === null) {
        createWindow()
    }
});