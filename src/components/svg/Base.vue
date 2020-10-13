<template lang='pug'>
  svg(
    xmlns='http://www.w3.org/2000/svg'
    :width='width'
    :height='height'
    viewBox='0 0 18 18'
    :aria-labelledby='name'
    role='presentation'
    stroke-linejoin='round'
  )
    slot
</template>

<script>
export default {
  name: 'Base',
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
      required: true,
    },
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
