<template lang='pug'>
  td(:class='{empty}' contenteditable) {{ datum }}
</template>

<script>
export default {
  name: 'DataCell',
  props: {
    datum: {
      type: [String, Number, Boolean, Date],
      required: true,
    },
  },
  computed: {
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
