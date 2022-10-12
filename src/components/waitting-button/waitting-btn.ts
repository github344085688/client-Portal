
import WiseVue from "@shared/wise-vue";
import { Component, Prop, Provide, Watch } from "vue-property-decorator";
import template from "./waitting-btn.vue";
@Component({
    mixins: [template],
    name: 'waitting-btn',

})

export default class WaitingBtn extends WiseVue {

    @Prop({ default: "" })
    value!: string;

    @Prop({ default: "botton" })
    btnType!: string;

    @Prop({ default: "" })
    btnClass!: string;

    @Prop({ default: "" })
    iconClass!: string;

    @Prop({ default: false })
    isLoading!: boolean;

    @Prop({ default: false })
    disabled!: boolean;

    @Watch("isLoading")
    loadingStatuUpdate() {
        // this.disabled = this.isLoading;
    }

    clickBtn() {
        this.$emit('click');
    }
    mounted() {

    }



}



