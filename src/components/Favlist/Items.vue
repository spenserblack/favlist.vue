<template lang='pug'>
  table.items
    thead
      tr
        th.invisible-column
        th.button-container(v-for='(header, columnIndex) in columns')
          button.remove-column(@click='removeColumn(columnIndex)')
            | - Remove Column
        th.button-container
          button.add-column(@click='addColumn') + Add Column
      tr
        th.invisible-column
        HeaderCell(
          v-for='(header, columnIndex) in columns'
          :favlist='index'
          :column='columnIndex'
          :key='header.key'
        )
        th.filter
          span
            input.filter(
              type='text'
              :id='filterId'
              placeholder='filter...'
              v-model='filter'
            )
    tbody
      tr(v-for='rowIndex in dataHeight' v-show='isRowShown(rowIndex - 1)')
        td.invisible-column
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
        td.invisible-column
        td.button-container(:colspan='dataWidth')
          button.add-row(@click='addRow') + Add Row
        td
</template>

<script>
import DataCell from './Items/DataCell.vue';
import HeaderCell from './Items/HeaderCell.vue';

export default {
  name: 'FavlistItems',
  data() {
    return { filter: '' };
  },
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
    filterId() {
      return `favlist-filter-${this.index}`;
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
    isRowShown(rowNumber) {
      return !this.filter || this.data.some(column => {
        const cell = column[rowNumber];
        const {datum} = cell || {};
        return datum != null && String(datum).includes(this.filter);
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

button.add-row
  width: 100%

th.filter
  background-color: secondaryColor

  input
    background-color: secondaryColor
    color: textColor
    border: none
    text-align: center

    &::placeholder
      color: blend(rgba(textColor, 0.5), secondaryColor)


.invisible-column
  opacity: 0
</style>
