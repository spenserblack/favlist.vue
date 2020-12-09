<template lang='pug'>
  button(@click='copyToClipboard' title='Save to clipboard')
    ClipboardSvg(:width='clipboardWidth' :height='clipboardHeight')
</template>

<script>
import ClipboardSvg from './svg/Clipboard.vue';
import {write as copy} from 'clipboardy';
import stringifyJson from 'core-js/stable/json/stringify';

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
        await copy(stringifyJson(this.$store.getters.forSave));
        alert('Favlists exported');
      } catch(e) {
        console.error("Couldn't copy to clipboard", e);
      }
    },
  },
};
</script>
