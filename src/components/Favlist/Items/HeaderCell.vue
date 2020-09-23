<template lang='pug'>
  th(:class='{empty}' contenteditable @input='onInput') {{ header }}
</template>

<script>
export default {
  name: 'HeaderCell',
  props: {
    favlist: {
      type: Number,
      required: true,
    },
    column: {
      type: Number,
      required: true,
    },
  },
  mounted() {
    this.$el.innerText = this.$store.getters.header(this.favlist, this.column);
  },
  computed: {
    header() {
      return this.$store.getters.header(this.favlist, this.column);
    },
    empty() {
      return !this.header;
    },
  },
  methods: {
    onInput(e) {
      this.$store.commit('updateHeader', {
        favlistIndex: this.favlist,
        columnIndex: this.column,
        header: e.target.innerText,
      });
    },
  },
};
</script>

<style lang='stylus' scoped>
@require '../../../styles/variables'

.empty::before
  content: "Add a header"
  opacity: empty-opacity
</style>
