<template lang='pug'>
  h2.title(contenteditable @input='onInput') {{ title }}
</template>

<script>
export default {
  name: 'FavlistTitle',
  props: {
    title: {
      type: String,
      required: true,
    },
  },
  methods: {
    onInput(e) {
      this.$emit('update', e.target.innerText);
    },
  },
};
</script>
