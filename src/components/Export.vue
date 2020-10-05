<template lang='pug'>
  button(@click='copyToClipboard' title='Save to clipboard')
    ClipboardSvg(:width='clipboardWidth' :height='clipboardHeight')
</template>

<script>
import ClipboardSvg from './svg/Clipboard.vue';
import {write as copy} from 'clipboardy';

const clipboardWidth = 36;
const clipboardHeight = 36;

export default {
  name: 'Export',
  components: {
    ClipboardSvg,
  },
  data() {
    return {
      clipboardWidth,
      clipboardHeight,
    };
  },
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
