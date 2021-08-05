<template lang='pug'>
  button(@click='copyToClipboard' title='Save to clipboard')
    Icon: JsonIcon
    Icon: CopyIcon
</template>

<script>
import { Copy as CopyIcon, Json as JsonIcon } from '@v2icons/carbon';
import Icon from './Icon.vue';
import {write as copy} from 'clipboardy';
import stringifyJson from 'core-js/stable/json/stringify';

export default {
  name: 'Export',
  components: { CopyIcon, JsonIcon, Icon },
  methods: {
    async copyToClipboard() {
      try {
        await copy(stringifyJson(this.$store.getters.forSave));
        this.$emit('copied');
      } catch(e) {
        console.error("Couldn't copy to clipboard", e);
      }
    },
  },
};
</script>
