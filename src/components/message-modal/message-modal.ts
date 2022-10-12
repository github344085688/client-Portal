import Vue from "vue";
import { Component, Prop, Provide, Watch } from "vue-property-decorator";
import template from "./message-modal.vue";

import * as $ from "jquery";

@Component({
  mixins: [template]
})
export default class MessageModel extends Vue {

  @Prop()
  modalName!: string;

  @Prop()
  title!: string;

  @Prop()
  message!: string;

  @Prop({ default: "#15223d" })
  titleColor!: string;
    @Prop({ default: "auto" })
    height!: string | number;

    @Prop({ default: 400 })
    width!: string | number;

    @Prop({ default: 600 })
    maxWidth!: number;

    @Prop({ default: 500 })
    maxHeight!: number;



  @Prop({ default: 0.35 })
  yPosition!: string | number;

  @Prop({ default: false })
  clickToClose!: boolean;

  @Prop({default: false})
  reset!: boolean;

  @Prop({default: false})
  backToHome!: boolean;

  @Prop({ default: 2000 })
  waitMillsSecondsToClose!: number;

  closeAction() {
    this.$emit("closeAction");
  }

  @Prop({ default: "Close" })
  btnText!: string;

  @Provide()
  showCloseBtn: boolean = false;

  async closeModelAfterSecond() {
    if (this.waitMillsSecondsToClose === 0) { this.showCloseBtn = true; return; }
    await this.waitSeconds(this.waitMillsSecondsToClose);
    this.$modal.hide(this.modalName);
  }

  closeModel() {
    this.$modal.hide(this.modalName);
    if (this.backToHome) {
        window.location.href = "index.html#/home";
    }
  }

  waitSeconds(time: number) {
    return new Promise(function (resolve, reject) {
      setTimeout(function () {
        resolve();
      }, time);
    });
  }
}