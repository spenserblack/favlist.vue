<template lang='pug'>
  button(@click='saveFavlists') Save as JSON
</template>

<script>
import {saveAs} from 'file-saver';

export default {
  name: 'Save',
  methods: {
    saveFavlists() {
      const blob = new Blob(
        [JSON.stringify(this.$store.state.favlists)],
        {type: 'text/json;charset=utf-8'},
      );
      saveAs(blob, 'favlist.json');
    },
  },
};
</script>
