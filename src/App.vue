<template lang='pug'>
  #app
    h1 FAVLIST
    p(v-if='noLists') You don't have any lists :(
    button(v-on:click='addList') + Add List
</template>

<script>
export default {
  name: 'App',
  components: {},
  data() {
    return {
      favlists: [],
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
  color: #2c3e50
  margin-top: 60px
</style>
