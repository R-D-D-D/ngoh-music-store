import Vue from "vue";
import Vuetify from "vuetify/lib";
import WhatsappIcon from "@/components/WhatsappIcon"
import CarousellIcon from "@/components/CarousellIcon"

Vue.use(Vuetify);

export default new Vuetify({
  icons: {
    values: {
      whatsapp: {
        component: WhatsappIcon
      },
      carousell: {
        component: CarousellIcon
      },
    },
  }
});
