<template lang='pug'>
  td(:class='{empty}' contenteditable @input='onInput') {{ datum }}
</template>

<script>
export default {
  name: 'DataCell',
  props: {
    favlist: {
      type: Number,
      required: true,
    },
    column: {
      type: Number,
      required: true,
    },
    cell: {
      type: Number,
      required: true,
    },
  },
  mounted() {
    this.$el.innerText = this
      .$store
      .getters
      .datum(this.favlist, this.column, this.cell);
  },
  computed: {
    datum() {
      return this.$store.getters.datum(this.favlist, this.column, this.cell);
    },
    empty() {
      return !this.datum;
    },
  },
  methods: {
    onInput(e) {
      this.$store.commit({
        type: 'updateCell',
        favlistIndex: this.favlist,
        columnIndex: this.column,
        cellIndex: this.cell,
        datum: e.target.innerText,
      });
    },
  },
};
</script>

<style lang='stylus' scoped>
.empty::before
  content: "Add data"
  opacity: empty-opacity
</style>
