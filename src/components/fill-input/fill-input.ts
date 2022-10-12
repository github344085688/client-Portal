
import WiseVue from "@shared/wise-vue";
import { Component, Prop, Watch } from "vue-property-decorator";
import template from "./fill-input.vue";
import { forEach, trim, compact, flattenDeep } from "lodash-es";
@Component({
    mixins: [template],
    name: 'fill-input'
})

export default class FillInput extends WiseVue {

    @Prop({
        default: () => {
            return [];
        }
    })

    value!: any;
    @Prop({
        default: ''
    })

    fill!: string;
    @Prop({
        default: false
    })

    placeholder!: string;
    @Prop({
        default: ''
    })

    inputValue: any = '';

    @Watch("value")
    watchValue(val: any) {
        if (val) this.inputValue = val;
         else this.inputValue = '';
    }

    created() {

    }

    mounted() {
        this.inputValue = this.value;
    }

    handleBlur(el: any) {
        if (this.inputValue === this.fill) {
            this.inputValue = '';
            this.$emit('input', null);
            return;
        }
        if (this.inputValue.indexOf(this.fill) > -1) {
            this.$emit('input', this.inputValue);
        } else {
            let value = this.fill + this.inputValue;
            this.$emit('input', value);
        }
    }
}



