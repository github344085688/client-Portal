/**
 * Created by f on 2018/5/22.
 */
import { Component, Prop, Watch } from "vue-property-decorator";
import WiseVue from "@shared/wise-vue";
import template from './pop-up-windows.vue';
import WaittingBtn from "../waitting-button/waitting-btn";
@Component({
  mixins: [template],
  name: 'PopUpWindows',
  components: {WaittingBtn},
})
export default class PopUpWindows extends WiseVue {
  @Prop({ default: true })
  show!: boolean;

  @Prop({ default: 200 })
  height!: Number;

  @Prop({ default: 70 })
  width!: Number;

  @Prop({ default: '' })
  tlitle!: String;

  @Prop({ default: true })
  isSubmit!: boolean;

  options: any = {};

  @Watch("show")
  getIsShow() {

  }

  cancel(event: any): void {
    this.$emit('cancel');
  }

  mounted() {

  }
}




