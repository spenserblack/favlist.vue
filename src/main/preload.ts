import { contextBridge, ipcRenderer, app } from "electron";
import path from "path";

contextBridge.exposeInMainWorld("electron", {
  message: (message: string) => ipcRenderer.send("message", message),
  allFavlists: () => ipcRenderer.invoke("favlist:all"),
  getFavlist: (id: number) => ipcRenderer.invoke("favlist:get", id),
  addFavlist: (title: string) => ipcRenderer.invoke("favlist:add", title),
  deleteFavlist: (id: number) => ipcRenderer.invoke("favlist:delete", id),
  addColumn: (favlistId: number) => ipcRenderer.invoke("favlist:column:add", favlistId),
  editColumn: (id: number, name: string) =>
    ipcRenderer.invoke("favlist:column:edit", id, name),
  deleteColumn: (id: number) => ipcRenderer.invoke("favlist:column:delete", id),
  addRow: (favlistId: number) => ipcRenderer.invoke("favlist:row:add", favlistId),
  editRow: (id: number, newRow: Record<number, string>) =>
    ipcRenderer.invoke("favlist:row:edit", id, newRow),
  deleteRow: (id: number) => ipcRenderer.invoke("favlist:row:delete", id),
  setWindowTitle: (title: string) => ipcRenderer.send("set-window-title", title),
});
