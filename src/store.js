import Cell from './Cell.js';
import Vue from 'vue';
import Vuex from 'vuex';
import {v4 as uuidv4} from 'uuid';

Vue.use(Vuex);

export const favlistLocalStorage = 'favlists';

export default new Vuex.Store({
  strict: process.env.NODE_ENV !== 'production',
  state: {
    favlists: JSON.parse(localStorage.getItem(favlistLocalStorage)) || [],
  },
  getters: {
    favlist: (state) => (index) => {
      return state.favlists[index];
    },
    title: (state, getters) => (favlistIndex) => {
      return getters.favlist(favlistIndex).title;
    },
    headers: (state, getters) => (favlistIndex) => {
      return getters.favlist(favlistIndex).columns;
    },
    header: (state, getters) => (favlistIndex, column) => {
      return getters.headers(favlistIndex)[column];
    },
    data: (state, getters) => (favlistIndex) => {
      return getters.favlist(favlistIndex).data;
    },
    column: (state, getters) => (favlistIndex, column) => {
      return getters.data(favlistIndex)[column];
    },
    cell: (state, getters) => (favlistIndex, column, cell) => {
      return getters.column(favlistIndex, column)[cell];
    },
    datum: (state, getters) => (favlistIndex, column, cell) => {
      return getters.cell(favlistIndex, column, cell).datum;
    },
    datumKey: (state, getters) => (favlistIndex, column, cell) => {
      return getters.cell(favlistIndex, column, cell).key;
    },
    height: (state, getters) => (favlistIndex) => {
      return getters.data(favlistIndex).reduce((max, column) => {
        const height = column.length;
        return height > max ? height : max;
      }, 0);
    },
    width: (state, getters) => (favlistIndex) => {
      return getters.data(favlistIndex).length;
    },
  },
  mutations: {
    newFavlist(state) {
      state.favlists.push({
        title: '',
        columns: ['', ''],
        data: [
          [
            new Cell(1),
            new Cell(2),
            new Cell(3),
          ],
          [
            new Cell(4),
            new Cell(5),
            new Cell(6),
          ],
        ],
        key: uuidv4(),
      });
      localStorage.setItem(favlistLocalStorage, JSON.stringify(state.favlists));
    },
    removeFavlist(state, index) {
      state.favlists.splice(index, 1);
      localStorage.setItem(favlistLocalStorage, JSON.stringify(state.favlists));
    },
    updateTitle(state, payload) {
      const {favlistIndex, title} = payload;
      state.favlists[favlistIndex].title = title;
      localStorage.setItem(favlistLocalStorage, JSON.stringify(state.favlists));
    },
    updateHeader(state, payload) {
      const {favlistIndex, columnIndex, header} = payload;
      state.favlists[favlistIndex].columns.splice(columnIndex, 1, header);
      localStorage.setItem(favlistLocalStorage, JSON.stringify(state.favlists));
    },
    updateCell(state, payload) {
      const {favlistIndex, columnIndex, cellIndex, datum} = payload;
      state.favlists[favlistIndex].data[columnIndex][cellIndex].datum = datum;
      localStorage.setItem(favlistLocalStorage, JSON.stringify(state.favlists));
    },
    addRow(state, favlistIndex) {
      state.favlists[favlistIndex]
        .data
        .forEach(column => column.push(new Cell('')));
      localStorage.setItem(favlistLocalStorage, JSON.stringify(state.favlists));
    },
    removeRow(state, payload) {
      const {favlistIndex, row} = payload;
      state.favlists[favlistIndex]
        .data
        .forEach(column => column.splice(row, 1));
      localStorage.setItem(favlistLocalStorage, JSON.stringify(state.favlists));
    },
  },
});
