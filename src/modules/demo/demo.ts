import Vue from "vue";
import { Component, Prop, Provide, Watch } from "vue-property-decorator";
import StageHeader  from "../../components/stage-header/stage-header";
import MainButtonSet  from "../../components/button-set/button-set";

import template from "./demo.vue";

@Component({
    mixins: [template],
    components: {
        StageHeader,
        MainButtonSet
    }

})
export default class Demo extends Vue {
}
