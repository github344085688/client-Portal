import WiseVue from "../../shared/wise-vue";
import { Component } from "vue-property-decorator";
import template from "./welcome.vue";



@Component({
    mixins: [template]
})
export default class Welcome extends WiseVue {
}