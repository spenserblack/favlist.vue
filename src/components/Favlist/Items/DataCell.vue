<template lang='pug'>
  td(:class='{empty}' contenteditable) {{ datum }}
</template>

<script>
export default {
  name: 'DataCell',
  props: {
    datum: {
      type: String,
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
.empty::before
  content: "Add data"
  opacity: 66%
</style>
