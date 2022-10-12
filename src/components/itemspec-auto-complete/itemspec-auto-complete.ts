import WiseVue from "@shared/wise-vue";
import { Component, Prop, Watch } from "vue-property-decorator";
import template from "./itemspec-auto-complete.vue";
import { Select, Option } from "element-ui";
import { find, unionBy, findIndex, forEach } from 'lodash-es';
import itemService from "@services/item-service";
import errorHanlder from '@shared/error-handler';

WiseVue.use(Select);
WiseVue.use(Option);

@Component({
    mixins: [template],
    name: 'spec-auto-complete'
})
export default class ItemAutoComplete extends WiseVue {


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

    loading = false;
    itemSpecList: Array<any> = [];

    onSelectChange() {
        this.$emit("input", this.selectValue);
        this.$emit("change", find(this.itemSpecList, { id: this.selectValue }));
        if (!this.selectValue) {
            this.searchItem("");
        }
    }

    remoteMethod(keyword: string) {
        this.searchItem(keyword);
    }

    @Watch("value")
    valueUpdate(val: any) {
        if (val) this.getItemById(val);
        else this.selectValue = '';
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
        if (this.value) {
            this.searchItem("", [this.value]);
        }
    }

    getItemById(id: string) {
        let itemSpecIdIndex = findIndex(this.itemSpecList, ['id', this.value]);
        if (this.value && itemSpecIdIndex > 0) {
            this.selectValue = this.itemSpecList[itemSpecIdIndex].filtername;
        }
        else {
            this.unsubcribers.push(itemService.get(id).subscribe(
                res => {
                    res.filtername = res.name;
                    if (res.shortDescription) {
                        res.filtername = res.filtername + ` ( ${res.shortDescription} )`;
                    } else {
                        if (res.desc) {
                            res.filtername = res.filtername + ` ( ${res.desc} )`;
                        }
                    }
                    this.itemSpecList = unionBy([res], this.itemSpecList, "id");
                    this.selectValue = res.filtername;
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
        // if (this.customerId) {
        //     param.customerId = this.customerId;
        // }
        // if (this.customerIds) {
        //     param.customerIds = this.customerIds;
        // }
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