import WiseVue from "@shared/wise-vue";
import { Component, Prop, Watch } from "vue-property-decorator";
import template from "./multiple-item-group-complete.vue";
import { Select, Option } from "element-ui";
import { find } from 'lodash-es';
import itemService from "@services/item-service";

WiseVue.use(Select);
WiseVue.use(Option);

@Component({
    mixins: [template],
    name: 'multiple-item-group-complete'
})
export default class MultipleItemGroupComplete extends WiseVue {
    @Prop({ default: false })
    clearable!: boolean;

    @Prop({ default: "" })
    value!: string;

    @Prop({ default: () => [] })
    tags!: Array<any>;

    @Prop({ default: "" })
    customerId!: string;


    @Prop({ default: "Input to search" })
    placeholder!: string;

    selectValue: any = this.value;
    showValue: any = '';
    showValueArr: Array<any> = [];
    selectValueArr: Array<any> = [];

    loading = false;
    itemGroups: Array<any> = [];

    @Watch("customerId")
    customerIdChange() {
        this.searchItemGroups();
    }

    onSelectChange() {
        if (this.selectValue && this.selectValueArr.indexOf(this.selectValue) == -1) {
            this.selectValueArr.push(this.selectValue);
            this.showValue = find(this.itemGroups, { id: this.selectValue }).name;
            this.showValueArr.push(this.showValue);
        }
        this.$emit("input", this.selectValueArr);
        this.$emit("change", find(this.itemGroups, { id: this.selectValue }));
        this.selectValue = '';
    }

    removeItem(index: number) {
        this.selectValueArr.splice(index, 1);
        this.showValueArr.splice(index, 1);
    }

    remoteMethod(keyword: string) {
        this.searchItemGroups(keyword);
    }

    @Watch("value")
    valueUpdate() {

    }

    mounted() {
    }


    private setupSearchParameter(keyword?: string) {
        let parameter: any = { scenario: 'Auto Complete' };
        if (this.tags && this.tags.length > 0) {
            parameter.tags = this.tags;
        }
        if (keyword) {
            parameter.name = keyword;
        }
        if (this.customerId) {
            parameter.customerId = this.customerId;
        }
        return parameter;
    }



    private searchItemGroups(keyword?: string) {

        let param = this.setupSearchParameter(keyword);
        this.loading = true;
        this.itemGroups = [];
        itemService.searchGroupBasicInfo(param).subscribe(
            res => {
                this.itemGroups = res;
                this.loading = false;
            },
            err => {
                this.loading = false;
            }
        );

    }
}