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
        td
          button.remove-row(@click='removeRow(rowIndex - 1)') - Remove Row
    tfoot
      tr
        td(:colspan='dataWidth')
          button.add-row(@click='addRow') + Add Row
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
      return this.$store.getters.height(this.index);
    },
    dataWidth() {
      return this.$store.getters.width(this.index);
    },
  },
  methods: {
    addRow() {
      this.$store.commit('addRow', this.index);
    },
    removeRow(index) {
      this.$store.commit({
        type: 'removeRow',
        favlistIndex: this.index,
        row: index,
      });
    },
  },
};
</script>

<style lang='stylus' scoped>
.items
  margin: auto
</style>
