<template lang='pug'>
  .favlist
    .left-spacer
    Title.title(v-bind:title='title' @update='onTitleUpdate')
    .right-spacer
      button.remove-button(@click='$emit("delete")') - Remove List
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
      this.$emit('update-title', newTitle);
    },
  },
};
</script>

<style lang='stylus' scoped>
.favlist
  display: flex
  flex-direction: row
  justify-content: center
  align-items: center

  .left-spacer, .right-spacer
    width: 10%
</style>
