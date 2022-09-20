import { createApp } from "vue";
import { Quasar } from "quasar";

import "@quasar/extras/material-symbols-outlined/material-symbols-outlined.css";
import iconSet from "quasar/icon-set/material-symbols-outlined";
import "quasar/src/css/index.sass";

import App from "./App.vue";
import router from "./router";

const app = createApp(App);

app.use(Quasar, {
  plugins: {},
  iconSet,
});
app.use(router);

app.mount("#app");
