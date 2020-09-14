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
    p(v-if='noLists') You don't have any lists :(
    Favlist(
      v-for='(favlist, index) in favlists'
      v-bind='favlist'
      :index='index'
    )
    button(v-on:click='$store.commit("newFavlist")') + Add List
</template>

<script>
import Alert from './components/Alert.vue';
import Favlist from './components/Favlist.vue';
import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

const favlistLocalStorage = 'favlists';

const store = new Vuex.Store({
  state: {
    favlists: JSON.parse(localStorage.getItem(favlistLocalStorage)) || [],
  },
  mutations: {
    newFavlist(state) {
      state.favlists.push({
        title: '',
        columns: ['', ''],
        data: [[1,2,3],[4,5,6]],
        key: new Date().getTime(),
      });
      localStorage.setItem(favlistLocalStorage, JSON.stringify(state.favlists));
    },
    removeFavlist(state, index) {
      state.favlists.splice(index, 1);
      localStorage.setItem(favlistLocalStorage, JSON.stringify(state.favlists));
    },
    updateTitle(state, favlistIndex, title) {
      state.favlists[favlistIndex].title = title;
      localStorage.setItem(favlistLocalStorage, JSON.stringify(state.favlists));
    },
  },
});

export default {
  name: 'App',
  store,
  components: {
    Alert,
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
}
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
