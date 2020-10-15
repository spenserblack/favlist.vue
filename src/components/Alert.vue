<template lang='pug'>
  transition(name='alert')
    p.alert #[slot]
</template>

<script>
export default {
  name: 'Alert',
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
