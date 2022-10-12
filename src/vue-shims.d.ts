declare module "*.vue" {
    import Vue from "vue";
    export default Vue;
}

declare module 'vue2-datepicker' {
    const datepicker: any;
    export default datepicker;
}

declare module 'vue-airbnb-style-datepicker' {
    const AirbnbStyleDatepicker: any;
    export default AirbnbStyleDatepicker;
}

declare module 'v-tooltip' {
    const vtooltip: any;
    export default vtooltip;
}

declare module 'vue-grid-layout' {
    const vueGridLayout: any;
    export default vueGridLayout;
}

declare module 'vue-right-menu' {
    const vueRightMenu: any;
    export default vueRightMenu;
}

declare module 'vuedraggable' {
    const vueRightMenu: any;
    export default vuedraggable;
}

declare module 'element-ui/*'
declare module 'ele-calendar'
declare module 'echarts'

declare const API_CONTEXT_PATH: string;
declare const STATIC_CONTENT_CONTEXT_PATH: string;
declare const TMS_DOMAIN: string;
declare const REPORT_CENTER_PATH: string;
declare const DEPOSIT_API_BASE_URL: string;
declare const MESSAGE_URL: string;
declare const TMS_MESSAGE_URL: string;
declare const isPermissionDisabled: boolean;
declare const ssoRedirectLink: string;
declare const enableSaasMode: boolean;
