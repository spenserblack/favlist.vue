<template lang='pug'>
  .favlist(:id='favlistId')
    .header
      .left-spacer
      Title.title(v-if='!isRoute' :index='index')
      .right-spacer
    Items(:index='index' :favlistId='favlistId' @delete='removeSelf')
</template>

<script>
import Items from './Favlist/Items.vue';
import Title from './Favlist/Title.vue';
import {v4 as uuidv4} from 'uuid';

export default {
  name: 'Favlist',
  props: {
    index: {
      required: true,
      type: Number,
    },
    isRoute: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return { favlistId: `favlist-${uuidv4()}` };
  },
  components: {
    Title,
    Items,
  },
  computed: {
    title() {
      return this.$store.getters.title(this.index);
    },
  },
  methods: {
    onHeaderUpdate(newHeader, index) {
      this.$emit('update-column', newHeader, index);
    },
    removeSelf() {
      if (confirm(`Delete ${this.title || 'this list'} and all of its data?`)) {
        this.$router.replace({name: 'home'});
        this.$store.commit('removeFavlist', this.index);
      }
    },
  },
  beforeRouteUpdate(to, from, next) {
    if (to.params.index >= (this.$store.state.favlists || []).length) {
      this.$emit('invalid-route', 'Tried to access non-existent list');
      next({name: 'home'});
      return;
    }
    next();
  },
};
</script>

<style lang='stylus' scoped>
.favlist
  .header
    display: flex
    flex-direction: row
    justify-content: center
    align-items: center

    .left-spacer, .right-spacer
      width: 10%
</style>
