<template lang='pug'>
  transition(name='alert')
    .favlist-alert(v-bind:class='className')
      span {{ message }}
      button.close(v-on:click='$emit("close")') OK
</template>

<script>
export default {
  name: 'Alert',
  props: {
    type: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
  },
  computed: {
    className() {
      return `favlist-alert-${this.type}`;
    },
  },
};
</script>

<style lang='stylus' scoped>
.favlist-alert
  padding = 0.5em

  border-radius: 5px
  padding-bottom: padding
  padding-top: padding
  width: 100%

  .close
    background: None
    border: None
    cursor: Pointer
    float: Right
    height: 100%

.favlist-alert-info
  textColor = SteelBlue

  background-color: AliceBlue
  color: textColor

  .close
    color: textColor

  .close:hover
    color: CadetBlue

.alert-enter-active, .alert-leave-active
  transition: opacity .5s

.alert-enter, .alert-leave-to
  opacity: 0
</style>
