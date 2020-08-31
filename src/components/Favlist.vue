<template lang='pug'>
  .favlist
    Title(v-bind:title='title' @update='onTitleUpdate')
</template>

<script>
import Title from './FavlistTitle.vue';

export default {
  name: 'Favlist',
  props: ['title'],
  components: {
    Title,
  },
  methods: {
    onTitleUpdate(newTitle) {
      console.log('Title updated: ', newTitle);
      this.$emit('update-title', newTitle);
    },
  },
};
</script>
