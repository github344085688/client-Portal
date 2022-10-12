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
        ElButton: Button
    }
})
export default class LoadSearchForm extends WiseVue {
    searchParams: SearchParams = {};
    isAdvanced: Boolean = false;
    typeList: Array<string> = ["LTL", "FTL", "SPL", "CONSOL", "IMDL"];
    @Prop(Boolean) loading?: boolean;
    @Emit()
    searchLoads(params: any) {
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
    }
}