import Vue from "vue";

import { Component, Prop, Provide, Watch } from "vue-property-decorator";
import template from "./one-button-modal.vue";



@Component({
    mixins: [template],
})
export default class OneButtonModal extends Vue {
    @Prop()
    modalName!: string;

    @Prop({ default: "Title" })
    title!: string;

    @Prop({ default: "" })
    message!: string;

    @Prop({ default: "Close" })
    btnText!: string;

    @Prop({ default: true })
    showXBtn!: boolean;

    closeModal() {
        this.$modal.hide(this.modalName);
    }

    btnAction() {
        this.$emit("btnAction");
    }

    @Prop({ default: "auto" })
    height!: string | number;

    @Prop({ default: "80%" })
    width!: string | number;

    @Prop({ default: 600 })
    maxWidth!: number;

    @Prop({ default: 500 })
    maxHeight!: number;

    @Prop({ default: 0.3 })
    yPosition!: number;

    @Prop({ default: 0.5 })
    xPosition!: number;

    @Prop()
    btnStyle: any;

    @Prop({ default: false })
    clickToClose!: boolean;

}
