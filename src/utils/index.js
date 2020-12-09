import {v4 as uuidv4} from 'uuid';
import Cell from '@/Cell.js';

export const hasKeys = (favlists) => {
  return favlists.every((favlist) => {
    return Object.prototype.hasOwnProperty.call(favlist, 'key')
      && favlist.columns.every((header) => Object.prototype.hasOwnProperty.call(header, 'key'))
      && favlist.data.every((column) => column.every((cell) => Object.prototype.hasOwnProperty.call(cell, 'key')));
  });
};

export const addKeys = (favlists) => {
  return favlists.map(({ title, columns, data }) => {
    return {
      title,
      columns: columns.map((c) => new Cell(c)),
      data: data.map((column) => column.map((d) => new Cell(d))),
      key: uuidv4(),
    };
  });
};
