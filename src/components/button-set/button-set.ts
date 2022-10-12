import Vue from "vue";
import { Component, Prop, Provide, Watch } from "vue-property-decorator";
import template from "./button-set.vue";


@Component({
    mixins: [template]
})
export default class MainButtonSet extends Vue {

    @Prop({ default: "Continue" })
    rightBtnText!: string;

    @Prop({ default: "Cancel" })
    leftBtnText!: string;

    @Prop({default: false})
    disabled!: boolean;
    // @Prop()
    // rightBtnAction: Function;

    // @Prop()
    // leftBtnAction: Function;

    rightBtnAction() {
        this.$emit("rightBtnAction");
    }

    leftBtnAction() {
        this.$emit("leftBtnAction");
    }


}