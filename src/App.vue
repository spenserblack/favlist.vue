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
import SaveFavlist from './components/Save.vue';
import Favlist from './components/Favlist.vue';
import Vue from 'vue';
import Vuex from 'vuex';

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
    datum: (state, getters) => (favlistIndex, column, cell) => {
      return getters.column(favlistIndex, column)[cell];
    },
  },
  mutations: {
    newFavlist(state) {
      state.favlists.push({
        title: '',
        columns: ['', ''],
        data: [[1, 2, 3], [4, 5, 6]],
        key: new Date().getTime(),
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
      state.favlists[favlistIndex].data[columnIndex].splice(cellIndex, 1, datum);
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
