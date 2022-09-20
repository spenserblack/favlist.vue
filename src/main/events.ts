import { BrowserWindow, ipcMain } from "electron";
import type {
  IpcMainEvent as Event,
  IpcMainInvokeEvent as InvokeEvent,
} from "electron";
import { Favlist, Column, Row, Cell } from "./db";

export function setWindowTitle(event: Event, title: string) {
  const webContents = event.sender;
  const win = BrowserWindow.fromWebContents(webContents);
  win?.setTitle(title);
}

export async function allFavlists() {
  const favlists = await Favlist.findAll({
    attributes: ["id", "title"],
  });
  return Promise.all(favlists.map((favlist: Favlist) => favlist.toJSON()));
}

export async function getFavlist(_event: InvokeEvent, id: number) {
  const favlist = await Favlist.findByPk(id);
  if (!favlist) {
    return null;
  }
  const favlistAsJson = favlist.toJSON();
  const columns = (await favlist.getColumns()).map((column: Column) => column.toJSON());
  const rowData = await favlist.getRows();
  const rows = await Promise.all(rowData.map((row: Row) => row.toJSON()));
  return {
    ...favlistAsJson,
    columns,
    rows,
  };
}

export async function addFavlist(_event: InvokeEvent, title: string) {
  const favlist = await Favlist.create({
    title,
  });
  return favlist.toJSON();
}

export async function deleteFavlist(_event: Event | InvokeEvent, id: number) {
  await Favlist.destroy({
    where: {
      id,
    },
  });
}

export async function addColumn(_event: InvokeEvent, favlistId: number) {
  const column = await Column.create({
    favlistId,
    name: "New Column",
  });
  const favlist = await column.getFavlist();
  const rows = await favlist.getRows();

  await Promise.all(
    rows.map((row: Row) =>
      Cell.create({
        rowId: row.id,
        columnId: column.id,
      }),
    ),
  );

  return column.toJSON();
}

export async function editColumn(_event: InvokeEvent, id: number, name: string) {
  const column = await Column.findByPk(id);
  if (!column) {
    console.error(`Column with id ${id} not found`);
    return null;
  }
  column.name = name;
  await column.save();
  return column.toJSON();
}

/**
 * @returns If the column was successfully deleted.
 */
export async function deleteColumn(_event: InvokeEvent, id: number): Promise<boolean> {
  const column = await Column.findByPk(id);
  if (!column) {
    return false;
  }
  await column.destroy();
  return true;
}

export async function addRow(_event: InvokeEvent, favlistId: number) {
  const row = await Row.create({
    favlistId,
  });
  const favlist = await row.getFavlist();
  const columns = await favlist.getColumns();

  await Promise.all(
    columns.map((column: Column) =>
      Cell.create({
        rowId: row.id,
        columnId: column.id,
      }),
    ),
  );

  return row.toJSON();
}

export async function editRow(
  _event: InvokeEvent,
  id: number,
  newRow: Record<number, string>,
) {
  const promises = Object.entries(newRow).map(async ([columnId, value]) => {
    const cell = await Cell.findOne({
      where: {
        rowId: id,
        columnId,
      },
    });
    if (!cell) {
      console.error(`Cell with rowId ${id} and columnId ${columnId} not found`);
      return;
    }
    cell.value = value;
    cell.save();
  });
  await Promise.all(promises);
  const row = await Row.findByPk(id);
  return await row!.toJSON();
}

export async function deleteRow(_event: InvokeEvent, id: number): Promise<boolean> {
  const row = await Row.findByPk(id);
  if (!row) {
    return false;
  }
  await row.destroy();
  return true;
}
