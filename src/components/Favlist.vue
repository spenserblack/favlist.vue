<template lang='pug'>
  .favlist
    Title(v-bind:title='title')
</template>

<script>
import Title from './FavlistTitle.vue';

export default {
  name: 'Favlist',
  props: ['title'],
  components: {
    Title,
  },
};
</script>
