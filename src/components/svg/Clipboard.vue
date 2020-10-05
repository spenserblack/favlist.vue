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
    path(:d='path')
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
    const path = [
      'M 4 4 H 14 V 16 H 4 Z',
    ].join(' ');
    return {
      path,
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
