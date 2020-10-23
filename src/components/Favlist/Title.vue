<template lang='pug'>
  component.title(
    :is='componentTag'
    contenteditable
    @input='onInput'
    :class='{empty}'
    :key='key'
  ) {{ title }}
</template>

<script>
export default {
  name: 'FavlistTitle',
  props: {
    index: {
      type: Number,
      required: true,
    },
    headerLevel: {
      type: Number,
      default: 2,
      validator: value => value >= 1 && value <= 6,
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
    componentTag() {
      return `h${this.headerLevel}`;
    },
  },
  methods: {
    onInput(e) {
      this.$store.commit({
        type: 'updateTitle',
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
