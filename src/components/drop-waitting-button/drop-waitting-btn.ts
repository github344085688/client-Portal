import WiseVue from "../../shared/wise-vue";
import { Component, Prop, Provide, Watch } from "vue-property-decorator";
import template from "./drop-waitting-btn.vue";
@Component({
    mixins: [template],
    name: 'drop-waitting-btn',

})

export default class DropWaittingBtn extends WiseVue {

    @Prop({ default: "" })
    value!: string;

    @Prop({
        type: Array,
        default: () => []
    })
    selectList!: Array<any>;

    @Prop({ default: false })
    isexport!: boolean;

    @Prop({ default: false })
    isLoading!: boolean;

    disabled: any = false;
    selectValue: any = null;
    @Watch("isLoading")
    loadingStatuUpdate() {
        this.disabled = this.isLoading;
    }

    clickBtn(selectItem: string) {
        this.$emit('click', selectItem);
        this.selectValue = selectItem;
    }
    mounted() {

    }



}



