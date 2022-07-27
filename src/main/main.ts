import {
  app,
  BrowserWindow,
  ipcMain,
  Menu,
} from 'electron';
import installExtension, { VUEJS3_DEVTOOLS } from 'electron-devtools-installer';
import { autoUpdater } from 'electron-updater';
import {join} from 'path';
import * as events from './events';
import db from './db';
import menu from './menu';

Menu.setApplicationMenu(menu);

function createWindow () {
  const mainWindow = new BrowserWindow({
    title: 'Favlist',
    show: false,
    webPreferences: {
      preload: join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
    }
  });

  if (process.env.NODE_ENV === 'development') {
    const rendererPort = process.argv[2];
    mainWindow.loadURL(`http://localhost:${rendererPort}`);
  }
  else {
    mainWindow.loadFile(join(app.getAppPath(), 'renderer', 'index.html'));
  }
  mainWindow.maximize();
  mainWindow.show();
}

const main = async () => {
  app.enableSandbox();
  try {
    await Promise.all([app.whenReady(), db.sync()]);
  } catch (e) {
    console.error(e);
    app.exit(1);
  }

  try {
    await installDevtools();
  } catch (err: unknown) {
    console.error("Couldn't install extension(s)", err);
  }

  ipcMain.on('set-window-title', events.setWindowTitle);

  // NOTE Do not permit db interactions until it is synced
  ipcMain.handle('favlist:all', events.allFavlists);
  ipcMain.handle('favlist:get', events.getFavlist);
  ipcMain.handle('favlist:add', events.addFavlist);
  ipcMain.handle('favlist:delete', events.deleteFavlist);
  ipcMain.handle('favlist:column:add', events.addColumn);
  ipcMain.handle('favlist:column:edit', events.editColumn);
  ipcMain.handle('favlist:column:delete', events.deleteColumn);
  ipcMain.handle('favlist:row:add', events.addRow);
  ipcMain.handle('favlist:row:edit', events.editRow);
  ipcMain.handle('favlist:row:delete', events.deleteRow);

  createWindow();
  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
};

main();

app.on('ready', function updater() {
  autoUpdater.checkForUpdatesAndNotify();
});

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
});

ipcMain.on('message', (event, message) => {
  console.log(message);
});

async function installDevtools(): Promise<void> {
  if (app.isPackaged) {
    return;
  }
  const { default: installExtension, VUEJS3_DEVTOOLS } = await import('electron-devtools-installer');
  const name = await installExtension(VUEJS3_DEVTOOLS);
  console.log('Added Extension', name);
}
