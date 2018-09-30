var _require = require('electron'),
    app = _require.app,
    BrowserWindow = _require.BrowserWindow;

var win = null;

function createWindow() {
  win = new BrowserWindow({ width: 1080, height: 600 });
  win.loadFile('src/index.html');
  win.webContents.openDevTools();

  win.on('closed', function () {
    win = null;
  });
}

app.on('ready', createWindow);

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', function () {
  if (win === null) {
    createWindow();
  }
});