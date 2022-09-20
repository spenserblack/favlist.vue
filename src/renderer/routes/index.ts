import Home from "../views/Home.vue";
import Favlist from "../views/Favlist.vue";

export default [
  {
    path: "/",
    name: "home",
    component: Home,
  },
  {
    path: "/favlist/:id",
    name: "favlist",
    component: Favlist,
  },
];
