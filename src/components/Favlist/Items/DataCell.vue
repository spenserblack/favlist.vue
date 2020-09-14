<template lang='pug'>
  td(:class='{empty}' contenteditable) {{ datum }}
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
  computed: {
    datum() {
      const column = this.$store.state.favlists[this.favlist].data[this.column] || [];
      return column[this.cell] || null;
    },
    empty() {
      return !this.datum;
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
