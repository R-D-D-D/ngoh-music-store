import Vue from "vue";
import Vuetify from "vuetify/lib";
import WhatsappIcon from "@/components/WhatsappIcon"

Vue.use(Vuetify);

export default new Vuetify({
  icons: {
    values: {
      whatsapp: {
        component: WhatsappIcon
      },
    },
  }
});
