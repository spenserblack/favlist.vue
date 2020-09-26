<template lang='pug'>
  button(@click='importFavlist') Import from JSON
</template>

<script>
export default {
  name: 'Import',
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
