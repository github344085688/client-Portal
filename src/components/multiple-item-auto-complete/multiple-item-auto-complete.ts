import WiseVue from "@shared/wise-vue";
import { Component, Prop, Watch } from "vue-property-decorator";
import template from "./multiple-item-auto-complete.vue";
import { Select, Option } from "element-ui";
import { find, unionBy, findIndex, forEach } from 'lodash-es';
import itemService from "@services/item-service";
import errorHanlder from '@shared/error-handler';

WiseVue.use(Select);
WiseVue.use(Option);

@Component({
    mixins: [template],
    name: 'multiple-item-auto-complete'
})
export default class MultipleItemAutoComplete extends WiseVue {

    @Prop({ default: false })
    clearable!: boolean;

    @Prop({ default: "" })
    extParam!: object;

    @Prop({ default: "" })
    value!: string;

    @Prop({ default: () => [] })
    tags!: Array<any>;

    @Prop({ default: () => [] })
    customerIds!: Array<any>;

    @Prop({ default: "" })
    customerId!: string;

    @Prop({ default: "" })
    supplierId!: string;

    @Prop({ default: "Input to search" })
    placeholder!: string;

    selectValue: any = this.value;
    showValue!: any;
    showValueArr: Array<any> = [];
    selectValueArr: Array<any> = [];

    loading = false;
    itemSpecList: Array<any> = [];

    onSelectChange() {
        if (this.selectValue && this.selectValueArr.indexOf(this.selectValue) == -1) {
            // push the search item
            this.selectValueArr.push(this.selectValue);

            // push the filtername
            this.showValue = find(this.itemSpecList, { id: this.selectValue }).filtername;
            this.showValueArr.push(this.showValue);
        }
        this.$emit("input", this.selectValueArr);
        this.$emit("change", find(this.itemSpecList, { id: this.selectValue }));
        if (!this.selectValue) {
            this.searchItem("");
        }
        this.selectValue = '';
    }

    removeItem(index: number) {
        this.selectValueArr.splice(index, 1);
        this.showValueArr.splice(index, 1);
    }

    remoteMethod(keyword: string) {
        this.searchItem(keyword);
    }

    @Watch("value")
    valueUpdate() {
        // this.selectValue = this.value;
        // this.getItemById(this.value);
    }

    @Watch("customerId")
    onCustomerIdChange() {
        this.selectValue = this.value;
        if (this.value) {
            this.searchItem("", [this.value]);
        } else {
            this.searchItem("");
        }
    }

    mounted() {
        // if (this.value) {
        //     this.searchItem("", [this.value]);
        // } else {
        //     this.searchItem("");
        // }

    }

    getItemById(id: string) {
        if (this.value && findIndex(this.itemSpecList, ['id', this.value]) < 0) {
            this.unsubcribers.push(itemService.get(id).subscribe(
                res => {
                    this.itemSpecList = unionBy([res], this.itemSpecList, "id");
                    this.selectValue = this.value;
                },
                err => {
                    errorHanlder.handle(err);
                }
            ));
        }
    }

    private setupSearchParameter(keyword?: string, ids?: Array<String>) {
        let parameter: any = { scenario: 'Auto Complete' };
        if (this.tags && this.tags.length > 0) {
            parameter.tags = this.tags;
        }
        if (keyword) {
            parameter.keyword = keyword;
        }
        if (ids) {
            parameter.ids = ids;
        }
        return parameter;
    }

    private addCustomerIdToSearchParam(param: any) {
        let customerId = this.getCustomerIdByUserSelect();
        if (customerId) {
            param.customerId = customerId;
        }
    }

    private addSupplierIdToSearchParam(param: any) {
        if (this.supplierId) {
            param.supplierId = this.supplierId;
        }
    }


    private searchItem(keyword?: string, ids?: Array<String>) {
        let param = this.setupSearchParameter(keyword, ids);
        this.addCustomerIdToSearchParam(param);
        this.addSupplierIdToSearchParam(param);
        this.loading = true;

        this.unsubcribers.push(itemService.search(param).subscribe(
            res => {
                forEach(res, (item) => {
                    item.filtername = item.name;
                    if (item.shortDescription) {
                        item.filtername = item.filtername + ` ( ${item.shortDescription} )`;
                    } else {
                        if (item.desc) {
                            item.filtername = item.filtername + ` ( ${item.desc} )`;
                        }
                    }
                });
                this.itemSpecList = res;
                this.loading = false;
            },
            err => {
                this.loading = false;
            }
        ));
    }
}