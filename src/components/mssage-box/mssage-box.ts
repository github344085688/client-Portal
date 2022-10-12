/**
 * Created by f on 2018/5/22.
 */
import { Component, Prop } from "vue-property-decorator";
import WiseVue from "@shared/wise-vue";
import template from './mssage-box.vue';
@Component({
  mixins: [template],
  name: 'popupForDetermine',
  components: {}
})
export default class MssageBox extends WiseVue {
  @Prop({ default: false })
  show!: boolean;

  options: any = {};

  successBtn(event: any) {
    this.show = false;
    let node = document.querySelector('.autu-pop-up-win');
    if (node && node.parentNode) {
      node.parentNode.removeChild(node);
    }
  }

  cancelBtn(event: any): void {
    this.show = false;
    let node = document.querySelector('.autu-pop-up-win');
    if (node && node.parentNode) {
      node.parentNode.removeChild(node);
    }
  }
}




