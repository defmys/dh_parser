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

    win.on("close", (event) => {
        const options = {
            title: "关闭",
            message: "是否保存修改？",
            type: "question",
            buttons: ["是", "否", "取消"],
            defaultId: 0
        };

        const response = dialog.showMessageBox(win, options);
        if (response === 0) {
            win.webContents.send("saveAll");
        }

        switch (response) {
        case 0:  // 是
            win.webContents.send("saveAll");
            break;
        case 1:  // 否
            // 不保存，直接退出
            break;
        case 2:  // 取消
            event.preventDefault();
            break;
        default:
            break;
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