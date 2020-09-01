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
      @update-title='saveOn(() => favlists[index].title = $event)'
      @update-column='(...args) => saveOn(() => updateColumn(index, ...args))'
      @delete='saveOn(() => favlists.splice(index, 1))'
    )
    button(v-on:click='saveOn(addList)') + Add List
</template>

<script>
import Alert from './components/Alert.vue';
import Favlist from './components/Favlist.vue';

const favlistLocalStorage = 'favlists';

export default {
  name: 'App',
  components: {
    Alert,
    Favlist,
  },
  data() {
    let favlists = JSON.parse(localStorage.getItem(favlistLocalStorage)) || [];

    return {
      favlists,
      alerts: [],
    };
  },
  computed: {
    noLists() {
      return !(this.favlists || []).length;
    },
  },
  methods: {
    addList() {
      this.favlists.push({
        title: '',
        columns: ['', ''],
        data: [[1,2,3],[4,5,6]],
        key: new Date().getTime(),
      });
    },
    updateColumn(favlistIndex, newColumn, index) {
      this.$set(this.favlists[favlistIndex].columns, index, newColumn);
    },
    saveOn(fn) {
      fn();
      localStorage.setItem(favlistLocalStorage, JSON.stringify(this.favlists));
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
