import WiseVue from "@shared/wise-vue";
import { Component, Prop, Provide, Watch } from "vue-property-decorator";
import template from "./single-date-range.vue";
import ElementSelect from "../element-select/element-select";
@Component({
    mixins: [template],
    name: 'single-date-range',
    components: {
        ElementSelect
    }
})

export default class SingleDateRange extends WiseVue {

    @Prop({ default: '' })
    label!: string;

    dateOne = '';
    mounted() {

    }

    dateOneSelect(val: any) {
      this.dateOne = val;
      if (val) {
        this.$emit("selectSingleDateRange", `${val}T00:00:00`);
      }
    }

    formatDates(date: string) {
      if (!date) return;
      return date;
    }

    clearDatepicker() {
      this.dateOne = '';
      this.$emit("selectSingleDateRange", null);
    }
}



