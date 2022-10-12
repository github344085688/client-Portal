import WiseVue from "@shared/wise-vue";
import { Component, Prop, PropSync, Emit } from "vue-property-decorator";
import { Row, Col, Select,  Option, Button } from 'element-ui';
import template from "./index.vue";
import WaittingBtn from "@components/waitting-button/waitting-btn";
import MultipleOrganizationAutoComplete from "@components/multiple-organization-auto-complete/multiple-organization-auto-complete";
import PredefinedCustomerSelect from "@components/predefined-customer-select/predefined-customer-select";
import OrganizationAutoComplete from "@components/organization-auto-complete/organization-auto-complete";
import loadService from "@services/load-service";
import TagsInput from "@components/tags-input/tags-input";
import DatePicker from 'vue2-datepicker';
import session from "@shared/session";
import userService from "@services/user-service";
import ItemAutoComplete from "@components/itemspec-auto-complete/itemspec-auto-complete";
import constantService from "@services/constant-service";
import errorHanlder from '@shared/error-handler';
import * as _ from 'lodash';

interface SearchParams {
    keyword?: string;
    statuses?: string | null;
    customerIds?: Array<string>;
    carrierId?: string;
}

@Component({
    mixins: [template],
    components: {
        ElRow: Row,
        ElCol: Col,
        ElSelect: Select,
        ElOption: Option,
        WaittingBtn,
        MultipleOrganizationAutoComplete,
        PredefinedCustomerSelect,
        OrganizationAutoComplete,
        TagsInput,
        DatePicker,
        ElButton: Button,
        ItemAutoComplete
    }
})
export default class ReceiptSearchForm extends WiseVue {
    searchParams: SearchParams = {};
    isAdvanced: Boolean = false;
    users: Array<string> = [];
    sorts: Array<string> = ['Expiration date'];
    receiptTypes: Array<string> = [];
    subReceiptTypes: Array<string> = ["Repair Reverse", "GRIEF", "Manual PO", "Over Received", "Critsit"];
    @Prop(Boolean) loading?: boolean;
    @Prop(Boolean) showExport?: boolean;
    @Emit()
    searchLoads (params: any) {
        return params;
    }

    _searchLoads() {
        this.searchParams = this.getSearchParams();
        this.searchLoads(this.searchParams);
    }

    getSearchParams() {
        let searchParam: any = Object.assign({}, this.searchParams);
        if (this.isAdvanced) {
            delete searchParam.keyword;
        }
        for (let i in searchParam) {
            if (searchParam[i] === '') {
                delete searchParam[i];
            }
        }
        return searchParam;
    }

    onselectCustomerChange(params: any) {
        this.searchParams.customerIds = [params.id];
    }

    init() {
        this.searchParams = _.pick(this.searchParams, ['customerIds']);
        this.isAdvanced = false;
        this.receiptTypes = constantService.getReceiptTypes();
        this.getUsers('');
    }

    getUsers (keyword: string) {
        let params: any = {
            keyword: keyword,
            scenario: 'Auto Complete'
        };
        let currentCf = session.getCurrentCompanyFacility();
        if (currentCf) {
            params.facilityId = currentCf.facilityId;
        }
        userService.searchUsers(params).subscribe(
            res => {
                this.users = res;
            },
            error => {
                errorHanlder.handle(error);
            }
        );
    }

    getUserName(user: any) {
        if (!user) return "";
        if (user.firstName && user.lastName) {
            return `${user.firstName} ${user.lastName} (${user.username})`;
        }
        return user.username;
    }
}