<template lang='pug'>
  table.items
    thead
      tr
        th.button-container(v-for='(header, columnIndex) in columns')
          button.remove-column(@click='removeColumn(columnIndex)')
            | - Remove Column
        th.button-container
          button.add-column(@click='addColumn') + Add Column
      tr
        HeaderCell(
          v-for='(header, columnIndex) in columns'
          :favlist='index'
          :column='columnIndex'
          :key='header.key'
        )
    tbody
      tr(v-for='rowIndex in dataHeight')
        DataCell(
          v-for='cellIndex in dataWidth'
          :favlist='index'
          :column='cellIndex - 1'
          :cell='rowIndex - 1'
          :key='$store.getters.datumKey(index, cellIndex - 1, rowIndex - 1)'
        )
        td.button-container
          button.remove-row(@click='removeRow(rowIndex - 1)') - Remove Row
    tfoot
      tr
        td.button-container(:colspan='dataWidth')
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
    addColumn() {
      this.$store.commit('addColumn', this.index);
    },
    removeColumn(index) {
      this.$store.commit({
        type: 'removeColumn',
        favlistIndex: this.index,
        column: index,
      });
    },
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
@require '../../styles/variables.styl'

.items
  margin: auto

table
  border-collapse: collapse

.button-container
  background-color: secondaryColor
</style>
