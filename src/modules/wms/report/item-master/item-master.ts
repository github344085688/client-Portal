import PredefinedCustomerSelect from "@components/predefined-customer-select/predefined-customer-select";
import MultipleOrganizationAutoComplete from "@components/multiple-organization-auto-complete/multiple-organization-auto-complete";
import ElementSelect from "@components/element-select/element-select";
import FacilitySelect from "@components/facility-select/facility-select";
import WaittingBtn from "@components/waitting-button/waitting-btn";
import Pager from "@components/pager/pager";
import errorHandler from "@shared/error-handler";
import CustomerWiseVue from "@shared/customer-wise-vue";
import util from "@shared/util";
import itemService from "@services/item-service";
import { Component } from "vue-property-decorator";
import { cloneDeep, forEach } from "lodash-es";
import reportService from "@services/report-service";
import MultipleItemGroupComplete from "@components/multiple-item-group-complete/multiple-item-group-complete";
import SwitchButton from "@components/switch-button/switch-button";
import TagsInput from "@components/tags-input/tags-input";
import tlp from "./item-master.vue";

@Component({
    mixins: [tlp],
    components: {
        ElementSelect,
        PredefinedCustomerSelect,
        MultipleOrganizationAutoComplete,
        FacilitySelect,
        Pager,
        WaittingBtn,
        MultipleItemGroupComplete,
        SwitchButton,
        TagsInput

    }
})
export default class ItemMaster extends CustomerWiseVue {
    itemMasters: any = [];
    searchParam: any = { paging: { pageNo: 1, limit: 10, pageSize: 10 } };
    putAwayReport: any = {};
    facilities: Array<any> = [];
    exportEmail: any = "";

    loading = false;
    exportLoading: boolean = false;

    triggerSearchFromPager(pager: any) {
        this.searchParam.paging.limit = pager.pageSize;
        this.searchParam.paging.pageNo = pager.currentPage;
        this.searchItemMastersByPaging();
    }

    searchItemMastersByPaging() {
        this.loading = true;
        let searchParam = cloneDeep(this.searchParam);
        if (searchParam.statuses && searchParam.statuses.length === 0) delete searchParam.statuses;
        if (searchParam.tags && searchParam.tags.length === 0) delete searchParam.tags;
        if (searchParam.groupIds && searchParam.groupIds.length === 0) delete searchParam.groupIds;
        if (searchParam.titleIds && searchParam.titleIds.length === 0) delete searchParam.titleIds;
        if (searchParam.supplierIds && searchParam.supplierIds.length === 0) delete searchParam.supplierIds;
        if (searchParam.customerId ) {
            searchParam.customerIds = [searchParam.customerId];
            delete searchParam.customerId;
        }
        itemService.itemSpec(searchParam).subscribe(
            res => {
                this.itemMasters = res.itemSpecs;
                forEach(this.itemMasters, item => {
                    util.itemDisplay(item);
                });
                this.searchParam.paging = res.paging;
                this.loading = false;
            },
            err => {
                this.loading = false;
                errorHandler.handle(err);
            }
        );
    }

    searchItemMasters() {
        this.searchParam.paging = { pageNo: 1, limit: 10 };
        this.searchItemMastersByPaging();
    }

    exportExcel() {
        this.exportLoading = true;
        let searchParam = cloneDeep(this.searchParam);
        searchParam.customerIds = [searchParam.customerId];
        if (searchParam.statuses && searchParam.statuses.length === 0) delete searchParam.statuses;
        if (searchParam.tags && searchParam.tags.length === 0) delete searchParam.tags;
        if (searchParam.groupIds && searchParam.groupIds.length === 0) delete searchParam.groupIds;
        if (searchParam.titleIds && searchParam.titleIds.length === 0) delete searchParam.titleIds;
        if (searchParam.supplierIds && searchParam.supplierIds.length === 0) delete searchParam.supplierIds;
        if (this.exportEmail) {
            searchParam.email = this.exportEmail;
        }
        delete searchParam.customerId;
        delete searchParam.paging;
        reportService.itemSpecDownLoad(searchParam).then(((res: any) => {
            this.exportLoading = false;
            util.exportFile(res, "item-master.xlsx");
        })).catch(err => {
            this.exportLoading = false;
            errorHandler.handle(err);
        });
    }

    private init() {
    }

    mounted() {
        this.init();
    }

}