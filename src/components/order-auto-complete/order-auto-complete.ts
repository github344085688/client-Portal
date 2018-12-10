import WiseVue from "../../shared/wise-vue";
import { Component, Prop, Watch } from "vue-property-decorator";
import template from "./order-auto-complete.vue";
import { find, unionBy, findIndex } from 'lodash-es';
import orderService from "../../services/order-service";
import errorHanlder from '../../shared/error-handler';

@Component({
    mixins: [template],
    name: 'order-auto-complete'
})
export default class OrderAutoComplete extends WiseVue {


    @Prop({ default: false })
    clearable!: boolean;

    @Prop({ default: "" })
    extParam!: object;

    @Prop({ default: "" })
    value!: string;

    @Prop({ default: "" })
    statuses!: string;

    @Prop({ default: "" })
    placeholder!: string;

    @Prop({ default: [] })
    customerIds!: Array<any>;

    @Prop({ default: "" })
    customerId!: string;

    @Prop({
        default: function () {
            return {};
        }
    })
    facility!: any;

    selectValue: any = "";

    loading = false;
    orders: Array<any> = [];


    onSelectChange() {
        this.$emit("input", this.selectValue);
        this.$emit("change", find(this.orders, { id: this.selectValue }));
    }

    remoteMethod(keyword: string) {
        this.searchItem(keyword);
    }

    @Watch("facility")
    facilityUpdate() {
        this.selectValue = "";
        this.orders = [];
        this.$emit("input", this.selectValue);
    }


    @Watch("value")
    valueUpdate() {
        this.getItemById(this.value);
    }

    getItemById(id: string) {
        if (this.value && findIndex(this.orders, { id: this.value }) < 0) {
            this.unsubcribers.push(orderService.get(id, this.facility.accessUrl).subscribe(
                res => {
                    this.orders = unionBy([res], this.orders, "id");
                    this.selectValue = this.value;
                },
                err => {
                    errorHanlder.handle(err);
                }
            ));
        }
    }

    private setupSearchParameter(keyword: string) {
        let parameter: any = { paging: { pageNo: 1, limit: 10 } };
        if (this.statuses) {
            parameter.statuses = this.statuses;
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


    private searchItem(keyword: string) {
        let param = this.setupSearchParameter(keyword);
        this.addCustomerIdToSearchParam(param);
        this.loading = true;

        this.unsubcribers.push(orderService.searchReceiptByPaging(param, this.facility.accessUrl).subscribe(
            res => {

                this.orders = res.orders;
                this.loading = false;
            },
            err => {
                this.loading = false;
            }
        ));

    }

}