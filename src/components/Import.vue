<template lang='pug'>
  button(@click='importFavlist' title='Import from JSON')
    Icon: JsonIcon
    Icon: PasteIcon
</template>

<script>
import { Json as JsonIcon, Paste as PasteIcon } from '@v2icons/carbon';
import Icon from './Icon.vue';

export default {
  name: 'Import',
  components: { JsonIcon, PasteIcon, Icon },
  methods: {
    importFavlist() {
      const favlistJson = JSON.parse(prompt('Please enter JSON'));
      if (confirm('This will overwrite all current data! Continue?')) {
        this.$store.commit('loadFromJson', favlistJson);
      }
    },
  },
};
</script>
