<template lang='pug'>
  .favlist
    h2.title {{ title }}
</template>

<script>
export default {
  name: 'Favlist',
  props: {
    title: {
      type: String,
      required: true,
    }
  },
};
</script>
