
import WiseVue from "@shared/wise-vue";
import { Component, Prop, } from "vue-property-decorator";
import template from "./loding-node.vue";
@Component({
    mixins: [template],
    name: 'loding-node',

})

export default class LodingNode extends WiseVue {

    @Prop({ default: false })
    isLoading!: boolean;
}



