<template lang='pug'>
  #app
    h1 FAVLIST
    .navbar
      .routes
        RouterLink.route(to='/') Home
      .add-favlist
        span.route.add-favlist(@click='$store.commit("newFavlist")') +
    .meta-buttons
      ExportFavlist
      ImportFavlist
      SaveFavlist
    RouterView
    .alerts
      Alert(v-for='(alert, index) in alerts' :key='`${index}-${alert}`')
        | {{ alert }}
</template>

<script>
import Alert from './components/Alert.vue';
import ExportFavlist from './components/Export.vue';
import Home from './routes/Home.vue';
import ImportFavlist from './components/Import.vue';
import SaveFavlist from './components/Save.vue';
import Vue from 'vue';
import VueRouter from 'vue-router';

import debounce from 'debounce';
import favlistLocalStorage from './local-storage-name.js';
import setTimeout from 'core-js/stable/set-timeout';
import store from './store';
import stringifyJson from 'core-js/stable/json/stringify';

Vue.use(VueRouter);

const routes = [
  { path: '/', component: Home },
];

const router = new VueRouter({routes});

export default {
  name: 'App',
  router,
  store,
  components: {
    Alert,
    ExportFavlist,
    ImportFavlist,
    SaveFavlist,
  },
  data() {
    return { alerts: [] };
  },
  computed: {
    favlists() {
      return store.state.favlists;
    },
    noLists() {
      return !(this.favlists || []).length;
    },
  },
  methods: {
    save() {
      const favlists = stringifyJson(store.state.favlists);
      localStorage.setItem(favlistLocalStorage, favlists);
      this.alerts.push('Saved!');
      setTimeout(() => this.alerts.shift(), 10);
    },
  },
  mounted() {
    store.subscribe(debounce(this.save, 500));
  },
};
</script>

<style lang='stylus'>
@require './styles/variables.styl'

#app
  font-family: Avenir, Helvetica, Arial, sans-serif
  -webkit-font-smoothing: antialiased
  -moz-osx-font-smoothing: grayscale
  text-align: center
  background-color: #222
  color: textColor
  left: 0
  top: 0
  height: 100%
  width: 100%
  overflow: auto
  position: fixed

  button
    background-color: secondaryColor
    border: none
    color: textColor
    cursor: pointer
    padding: .5em
    min-width: 5em
    min-height: 2em

  .muted
    opacity: .5
</style>

<style lang='stylus' scoped>
@require './styles/variables.styl'

  .meta-buttons, .navbar
    background-color: secondaryColor
    width: auto

  .alerts
    position: fixed
    right: 1vw
    bottom: 1vh

  .navbar
    display: flex
    justify-content: space-between

    .route
      sideMargin = 1em

      display: inline-block
      font-size: 1.5em
      color: textColor
      cursor: pointer
      margin-left: sideMargin
      margin-right: sideMargin

      &.active
        font-style: oblique

      &.show-all
      &.add-favlist
        width: 15%

      &.add-favlist
        transition: 0.5s ease

        &:hover
          color: lighten(textColor, 30%)
</style>
