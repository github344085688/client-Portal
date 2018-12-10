import Vue from "vue";
import { Component, Prop, Provide, Watch } from "vue-property-decorator";
import template from "./element-select.vue";
import { Select, Option } from "element-ui";
Vue.use(Select);
Vue.use(Option);

@Component({
    mixins: [template],
    name: 'element-select'
})

export default class ElementSelect extends Vue {

    @Prop({
        default: false
    })
    filterable!: boolean;

    @Prop({
        default: false
    })
    clearable!: boolean;

    @Prop({
        default: 'Select'
    })
    placeholder!: string;

    @Prop()
    value!: string;

    @Prop({
        default: function () {
            return [];
        }
    })
    options!: Array<any>;


    selectValue: any = "";

    mounted() {
        this.selectValue = this.value;
    }


    @Watch("value")
    valueChanged() {
        this.selectValue = this.value;
    }

    selectChange() {
        this.$emit("input", this.selectValue);
        this.$emit("selectChange", this.selectValue);
    }

    remove() {
        this.$emit("remove");
    }
}