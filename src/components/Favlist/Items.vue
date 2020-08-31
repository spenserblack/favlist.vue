<template lang='pug'>
  table.items
    thead
      tr
        th(
          v-for='header in columns'
          is='HeaderCell'
          v-bind='{header}'
        )
    tbody
      tr(v-for='(row, index) in data')
        td(v-for='datum in row' :class='empty(datum)' contenteditable)
          | {{ datum }}
</template>

<script>
import HeaderCell from './Items/HeaderCell.vue';

export default {
  name: 'FavlistItems',
  components: {
    HeaderCell,
  },
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

.empty::before
  opacity: 66%
</style>
