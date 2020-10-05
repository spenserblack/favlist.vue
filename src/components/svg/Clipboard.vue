<template lang='pug'>
  svg(
    xmlns='http://www.w3.org/2000/svg'
    :width='width'
    :height='height'
    viewBox='0 0 18 18'
    aria-labelledby='clipboard'
    role='presentation'
    stroke-linejoin='round'
  )
    path(:d='board')
    path(:d='clip')
</template>

<script>
export default {
  name: 'Clipboard',
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
    return {
      board,
      clip,
    };
  },
};
</script>

<style lang='stylus' scoped>
@require '../../styles/variables.styl'

svg
  fill: textColor

  path
    fill: none
    stroke: textColor
</style>
