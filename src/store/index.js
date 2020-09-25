import Cell from '../Cell.js';
import Vue from 'vue';
import Vuex from 'vuex';
import favlistLocalStorage from '../local-storage-name.js';
import getters from './getters.js';
import {v4 as uuidv4} from 'uuid';

Vue.use(Vuex);

export const mutations = {
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
    state.favlists[favlistIndex].columns.splice(columnIndex, 1, header);
  },
  updateCell(state, payload) {
    const {favlistIndex, columnIndex, cellIndex, datum} = payload;
    state.favlists[favlistIndex].data[columnIndex][cellIndex].datum = datum;
  },
  addColumn(state, favlistIndex) {
    state.favlists[favlistIndex].columns.push('');

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
};

export default new Vuex.Store({
  strict: process.env.NODE_ENV !== 'production',
  state: {
    favlists: JSON.parse(localStorage.getItem(favlistLocalStorage)) || [],
  },
  getters,
  mutations,
});
