<template lang='pug'>
  button.flipped(@click='saveFavlists' title='Save as JSON')
    JsonSaveSvg(
      :width='saveJsonWidth'
      :height='saveJsonHeight'
      name='save JSON'
    )
</template>

<script>
import JsonSaveSvg from './svg/JsonImport.vue';
import {saveAs} from 'file-saver';
import stringifyJson from 'core-js/stable/json/stringify';

const saveJsonWidth = 36;
const saveJsonHeight = 36;

export default {
  name: 'Save',
  components: {
    JsonSaveSvg,
  },
  data() {
    return {
      saveJsonWidth,
      saveJsonHeight,
    };
  },
  methods: {
    saveFavlists() {
      const blob = new Blob(
        [stringifyJson(this.$store.state.favlists)],
        {type: 'text/json;charset=utf-8'},
      );
      saveAs(blob, 'favlist.json');
    },
  },
};
</script>

<style lang='stylus' scoped>
.flipped
  transform: scaleY(-1)
</style>
