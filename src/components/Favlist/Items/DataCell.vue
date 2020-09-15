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
    const column = this.$store.state.favlists[this.favlist].data[this.column] || [];
    this.$el.innerText = column[this.cell] || null;
  },
  computed: {
    datum() {
      const column = this.$store.state.favlists[this.favlist].data[this.column] || [];
      return column[this.cell] || null;
    },
    empty() {
      return !this.datum;
    },
  },
  methods: {
    onInput(e) {
      this.$store.commit('updateCell', {
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
@require '../../../styles/variables'

.empty::before
  content: "Add data"
  opacity: empty-opacity
</style>
