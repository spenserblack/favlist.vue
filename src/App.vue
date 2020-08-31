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
      @update-title='favlists[index].title = $event'
      :key='index'
    )
    button(v-on:click='addList') + Add List
</template>

<script>
import Alert from './components/Alert.vue';
import Favlist from './components/Favlist.vue';

export default {
  name: 'App',
  components: {
    Alert,
    Favlist,
  },
  data() {
    let favlists = localStorage.getItem('favlists') || [];

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
        title: 'New Favlist',
        items: [],
      });
      console.warn('%c TODO%c save results', 'font-size: 2.5em', 'color: white');
    }
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
