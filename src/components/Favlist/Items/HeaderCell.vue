<template lang='pug'>
  th(:class='{empty}' contenteditable) {{ header }}
</template>

<script>
export default {
  name: 'HeaderCell',
  props: {
    header: {
      type: String,
      required: true,
    },
  },
  computed: {
    empty() {
      return !this.header;
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
