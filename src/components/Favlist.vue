<template lang='pug'>
  .favlist
    .header
      .left-spacer
      Title.title(:index='index')
      .right-spacer
        button.remove-button(@click='removeSelf')
          | - Remove List
    Items(:index='index')
</template>

<script>
import Title from './Favlist/Title.vue';
import Items from './Favlist/Items.vue';

export default {
  name: 'Favlist',
  props: {
    index: {
      required: true,
      type: Number,
    },
  },
  components: {
    Title,
    Items,
  },
  computed: {
    title() {
      return this.$store.state.favlists[this.index].title;
    },
  },
  methods: {
    onHeaderUpdate(newHeader, index) {
      this.$emit('update-column', newHeader, index);
    },
    removeSelf() {
      if (confirm(`Delete ${this.title} and all of its data?`)) {
        this.$store.commit('removeFavlist', this.index);
      }
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
