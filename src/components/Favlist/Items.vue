<template lang='pug'>
  .items
    table.head(:class='{sticky: stickies}')
      thead
        tr
          th.invisible-column
          th(:colspan='dataWidth').button-container
            button(@click='$emit("delete")').delete-button
              | - Remove {{ $store.getters.title(index) }}
          th.button-container
        tr
          th.invisible-column
          th.button-container(v-for='(header, columnIndex) in columns')
            button.move-left(
              @click='moveColumnLeft(columnIndex)'
              title='move column left'
            ) ◄
            button.remove-column(@click='removeColumn(columnIndex)')
              | - Remove Column
            button.move-right(
              @click='moveColumnRight(columnIndex)'
              title='move column right'
            ) ►
          th.button-container.meta-column
            button.add-column(@click='addColumn') + Add Column
        tr
          th.invisible-column
          HeaderCell(
            v-for='(header, columnIndex) in columns'
            :favlist='index'
            :column='columnIndex'
            :key='header.key'
          )
          th.filter.meta-column
            span
              input.filter(
                type='text'
                :id='filterId'
                placeholder='filter...'
                v-model='filter'
              )
    table.body
      tbody
        tr(v-for='rowIndex in dataHeight' v-show='isRowShown(rowIndex - 1)')
          td.invisible-column
          DataCell.normalized-width(
            v-for='cellIndex in dataWidth'
            :favlist='index'
            :column='cellIndex - 1'
            :cell='rowIndex - 1'
            :key='$store.getters.datumKey(index, cellIndex - 1, rowIndex - 1)'
          )
          td.button-container.meta-column
            button.remove-row(@click='removeRow(rowIndex - 1)') - Remove Row
    table.foot(:class='{sticky: stickies}')
      tfoot
        tr
          td.invisible-column
          td.button-container(:colspan='dataWidth')
            button.add-row(@click='addRow') + Add Row
          td.button-container.meta-column
            button
              a(:href='topOfListHref') Top of {{ $store.getters.title(index) }}
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
    favlistId: {
      type: String,
      required: true,
    },
    stickies: {
      type: Boolean,
      default: false,
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
    topOfListHref() {
      return `#${this.favlistId}`;
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
    moveColumnLeft(column) {
      this.$store.commit({
        type: 'moveColumnLeft',
        favlistIndex: this.index,
        column,
      });
    },
    moveColumnRight(column) {
      this.$store.commit({
        type: 'moveColumnRight',
        favlistIndex: this.index,
        column,
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

metaWidth = 20%

.items
.head
.body
.foot
  margin: auto

.sticky
  position: sticky
  z-index: 1

.head.sticky
  top: 0
  background-color: backgroundColor

.foot.sticky
  bottom: 0

table
  border-collapse: collapse
  width: 100% - metaWidth

.button-container
  background-color: secondaryColor

  button
    a
      color: textColor

      &:hover
        color: lighten(textColor, 25%)

button.add-row
.delete-button
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
  background-color: whitesmoke
  width: metaWidth

.meta-column
  width: metaWidth

.normalized-width
  max-width: 0

.move-left
.move-right
  // font-size: 2em
</style>
