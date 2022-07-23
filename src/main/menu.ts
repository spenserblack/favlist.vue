import { writeFile } from 'fs';
import {
  Menu,
  app,
  dialog,
  shell,
} from 'electron';
import { dbPath, asJson } from './db';
import type { MenuItemConstructorOptions } from 'electron';

const fileItems: MenuItemConstructorOptions[] = [
  {
    label: 'View data file',
    click: () => shell.showItemInFolder(dbPath),
  },
  {
    label: 'Export as...',
    submenu: [
      {
        label: 'JSON',
        click: async () => {
          const { canceled, filePath } = await dialog.showSaveDialog({
            title: 'Export as JSON',
            buttonLabel: 'Export',
            defaultPath: 'favlist.json',
            filters: [{ name: 'JSON', extensions: ['json'] }],
          });
          if (canceled) {
            return;
          }
          const strFilePath = filePath as string;
          const json = await asJson();
          writeFile(strFilePath, JSON.stringify(json, null, 2), (err) => {
            if (err) {
              dialog.showErrorBox('Error exporting', err.message);
              return;
            }
            dialog.showMessageBox({
              title: 'Export successful',
              message: `Exported to ${strFilePath}`,
            });
          });
        },
      },
    ],
  },
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
