import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store/store";
import vuetify from "./plugins/vuetify";
import Panel from "@/components/Globals/Panel"

Vue.config.productionTip = false;
Vue.component('panel', Panel)
Vue.prototype.window = window

import '@fortawesome/fontawesome-free/css/all.css'
import '@fortawesome/fontawesome-free/js/all.js'

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount("#app");
