<template lang='pug'>
  table.items
    thead
      tr
        th(v-for='header in columns' :class='empty(header)') {{ header }}
    tbody
      tr(v-for='row in data')
        td(v-for='datum in row' :class='empty(datum)')
          | {{ datum }}
</template>

<script>
export default {
  name: 'FavlistItems',
  props: {
    items: {
      type: Array,
      required: true,
    },
  },
  computed: {
    columns() {
      return this.items[0] || [];
    },
    data() {
      return this.items.slice(1);
    }
  },
  methods: {
    empty(value) {
      return {
        empty: !value,
      };
    },
  },
};
</script>

<style lang='stylus' scoped>
.items
  margin: auto

td.empty::before
  content: "Add an item"
  opacity: 66%

th.empty::before
  content: "Add a header"
  opacity: 66%

.empty::before
  opacity: 66%
</style>
