
import WiseVue from "../../shared/wise-vue";
import { Component, Prop, Provide, Watch } from "vue-property-decorator";
import template from "./radio-btn.vue";
@Component({
    mixins: [template],
    name: 'radio-btn',

})

export default class RadioBtn extends WiseVue {

    @Prop({ default: "" })
    label!: string;

    @Prop({ default: "el-icon-arrow-down" })
    iconClass!: string;

    @Prop({ default: false })
    value!: boolean;

    innerValue: boolean = false;

    clickBtn() {
        this.$emit('update:selectData', !this.innerValue);
    }
    mounted() {
        this.innerValue = this.value;
    }

}



