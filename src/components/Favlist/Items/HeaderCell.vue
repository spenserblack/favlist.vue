<template lang='pug'>
  th(:class='{empty}' contenteditable @input='onInput') {{ header }}
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
  mounted() {
    this.$el.innerText = this.header;
  },
  computed: {
    empty() {
      return !this.header;
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
@require '../../../styles/variables'

.empty::before
  content: "Add a header"
  opacity: empty-opacity
</style>
