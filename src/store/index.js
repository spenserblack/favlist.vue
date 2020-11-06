import Cell from '../Cell.js';
import Vue from 'vue';
import Vuex from 'vuex';
import favlistLocalStorage from '../local-storage-name.js';
import getters from './getters.js';
import {v4 as uuidv4} from 'uuid';

Vue.use(Vuex);

export const mutations = {
  loadFromJson(state, favlists) {
    Vue.set(state, 'favlists', favlists);
  },
  newFavlist(state) {
    state.favlists.push({
      title: '',
      columns: [new Cell('')],
      data: [[]],
      key: uuidv4(),
    });
  },
  removeFavlist(state, index) {
    state.favlists.splice(index, 1);
  },
  updateTitle(state, payload) {
    const {favlistIndex, title} = payload;
    state.favlists[favlistIndex].title = title;
  },
  updateHeader(state, payload) {
    const {favlistIndex, columnIndex, header} = payload;
    state.favlists[favlistIndex].columns[columnIndex].datum = header;
  },
  updateCell(state, payload) {
    const {favlistIndex, columnIndex, cellIndex, datum} = payload;
    state.favlists[favlistIndex].data[columnIndex][cellIndex].datum = datum;
  },
  addColumn(state, favlistIndex) {
    state.favlists[favlistIndex].columns.push(new Cell(''));

    const favlist = getters.favlist(state);
    const data = getters.data(state, {favlist});
    const height = getters.height(state, {data})(favlistIndex);

    const newColumn = new Array(height);

    for (let i = 0; i < height; ++i) {
      newColumn[i] = new Cell('');
    }

    state.favlists[favlistIndex].data.push(newColumn);
  },
  removeColumn(state, payload) {
    const {favlistIndex, column} = payload;

    state.favlists[favlistIndex].columns.splice(column, 1);
    state.favlists[favlistIndex].data.splice(column, 1);
  },
  addRow(state, favlistIndex) {
    state.favlists[favlistIndex]
      .data
      .forEach(column => column.push(new Cell('')));
  },
  removeRow(state, payload) {
    const {favlistIndex, row} = payload;
    state.favlists[favlistIndex]
      .data
      .forEach(column => column.splice(row, 1));
  },
  moveColumnLeft(state, payload) {
    const {favlistIndex, column} = payload;
    const favlist = state.favlists[favlistIndex];

    if (column == 0) {
      favlist.columns.push(favlist.columns.shift());
      favlist.data.push(favlist.data.shift());
    } else {
      favlist.columns.splice(column - 1, 0, ...favlist.columns.splice(column, 1));
      favlist.data.splice(column - 1, 0, ...favlist.data.splice(column, 1));
    }
  },
  moveColumnRight(state, payload) {
    const {favlistIndex, column} = payload;
    const favlist = state.favlists[favlistIndex];

    if (column == favlist.columns.length - 1 || column == favlist.data.length - 1) {
      favlist.columns.unshift(favlist.columns.pop());
      favlist.data.unshift(favlist.data.pop());
    } else {
      favlist.columns.splice(column + 1, 0, ...favlist.columns.splice(column, 1));
      favlist.data.splice(column + 1, 0, ...favlist.data.splice(column, 1));
    }
  },
};

export default new Vuex.Store({
  strict: process.env.NODE_ENV !== 'production',
  state: {
    favlists: JSON.parse(localStorage.getItem(favlistLocalStorage)) || [],
  },
  getters,
  mutations,
});
