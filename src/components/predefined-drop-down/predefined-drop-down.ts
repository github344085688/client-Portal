
import WiseVue from "@shared/wise-vue";
import { Component, Prop } from "vue-property-decorator";
import template from ".predefined-drop-down.vue";
@Component({
    mixins: [template],
    name: 'predefined-drop-down',

})

export default class PredefinedDialogs extends WiseVue {



    @Prop({ default: {} })
    setStyle!: any;

    @Prop({
        default: () => {
            return [];
        }
    })
    datas!: Array<any>;

    show: boolean = false;
    selectedName: string = "Select";
    onClickSelect() {
        this.show = !this.show;
    }

    onSelectData(data: string) {
        this.selectedName = data;
        this.show = false;
        this.emitSelected();
    }
    private emitSelected() {
        this.$emit("dataChange", this.selectedName);
    }

}



