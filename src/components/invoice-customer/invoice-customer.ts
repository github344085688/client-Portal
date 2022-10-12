import WiseVue from "@shared/wise-vue";
import { Component, Prop } from "vue-property-decorator";
import template from "./invoice-customer.vue";
import { Select, Option } from "element-ui";
import { intersectionWith, find } from 'lodash-es';
import tmsInvoiceService from "@services/tms/tms-invoice-service";
import errorHandler from "@shared/error-handler";
import session from '@shared/session';
WiseVue.use(Select);
WiseVue.use(Option);

@Component({
    mixins: [template],
    name: 'invoice-customer'
})
export default class InvoiceCustomer extends WiseVue {
    @Prop({ default: "" })
    app!: string;

    invoiceCustomers: Array<any> = [];
    selectValue: any = "";
    searchInvoiceCustomer: any = {
        "api": "/api/Vendor/GetVendorByParameters",
        "data": {
            "Category": "Customer",
            "Program": "TMS"
        }

    };

    onSelectChange() {
        this.$emit('update:change', this.selectValue);
        this.$emit('change');
    }

    init() {
        let userCustomers: any = find(session.getAssignedInvoiceAppCompanyIds(), { "app": "TMS" });
        let AppCustomerIds = this.getAssignedInvoiceCustomerIds();
        this.searchInvoiceCustomer.data.CompanyIDs = userCustomers.companyIds;
        tmsInvoiceService.searchInvoice(this.searchInvoiceCustomer).subscribe(
            res => {
                if (res.Result.length > 0) {
                    this.invoiceCustomers = intersectionWith(res.Result, AppCustomerIds, function (value, other) {
                        return value.AccountID === other;
                    });
                    if (this.invoiceCustomers.length > 0) {
                        this.selectValue = this.invoiceCustomers[0].AccountID;
                        this.$emit('update:change', this.selectValue);
                    }
                }
                this.$emit('change');
            },
            err => {
                errorHandler.handle(err);
            }
        );

    }

    mounted() {
        this.init();
    }
}