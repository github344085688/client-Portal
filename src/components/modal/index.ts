import Vue from "vue";

import { Component, Prop, Provide, Watch } from "vue-property-decorator";
import template from "./modal.vue";


@Component({
  mixins: [template],
  components: {

  },

})
export default class DefaultModal extends Vue {

  @Prop({ default: "" })
  modalName!: string;

  @Prop({ default: "" })
  title!: string;

  @Prop({ default: "" })
  message!: string;

  @Prop({ default: "Yes" })
  rightBtnText!: string;

  @Prop({ default: "No" })
  leftBtnText!: string;

  closeModal() {
    this.$modal.hide(this.modalName);
  }

  rightBtnAction() {
    this.$emit("rightBtnAction");
  }

  leftBtnAction() {
    this.$emit("leftBtnAction");
  }

  @Prop({ default: "500px" })
  height!: string | number;

  @Prop({ default: "70%" })
  width!: string | number;

  @Prop({ default: 460 })
  maxWidth!: number;

  @Prop({ default: 500 })
  maxHeight!: number;

  @Prop({ default: 0.3 })
  yPosition!: number;

  @Prop({ default: 0.5 })
  xPosition!: number;

  @Prop()
  rightBtnStyle: any;

  @Prop()
  leftBtnStyle: any;

  @Prop({ default: false })
  clickToClose!: boolean;

  @Prop({ default: false })
  noButtons!: boolean;

  @Prop({ default: true })
  closeButton!: boolean;


}