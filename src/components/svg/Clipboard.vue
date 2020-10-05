<template lang='pug'>
  BaseSvg(:width='width' :height='height' name='clipboard')
    path(:d='board')
    path(:d='clip')
    path(v-for='detail in details' :d='detail')
</template>

<script>
import BaseSvg from './Base.vue';

export default {
  name: 'Clipboard',
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
  },
  data() {
    const board = 'M 4 4 H 14 V 16 H 4 Z';
    const clip = 'M 7 4 V 2 H 11 V 4';
    const details = Array(3);
    for (let i = 0; i < details.length; ++i) {
      details[i] = `M 6 ${7 + i * 3} H 12`;
    }
    return {
      board,
      clip,
      details,
    };
  },
};
</script>
