<template lang='pug'>
  #app
    Alert(
      class='alerts-item'
      v-for='(alert, index) in alerts'
      v-bind='alert'
      v-on:close='alerts.splice(index, 1)'
      :key='index'
    )
    h1 FAVLIST
    ExportFavlist
    SaveFavlist
    p(v-if='noLists') You don't have any lists :(
    Favlist(
      v-for='(favlist, index) in favlists'
      :key='favlist.key'
      :index='index'
    )
    button(v-on:click='$store.commit("newFavlist")') + Add List
</template>

<script>
import Alert from './components/Alert.vue';
import ExportFavlist from './components/Export.vue';
import Favlist from './components/Favlist.vue';
import SaveFavlist from './components/Save.vue';
import Vue from 'vue';
import Vuex from 'vuex';
import {v4 as uuidv4} from 'uuid';

Vue.use(Vuex);

const favlistLocalStorage = 'favlists';

const store = new Vuex.Store({
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
            {datum: 1, key: uuidv4()},
            {datum: 2, key: uuidv4()},
            {datum: 3, key: uuidv4()},
          ],
          [
            {datum: 4, key: uuidv4()},
            {datum: 5, key: uuidv4()},
            {datum: 6, key: uuidv4()},
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
        .forEach(column => column.push({datum: '', key: uuidv4()}));
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

export default {
  name: 'App',
  store,
  components: {
    Alert,
    ExportFavlist,
    SaveFavlist,
    Favlist,
  },
  data() {
    return {
      alerts: [],
    };
  },
  computed: {
    favlists() {
      return store.state.favlists;
    },
    noLists() {
      return !(this.favlists || []).length;
    },
  },
};
</script>

<style lang='stylus'>
#app
  font-family: Avenir, Helvetica, Arial, sans-serif
  -webkit-font-smoothing: antialiased
  -moz-osx-font-smoothing: grayscale
  text-align: center
  background-color: #222
  color: YellowGreen
</style>
