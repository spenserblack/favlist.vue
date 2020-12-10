<template lang='pug'>
  #app
    RouterView(name='title' :key='$route.path')
    .navbar
      .routes
        RouterLink.route(:to='{name: "home"}') Home
        RouterLink.route(
          v-for='(list, index) in favlists'
          :to='{name: "favlist", params: {index}}'
          :class='{muted: !list.title}'
          :key='index'
        ) {{ list.title || 'New List' }}
      .add-favlist
        span.route.add-favlist(@click='$store.commit("newFavlist")') +
    .meta-buttons
      ExportFavlist(@copied='makeAlert("Copied to clipboard!", 1500)')
      ImportFavlist
      SaveFavlist
    RouterView(@invalid-route='onInvalidRoute')
    .alerts
      Alert(
        v-for='alert in alerts'
        :level='alert.level'
        :key='alert.alertNumber'
      ) {{ alert.text }}
</template>

<script>
import Alert from './components/Alert.vue';
import ExportFavlist from './components/Export.vue';
import Favlist from './components/Favlist.vue';
import Home from './routes/Home.vue';
import HomeTitle from './routes/HomeTitle.vue';
import ImportFavlist from './components/Import.vue';
import SaveFavlist from './components/Save.vue';
import Title from './components/Favlist/Title.vue';
import Vue from 'vue';
import VueRouter from 'vue-router';

import debounce from 'debounce';
import { favlistLocalStorage } from '@/utils';
import setTimeout from 'core-js/stable/set-timeout';
import store from './store';
import stringifyJson from 'core-js/stable/json/stringify';

Vue.use(VueRouter);

// NOTE Temporary warning function until App is mounted
let routerWarn = (message) => console.warn(message);

const routes = [
  {
    path: '/',
    name: 'home',
    components: {
      default: Home,
      title: HomeTitle,
    },
  },
  {
    path: String.raw`/favlist/:index(\d+)`,
    name: 'favlist',
    components: {
      default: Favlist,
      title: Title,
    },
    props: {
      default: route => ({
        index: Number.parseInt(route.params.index),
        isRoute: true,
      }),
      title: route => ({
        index: Number.parseInt(route.params.index),
        headerLevel: 1,
      }),
    },
    beforeEnter(to, from, next) {
      if (to.params.index >= (store.state.favlists || []).length) {
        routerWarn('Tried to access non-existent list');
        next({name: 'home'});
        return;
      }
      next();
    },
  },
];

let alertCounter = 0;

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
      const favlists = stringifyJson(store.getters.forSave);
      localStorage.setItem(favlistLocalStorage, favlists);
      this.makeAlert('Saved!', 10);
    },
    onInvalidRoute(message) {
      this.makeAlert(
        message || 'Attempted to access an invalid route',
        1000,
        'warning',
      );
    },
    makeAlert(text, timeout, level = undefined) {
      const alertNumber = alertCounter++;
      this.alerts.push({text, level, alertNumber});
      const removeAlert = () => {
        this.alerts = this
          .alerts
          .filter(alert => alert.alertNumber != alertNumber);
      };
      setTimeout(removeAlert, timeout);
    },
  },
  mounted() {
    store.subscribe(debounce(this.save, 1000));
    routerWarn = this.onInvalidRoute;
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
  background-color: backgroundColor
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
    max-width: 15em

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
      text-decoration: none

      &.router-link-exact-active
        font-style: oblique

      &.show-all
      &.add-favlist
        width: 15%

      &:hover
        text-decoration: underline

      &.add-favlist
        transition: 0.5s ease

        &:hover
          color: lighten(textColor, 30%)
</style>
