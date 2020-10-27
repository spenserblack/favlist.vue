<template lang='pug'>
  transition(name='alert')
    p.alert(:class='level') #[slot]
</template>

<script>
const defaultAlertLevel = 'success';
const availableLevels = [defaultAlertLevel, 'warning'];

export default {
  name: 'Alert',
  props: {
    level: {
      type: String,
      default: defaultAlertLevel,
      validator: (value) => availableLevels.includes(value),
    },
  },
};
</script>

<style lang='stylus' scoped>
.alert
  position: relative

.alert-leave-active
  transition: all .75s ease

.alert-leave-to
  opacity: 0
  transform: translateY(-5em)
</style>
