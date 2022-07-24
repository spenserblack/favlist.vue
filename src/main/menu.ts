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

const fileItems: MenuItemConstructorOptions[] = [
  {
    label: 'View data file',
    click: () => shell.showItemInFolder(dbPath),
  },
  {
    label: 'Import as...',
    submenu: [
      {
        label: 'JSON (Legacy)',
        click: async () => {
          const { canceled, filePaths: [filePath] } = await dialog.showOpenDialog({
            title: 'Import from JSON (legacy)',
            buttonLabel: 'Import',
            properties: ['openFile'],
            filters: [{ name: 'JSON', extensions: ['json'] }],
          });
          if (canceled) return;

          const strFilePath = filePath as string;

          let jsonData: string;
          try {
            jsonData = await readFile(strFilePath, 'utf8');
          } catch (err: any) {
            dialog.showErrorBox('Error importing', err.message);
            return;
          }
          // TODO Catch JSON.parse error
          await fromJson(JSON.parse(jsonData));
          dialog.showMessageBox({
            title: 'Import complete',
            message: 'Import complete',
          });
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
        // TODO Don't hardcode version number
        ['Version', '2.0.0'],
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
