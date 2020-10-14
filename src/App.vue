<template lang='pug'>
  #app
    h1 FAVLIST
    .meta-buttons
      ExportFavlist
      ImportFavlist
      SaveFavlist
    p(v-if='noLists') You don't have any lists :(
    Favlist(
      v-for='(favlist, index) in favlists'
      :key='favlist.key'
      :index='index'
    )
    button(v-on:click='$store.commit("newFavlist")') + Add List
    .alerts
      p.alert(v-for='alert in alerts') {{ alert }}
</template>

<script>
import ExportFavlist from './components/Export.vue';
import Favlist from './components/Favlist.vue';
import ImportFavlist from './components/Import.vue';
import SaveFavlist from './components/Save.vue';
import debounce from 'debounce';
import favlistLocalStorage from './local-storage-name.js';
import store from './store';

export default {
  name: 'App',
  store,
  components: {
    ExportFavlist,
    ImportFavlist,
    SaveFavlist,
    Favlist,
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
      const favlists = JSON.stringify(store.state.favlists);
      localStorage.setItem(favlistLocalStorage, favlists);
      this.alerts.push('Saved!');
    },
  },
  mounted() {
    store.subscribe(debounce(this.save, 1000));
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
  position: absolute

  button
    background-color: secondaryColor
    border: none
    color: textColor
    cursor: pointer
    padding: .5em
    min-width: 5em
    min-height: 2em
</style>

<style lang='stylus' scoped>
@require './styles/variables.styl'

  .meta-buttons
    background-color: secondaryColor
    width: auto

  .alerts
    position: absolute
    right: 1vw
    bottom: 1vh
</style>
