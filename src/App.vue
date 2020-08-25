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
    button(v-on:click='addList') + Add List
</template>

<script>
import {readFileSync} from 'fs';
import Alert from './components/Alert.vue';

export default {
  name: 'App',
  components: {
    Alert,
  },
  data() {
    const alerts = [];
    let favlists = [];

    try {
      const favlistFileText = readFileSync('favlist.json', 'utf8');
      favlists = JSON.parse(favlistFileText).favlists || [];
    } catch {
      alerts.push({
        type: 'info',
        message: 'No valid "favlist.json" file was found. One will be created.',
      });
    }

    return {
      favlists,
      alerts,
    };
  },
  computed: {
    noLists() {
      return !(this.favlists || []).length;
    },
  },
  methods: {
    addList() {
      alert('Not implemented');
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
