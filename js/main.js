"use strict";

import { app, BrowserWindow, dialog } from "electron";

let win = null;

function createWindow () {
    win = new BrowserWindow({ width: 1300, height: 800 });
    win.loadFile("src/index.html");
    // win.webContents.openDevTools();

    win.on("closed", () => {
        win = null;
    });

    win.on("close", () => {
        const options = {
            title: "关闭",
            message: "是否保存修改？",
            type: "question",
            buttons: ["保存", "取消"],
            defaultId: 0
        };

        if (dialog.showMessageBox(win, options) === 0) {
            win.webContents.send("saveAll");
        }
    });
}

app.on("ready", createWindow);

app.on("window-all-closed", () => {
    app.quit();
});

app.on("activate", () => {
    if (win === null) {
        createWindow();
    }
});