// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import app from './app.vue';
import router from './router/router';
import VeeValidate from "vee-validate";
import RxEvent from './directives/rx-event';
import { Message } from 'element-ui';
import FixedHead from './directives/fixed-head';
import AirbnbStyleDatepicker from 'vue-airbnb-style-datepicker';
import 'vue-airbnb-style-datepicker/dist/vue-airbnb-style-datepicker.min.css';
const datepickerOptions = {
  colors: {
    selected: '#d8d8d8',
    inRange: '#f3f3f3',
    selectedText: '#000',
    text: '#000',
    inRangeBorder: '#f3f3f3',
    disabled: '#fff',
  }
};
Vue.use(VeeValidate);
Vue.use(RxEvent);
Vue.use(FixedHead);
Vue.use(AirbnbStyleDatepicker, datepickerOptions);
Vue.config.productionTip = false;


/* eslint-disable no-new */
let v = new Vue({
  el: '#app',
  router,
  components: { app },
  template: '<app/>'
});

