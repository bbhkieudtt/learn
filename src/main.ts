import { waterfall } from "async";
import { createApp } from "vue";
import App from "@/App.vue";
import {
  loadEnv,
  loadLib,
  loadApp,
  loadLanguage,
  loadRouter,
} from "@/service/core";
import "@/assets/css/tailwind.css";
import { DotLottieVue } from "@lottiefiles/dotlottie-vue";
import type { CbError } from "@/service/interface";
import StarRatings from '@hbilal_9/vue3-star-ratings'
  import '@hbilal_9/vue3-star-ratings/dist/style.css'
  
// * Import css
import "./style.css";
const APP = createApp(App);
APP.component("dotlottie-vue", DotLottieVue);
APP.use(StarRatings)
waterfall(
  [
    (cb: CbError) => loadEnv(cb),
    (cb: CbError) => loadLib(cb),
    (cb: CbError) => loadRouter(APP, cb),
    (cb: CbError) => loadLanguage(APP, cb),
    (cb: CbError) => loadApp(APP, cb),
  ],
  () => APP.mount("#app")
);
