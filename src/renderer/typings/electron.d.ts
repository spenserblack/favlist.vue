export interface Favlist {
  id: number;
  title: string;
  columns: Column[];
  rows: Row[];
}

export interface Column {
  id: number;
  favlistId: number;
  name: string;
}

export interface Row {
  id: number;
  [key: string]: string | number;
}

/**
 * Should match main/preload.ts for typescript support in renderer
 */
export default interface ElectronApi {
  message: (message: string) => Promise<void>;
  allFavlists: () => Promise<Favlist[]>;
  getFavlist: (id: number) => Promise<Favlist | null>;
  addFavlist: (title: string) => Promise<Favlist>;
  deleteFavlist: (id: number) => Promise<void>;
  addColumn: (favlistId: number) => Promise<Column>;
  editColumn: (id: number, name: string) => Promise<Column>;
  deleteColumn: (id: number) => Promise<boolean>;
  addRow: (favlistId: number) => Promise<Row>;
  editRow: (id: number, row: Record<number, string>) => Promise<Row>;
  deleteRow: (id: number) => Promise<boolean>;
  setWindowTitle: (title: string) => Promise<void>;
}

declare global {
  interface Window {
    electron: ElectronApi;
  }
}
