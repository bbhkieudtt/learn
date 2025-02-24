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
import vue3StarRatings from "vue3-star-ratings";

  
// * Import css
import "./style.css";
const APP = createApp(App);
APP.component("dotlottie-vue", DotLottieVue);
APP.component("vue3-star-ratings", vue3StarRatings);
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
