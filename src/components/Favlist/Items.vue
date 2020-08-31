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
        td(v-for='datum in row' is='DataCell' v-bind='{datum}')
</template>

<script>
import HeaderCell from './Items/HeaderCell.vue';
import DataCell from './Items/DataCell.vue';

export default {
  name: 'FavlistItems',
  components: {
    HeaderCell,
    DataCell,
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
</style>
