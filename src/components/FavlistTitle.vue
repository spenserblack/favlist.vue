<template lang='pug'>
  h2.title(contenteditable) {{ title }}
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
};
</script>
