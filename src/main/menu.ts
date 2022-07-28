import { readFile, writeFile } from 'fs/promises';
import { resolve } from 'path';
import {
  Menu,
  app,
  dialog,
  shell,
} from 'electron';
import { dbPath, asJson, fromJson } from './db';
import type { MenuItemConstructorOptions } from 'electron';

// TODO Move click events to a separate module to organize this massive
// config value
const fileItems: MenuItemConstructorOptions[] = [
  {
    label: 'View data file',
    click: () => shell.showItemInFolder(dbPath),
  },
  {
    label: 'Import from...',
    submenu: [
      {
        label: 'JSON (Legacy)',
        click: async (_menuItem, browserWindow) => {
          const { canceled, filePaths: [filePath] } = await dialog.showOpenDialog({
            title: 'Import from JSON (legacy)',
            buttonLabel: 'Import',
            properties: ['openFile'],
            filters: [{ name: 'JSON', extensions: ['json'] }],
          });
          if (canceled) return;

          const strFilePath = filePath as string;

          try {
            const jsonData = await readFile(strFilePath, 'utf8');
            const parsed = JSON.parse(jsonData);
            await fromJson(parsed);
          } catch (err: any) {
            dialog.showErrorBox('Error parsing JSON', err.message);
            return;
          }

          dialog.showMessageBox({
            title: 'Import complete',
            message: 'Import complete',
          });
          // TODO Load only newly imported items instead of reloading whole
          // window to query all items again.
          browserWindow?.reload();
        },
      },
    ],
  },
  {
    label: 'Export as...',
    submenu: [
      {
        label: 'JSON (Legacy)',
        click: async () => {
          const { canceled, filePath } = await dialog.showSaveDialog({
            title: 'Export as JSON (Legacy)',
            buttonLabel: 'Export',
            defaultPath: resolve(app.getPath('documents'), 'favlist.json'),
            filters: [{ name: 'JSON', extensions: ['json'] }],
          });
          if (canceled) return;

          const strFilePath = filePath as string;
          const json = await asJson();
          try {
            await writeFile(strFilePath, JSON.stringify(json, null, 2));
          } catch (err: any) {
            dialog.showErrorBox('Error exporting', err.message);
            return;
          }
          dialog.showMessageBox({
            title: 'Export successful',
            message: `Exported to ${strFilePath}`,
          });
        },
      },
    ],
  },
  { type: 'separator' },
  { role: 'quit' },
];
const fileMenu: MenuItemConstructorOptions = {
  label: 'File',
  submenu: fileItems,
};

const viewMenu: MenuItemConstructorOptions = { role: 'viewMenu' };

const windowMenu: MenuItemConstructorOptions = { role: 'windowMenu' };

const helpItems: MenuItemConstructorOptions[] = [
  {
    label: 'Version Info',
    click: () => dialog.showMessageBox({
      type: 'info',
      title: 'Version Info',
      message: [
        ['Version', app.getVersion()],
        ['Chrome', process.versions.chrome],
        ['Node', process.versions.node],
        ['Electron', process.versions.electron],
      ].map(([label, value]) => `${label}: ${value}`).join('\n'),
    }),
  },
];
const helpMenu: MenuItemConstructorOptions = {
  label: 'Help',
  submenu: helpItems,
};


const template = [
  fileMenu,
  viewMenu,
  windowMenu,
  helpMenu,
];

export default Menu.buildFromTemplate(template);
