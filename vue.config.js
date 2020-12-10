const path = require('path');
module.exports = {
  publicPath: process.env.NODE_ENV === 'production' ? '/favlist.vue/' : '/',
  css: {
    loaderOptions: {
      stylus: {
        import: [path.resolve(__dirname, 'src/styles/variables.styl')],
      },
    },
  },
};
