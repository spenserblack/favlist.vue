<template lang='pug'>
  h2.title(contenteditable @input='onInput' :class='{empty}') {{ title }}
</template>

<script>
export default {
  name: 'FavlistTitle',
  props: {
    index: {
      type: Number,
      required: true,
    },
  },
  mounted() {
    this.$el.innerText = this.$store.getters.favlist(this.index).title;
  },
  computed: {
    title() {
      return this.$store.getters.title(this.index);
    },
    empty() {
      return !this.title;
    },
  },
  methods: {
    onInput(e) {
      this.$store.commit('updateTitle', {
        favlistIndex: this.index,
        title: e.target.innerText,
      });
    },
  },
};
</script>

<style lang='stylus' scoped>
@require '../../styles/variables'

.title
  min-width: 1em

.empty::before
  content: "Add a title"
  opacity: empty-opacity
</style>
