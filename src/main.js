import { createApp } from "vue";
import App from "./App.vue";
import vuetify from "./plugins/vuetify";
import router from "./router";
import { createPinia } from "pinia";

const app = createApp(App);

app.use(createPinia()); // 👈 Ajoute ça avant le mount
app.use(vuetify).use(router).mount("#app");
