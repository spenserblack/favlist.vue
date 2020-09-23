<template lang='pug'>
  table.items
    thead
      tr
        HeaderCell(
          v-for='(header, columnIndex) in columns'
          :favlist='index'
          :column='columnIndex'
          :key='columnIndex'
        )
    tbody
      tr(v-for='rowIndex in dataHeight')
        DataCell(
          v-for='cellIndex in dataWidth'
          :favlist='index'
          :column='cellIndex - 1'
          :cell='rowIndex - 1'
          :key='`${rowIndex}.${cellIndex}`'
        )
</template>

<script>
import DataCell from './Items/DataCell.vue';
import HeaderCell from './Items/HeaderCell.vue';

export default {
  name: 'FavlistItems',
  components: {
    HeaderCell,
    DataCell,
  },
  props: {
    index: {
      type: Number,
      required: true,
    },
  },
  computed: {
    columns() {
      return this.$store.getters.headers(this.index);
    },
    data() {
      return this.$store.getters.data(this.index);
    },
    dataHeight() {
      return this.data.reduce((max, row) => {
        const height = row.length;
        return height > max ? height : max;
      }, 0);
    },
    dataWidth() {
      return this.data.length;
    },
  },
};
</script>

<style lang='stylus' scoped>
.items
  margin: auto
</style>
