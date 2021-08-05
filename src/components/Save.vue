<template lang='pug'>
  button(@click='saveFavlists' title='Save as JSON')
    Icon: JsonIcon
    Icon: DownloadIcon
</template>

<script>
import {
  DocumentDownload as DownloadIcon,
  Json as JsonIcon,
} from '@v2icons/carbon';
import Icon from './Icon.vue';
import {saveAs} from 'file-saver';
import stringifyJson from 'core-js/stable/json/stringify';

export default {
  name: 'Save',
  components: { DownloadIcon, JsonIcon, Icon },
  methods: {
    saveFavlists() {
      const blob = new Blob(
        [stringifyJson(this.$store.getters.forSave)],
        {type: 'text/json;charset=utf-8'},
      );
      saveAs(blob, 'favlist.json');
    },
  },
};
</script>
