
import WiseVue from "@shared/wise-vue";
import { Component, Prop } from "vue-property-decorator";
import template from "./predefined-dialogs.vue";
@Component({
    mixins: [template],
    name: 'predefined-dialogs',

})

export default class PredefinedDialogs extends WiseVue {

    @Prop({ default: false })
    isLoading!: boolean;

    @Prop({ default: {} })
    setStyle!: any;

    @Prop({ default: '' })
    title!: string;
}



