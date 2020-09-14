<template lang='pug'>
  .favlist
    .header
      .left-spacer
      Title.title(v-bind:title='title' @update='onTitleUpdate')
      .right-spacer
        button.remove-button(@click='$store.commit("removeFavlist", index)')
          | - Remove List
    Items(:columns='columns' :data='data' @update-header='onHeaderUpdate')
</template>

<script>
import Title from './Favlist/Title.vue';
import Items from './Favlist/Items.vue';

export default {
  name: 'Favlist',
  props: ['title', 'columns', 'data', 'index'],
  components: {
    Title,
    Items,
  },
  methods: {
    onTitleUpdate(newTitle) {
      this.$emit('update-title', newTitle);
    },
    onHeaderUpdate(newHeader, index) {
      this.$emit('update-column', newHeader, index);
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
