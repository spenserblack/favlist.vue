import {
  Menu,
  app,
  dialog,
  shell,
} from 'electron';
import { dbPath } from './db';
import type { MenuItemConstructorOptions } from 'electron';

const fileItems: MenuItemConstructorOptions[] = [
  { role: 'quit' },
  {
    label: 'View data file',
    click: () => shell.showItemInFolder(dbPath),
  },
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
