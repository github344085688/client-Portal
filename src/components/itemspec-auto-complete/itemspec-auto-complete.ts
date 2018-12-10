import WiseVue from "../../shared/wise-vue";
import { Component, Prop, Provide, Watch, Emit } from "vue-property-decorator";
import template from "./itemspec-auto-complete.vue";
import { Select, Option } from "element-ui";
import { mixins } from "vue-class-component";
import { find, unionBy, findIndex, forEach } from 'lodash-es';
import itemService from "../../services/item-service";
import errorHanlder from '../../shared/error-handler';

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

    @Prop({ default: "" })
    tags!: Array<any>;

    @Prop({ default: [] })
    customerIds!: Array<any>;

    @Prop({ default: "" })
    customerId!: string;

    @Prop({ default: "" })
    supplierId!: string;

    @Prop({ default: "Input to search" })
    placeholder!: string;

    selectValue: any = "";

    loading = false;
    itemSpecList: Array<any> = [];


    onSelectChange() {
        this.$emit("input", this.selectValue);
        this.$emit("change", find(this.itemSpecList, { id: this.selectValue }));
    }

    remoteMethod(keyword: string) {
        this.searchItem(keyword);
    }

    @Watch("value")
    valueUpdate() {
        this.getItemById(this.value);
    }

    getItemById(id: string) {
        if (this.value && findIndex(this.itemSpecList, { id: this.value }) < 0) {
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

    private setupSearchParameter(keyword: string) {
        let parameter: any = { scenario: 'Auto Complete' };
        if (this.tags) {
            parameter.tags = this.tags;
        }
        if (keyword) {
            parameter.keyword = keyword;
        }
        return parameter;
    }

    private addCustomerIdToSearchParam(param: any) {
        if (this.customerId) {
            param.customerId = this.customerId;
        }
        if (this.customerIds) {
            param.customerIds = this.customerIds;
        }
    }

    private addSupplierIdToSearchParam(param: any) {
        if (this.supplierId) {
            param.supplierId = this.supplierId;
        }
    }


    private searchItem(keyword: string) {
        let param = this.setupSearchParameter(keyword);
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