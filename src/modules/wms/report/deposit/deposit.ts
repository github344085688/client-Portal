import CustomerWiseVue from '@shared/customer-wise-vue';
import { Component } from "vue-property-decorator";
import { map } from 'lodash-es';
import tlp from "./deposit.vue";
import PredefinedCustomerSelect from "@components/predefined-customer-select/predefined-customer-select";
import WaittingBtn from "@components/waitting-button/waitting-btn";
import errorHandler from "@shared/error-handler";
import Session from '@shared/session';
import organizationService from '@services/organization-service';

@Component({
    mixins: [tlp],
    components: {
        PredefinedCustomerSelect,
        WaittingBtn
    }
})
export default class Deposit extends CustomerWiseVue {
    customerId: string = '';
    customerCode: any = '';
    customerTrueName: string = '';
    org: any = '';
    customerIds: Array<any> = [];
    token: string = '';
    showDepositIframe: Boolean = true;
    baseDepositUrl: string = '';
    resultDepositUrl: string = '';

    mounted() {
        this.init();
    }

    init() {
        this.getDeposiBaseUrl();
        this.token = Session.getUserToken();
        this.customerIds = this.getCustomerIds();
        this.org = this.getCustomers();
        if (this.customerIds.length == 0) {
            errorHandler.handle('CustomerId Error');
            return;
        } else
        if (this.customerIds.length == 1) {
            this.openDepositByCustomerCode();
        } else {
            this.showDepositIframe = false;
        }
    }

    getDeposiBaseUrl() {
        this.baseDepositUrl = DEPOSIT_API_BASE_URL;
    }

    changeCustomer() {
        this.getCustomerTrueName();
    }

    getCustomerTrueName() {
        map(this.org, (value: any, index: any) => {
            if (value.id == this.customerId) {
                this.customerTrueName = value.name;
            }
        });
    }

    async openDepositByCustomerCode() {
        this.getCustomerTrueName();
        this.searchCustomerCode();
    }

    changeDepositType() {
        this.showDepositIframe = false;
        this.resultDepositUrl = '';
    }

    private async searchCustomerCode() {
        organizationService.search({ id: this.customerId }).subscribe(
            res => {
                this.customerCode = res[0].extend.customerCode;
                let paramStr = window.btoa('token=' + this.token + '&customerCode=' + this.customerCode + '&show=3');
                this.resultDepositUrl = this.baseDepositUrl + '?' + paramStr;
                this.showDepositIframe = true;
            },
            err => {
                errorHandler.handle('CustomerCode Error');
            }
        );
    }
}