import WiseVue from "@shared/wise-vue";
import { Component, Prop, Provide, Watch } from "vue-property-decorator";
import template from "./step-counter.vue";
@Component({
    mixins: [template],
    name: 'step-counter',
})

export default class StepCounter extends WiseVue {

    @Prop({ default: 1 })
    ovalNum!: number;

    isActive: boolean = false;
    isSmaller: boolean = false;

    changeColor () {
        this.isActive = !this.isActive;
    }
    changeSize () {
        this.isSmaller = !this.isSmaller;
    }
}