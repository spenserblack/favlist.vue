<template lang='pug'>
  button(@click='importFavlist' title='Import from JSON')
    ImportSvg(:width='importJsonWidth' :height='importJsonHeight')
</template>

<script>
import ImportSvg from './svg/JsonImport.vue';

const importJsonWidth = 36;
const importJsonHeight = 36;

export default {
  name: 'Import',
  components: {
    ImportSvg,
  },
  data() {
    return {
      importJsonWidth,
      importJsonHeight,
    };
  },
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
