<template lang='pug'>
  table.items
    thead
      tr
        HeaderCell(
          v-for='(header, columnIndex) in columns'
          :favlist='index'
          :column='columnIndex'
        )
    // tbody
    //   tr(v-for='(row, index) in transposedData')
    //     DataCell(v-for='datum in row' :datum='datum || ""')
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
    index: {
      type: Number,
      required: true,
    },
  },
  computed: {
    columns() {
      return this.$store.state.favlists[this.index].columns;
    },
    // transposedData() {
    //   const transposed = [];
    //   for (let i = 0; i < this.data.length; ++i) {
    //     const column = this.data[i];
    //     for (let j = 0; j < column.length; ++j) {
    //       if (transposed[j] == null) {
    //         transposed[j] = [];
    //         transposed[j].length = this.data.length;
    //       }
    //       transposed[j][i] = this.data[i][j];
    //     }
    //   }
    //   return transposed;
    // },
  },
};
</script>

<style lang='stylus' scoped>
.items
  margin: auto
</style>
