import WiseVue from "@shared/wise-vue";
import { Component, Prop } from "vue-property-decorator";
import template from "./track-process-bar.vue";


@Component({
    mixins: [template],
    name: 'track-process-bar',
})
export default class TrackProcessBar extends WiseVue {

    @Prop({ default: "" })
    originDate!: string;

    @Prop({ default: "" })
    originLocation!: string;

    @Prop({ default: "" })
    destinationDate!: string;

    @Prop({ default: "" })
    destinationLocation!: string;

    @Prop({ default: 1 })
    stage!: number;

}