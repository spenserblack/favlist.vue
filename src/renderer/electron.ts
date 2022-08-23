const electron = (window as Window).electron;
export const electronMessage = electron.message;
export const allFavlists = electron.allFavlists;
export const getFavlist = electron.getFavlist;
export const addFavlist = electron.addFavlist;
export const deleteFavlist = electron.deleteFavlist;
export const addColumn = electron.addColumn;
export const editColumn = electron.editColumn;
export const deleteColumn = electron.deleteColumn;
export const addRow = electron.addRow;
export const editRow = electron.editRow;
export const deleteRow = electron.deleteRow;
export const setWindowTitle = (title: string): void => {
  electron.setWindowTitle(title);
  window.document.title = title;
};
