// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import app from './app.vue';
import router from './router/router';
import VeeValidate from "vee-validate";
import RxEvent from './directives/rx-event';
import { Loading , Tooltip, Dropdown, DropdownMenu, DropdownItem, Dialog, MessageBox, Message } from "element-ui";
import VModal from "vue-js-modal";
import vtooltip from 'v-tooltip';
import FixedHead from './directives/fixed-head';
import PermissionCheck from './directives/permission-check';
import InputAutoFill from './directives/input-auto-fill';
import AirbnbStyleDatepicker from 'vue-airbnb-style-datepicker';
import 'vue-airbnb-style-datepicker/dist/vue-airbnb-style-datepicker.min.css';
import PluginHead from './plugins/popups';
import store from './store/store';
import rightMenu from 'vue-right-menu';
import lang from 'element-ui/lib/locale/lang/en';
import locale from 'element-ui/lib/locale';
import '../src/directives/directives';
import * as _ from 'lodash';

const datepickerOptions = {
    colors: {
        selected: '#d8d8d8',
        inRange: '#f3f3f3',
        selectedText: '#000',
        text: '#000',
        inRangeBorder: '#f3f3f3',
        disabled: '#fff',
        hoveredInRange: '#f3f3f3'
    }
};
Vue.use(VeeValidate);
Vue.use(RxEvent);
Vue.use(FixedHead);
Vue.use(VModal);
Vue.use(vtooltip);
Vue.use(Loading);
Vue.use(PermissionCheck);
Vue.use(InputAutoFill);
Vue.use(Tooltip);
Vue.use(PluginHead);
Vue.use(AirbnbStyleDatepicker, datepickerOptions);
Vue.use(rightMenu);
Vue.use(Dropdown);
Vue.use(Dialog);
Vue.use(DropdownMenu);
Vue.use(DropdownItem);
locale.use(lang);
Vue.config.productionTip = false;
Vue.prototype.$message = Message;

Vue.filter('nullToString', function (value: any) {
    if (!value) return '';
});

Vue.filter('camelCase', function (value: string) {
    if (value) {
        return _.upperFirst(_.camelCase(value));
    }
});

/* eslint-disable no-new */
let v = new Vue({
    el: '#app',
    router,
    store,
    components: { app },
    template: '<app/>'
});
