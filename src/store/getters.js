export default {
  forUser: (state) => state,
  favlist: (state) => (index) => {
    return state.favlists[index];
  },
  title: (state, getters) => (favlistIndex) => {
    return getters.favlist(favlistIndex).title;
  },
  headers: (state, getters) => (favlistIndex) => {
    return getters.favlist(favlistIndex).columns;
  },
  header: (state, getters) => (favlistIndex, column) => {
    return getters.headers(favlistIndex)[column].datum;
  },
  data: (state, getters) => (favlistIndex) => {
    return getters.favlist(favlistIndex).data;
  },
  column: (state, getters) => (favlistIndex, column) => {
    return getters.data(favlistIndex)[column];
  },
  cell: (state, getters) => (favlistIndex, column, cell) => {
    return getters.column(favlistIndex, column)[cell];
  },
  datum: (state, getters) => (favlistIndex, column, cell) => {
    return getters.cell(favlistIndex, column, cell).datum;
  },
  datumKey: (state, getters) => (favlistIndex, column, cell) => {
    return getters.cell(favlistIndex, column, cell).key;
  },
  height: (state, getters) => (favlistIndex) => {
    return getters.data(favlistIndex).reduce((max, column) => {
      const height = column.length;
      return height > max ? height : max;
    }, 0);
  },
  width: (state, getters) => (favlistIndex) => {
    return getters.data(favlistIndex).length;
  },
};
