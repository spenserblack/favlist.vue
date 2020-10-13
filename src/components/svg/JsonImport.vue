<template lang='pug'>
  BaseSvg(:width='width' :height='height' :name='name')
    text(x='0' y='13') {}
    path(d='M 10.5 15 C 12 15, 13 14, 13 12 V 5 M 10 8 L 13 5 L 16 8')
</template>

<script>
import BaseSvg from './Base.vue';

export default {
  name: 'JsonImport',
  components: {
    BaseSvg,
  },
  props: {
    width: {
      type: Number,
      required: true,
    },
    height: {
      type: Number,
      required: true,
    },
    name: {
      type: String,
      default: 'import JSON',
    },
  },
};
</script>
