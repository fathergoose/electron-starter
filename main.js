const { app, BrowserWindow, ipcMain, dialog, Menu } = require("electron");
const path = require("node:path");
const pdf = require("pdfreader");
const csv = require("csv");

async function handleFileOpen() {
  const { canceled, filePaths } = await dialog.showOpenDialog({});
  if (!canceled) {
    const items = [];
    await new Promise((resolve, reject) => {
      new pdf.PdfReader().parseFileItems(filePaths[0], (err, item) => {
        if (err) reject();
        else if (!item) resolve();
        else if (item.text) items.push(item);
      });
    });
    const lines = [];
    let index = -1;
    items.reduce(
      (prev, curr) => {
        if (curr.y === prev.y) {
          lines[index].push(curr.text);
        } else {
          index += 1;
          lines[index] = [curr.text];
        }
        return curr;
      },
      { y: -1 },
    );
    return items;
  }
}
const createWindow = () => {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });

  const menu = Menu.buildFromTemplate([
    {
      label: app.name,
      submenu: [
        {
          click: () => mainWindow.webContents.send("update-counter", 1),
          label: "Increment",
        },
        {
          click: () => mainWindow.webContents.send("update-counter", -1),
          label: "Decrement",
        },
      ],
    },
  ]);
  Menu.setApplicationMenu(menu);

  mainWindow.loadFile("index.html");

  mainWindow.webContents.openDevTools();
};

function handleSetTitle(event, title) {
  const webContents = event.sender;
  const win = BrowserWindow.fromWebContents(webContents);
  win.setTitle(title);
}

// Closing window quits process on windows and linux
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

app.whenReady().then(() => {
  ipcMain.handle("ping", () => "pong");
  ipcMain.handle("dialog:openFile", handleFileOpen);
  ipcMain.on("set-title", handleSetTitle);
  createWindow();
  // Create new window if there are none when the running app is activated
  // (only applicible to macos - see above)
  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});
