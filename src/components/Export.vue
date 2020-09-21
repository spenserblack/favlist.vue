<template lang='pug'>
  button(@click='copyToClipboard') Export to clipboard as JSON
</template>

<script>
import {write as copy} from 'clipboardy';

export default {
  name: 'Export',
  methods: {
    async copyToClipboard() {
      try {
        await copy(JSON.stringify(this.$store.state.favlists));
        alert('Favlists exported');
      } catch(e) {
        console.error("Couldn't copy to clipboard", e);
      }
    },
  },
};
</script>
