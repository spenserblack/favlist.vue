<template lang='pug'>
  .home
    p(v-if='noLists') You don't have any lists :(
    Favlist(
      v-for='(favlist, index) in favlists'
      @invalid-route='onInvalidRoute'
      :key='favlist.key'
      :index='index'
    )
</template>

<script>
import Favlist from '@/components/Favlist/Index.vue';

export default {
  name: 'Home',
  components: { Favlist },
  computed: {
    favlists() {
      return this.$store.state.favlists;
    },
    noLists() {
      return !(this.favlists || []).length;
    },
  },
  methods: {
    onInvalidRoute(message) {
      this.$emit('invalid-route', message);
    },
  },
};
</script>
