<template lang='pug'>
  h2.title(contenteditable @input='onInput' :class='{empty}') {{ title }}
</template>

<script>
export default {
  name: 'FavlistTitle',
  props: {
    title: {
      type: String,
      required: true,
    },
  },
  mounted() {
    this.$el.innerText = this.title;
  },
  computed: {
    empty() {
      return !this.title;
    },
  },
  methods: {
    onInput(e) {
      this.$emit('update', e.target.innerText);
    },
  },
};
</script>

<style lang='stylus' scoped>
.title
  min-width: 1em

.empty::before
  content: "Add a title"
  opacity: 66%
</style>
