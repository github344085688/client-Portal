import WiseVue from "@shared/wise-vue";
import { Component, Prop, Provide } from "vue-property-decorator";
import tlp from "./switch-button.vue";
@Component({
  mixins: [tlp]
})
export default class SwitchButton extends WiseVue {

  @Prop({ default: false })
  value !: boolean;

  @Prop({
    default: false
  })
  disabled!: boolean;

  @Prop({ default: '' })
  name !: string;

  mounted() {

  }

  onClickBottom() {
    if (!this.disabled) {
      this.$emit('input', !this.value);
      this.$emit('change');
    }
  }

}
