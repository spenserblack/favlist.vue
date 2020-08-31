<template lang='pug'>
  .favlist
    .header
      .left-spacer
      Title.title(v-bind:title='title' @update='onTitleUpdate')
      .right-spacer
        button.remove-button(@click='$emit("delete")') - Remove List
    Items(:items='items')
</template>

<script>
import Title from './FavlistTitle.vue';
import Items from './FavlistItems.vue';

export default {
  name: 'Favlist',
  props: ['title', 'items'],
  components: {
    Title,
    Items,
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
  .header
    display: flex
    flex-direction: row
    justify-content: center
    align-items: center

    .left-spacer, .right-spacer
      width: 10%
</style>
