declare module "*.vue" {
    import Vue from "vue";
    export default Vue;
}

declare module 'vuejs-datepicker' {
    const datepicker: any;
    export default datepicker;
}

declare module 'vue-airbnb-style-datepicker' {
    const AirbnbStyleDatepicker: any;
    export default AirbnbStyleDatepicker;
}

declare const API_CONTEXT_PATH: string;
declare const STATIC_CONTENT_CONTEXT_PATH: string;
declare const TMS_DOMAIN: string;