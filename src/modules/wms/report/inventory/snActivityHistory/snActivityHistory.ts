
import PredefinedCustomerSelect from "@components/predefined-customer-select/predefined-customer-select";
import OrganizationAutoComplete from "@components/organization-auto-complete/organization-auto-complete";
import MultipleOrganizationAutoComplete from "@components/multiple-organization-auto-complete/multiple-organization-auto-complete";
import TagsInput from "@components/tags-input/tags-input";
import FacilitySelect from "@components/facility-select/facility-select";
import WaittingBtn from "@components/waitting-button/waitting-btn";
import errorHandler from "@shared/error-handler";
import Pager from "@components/pager/pager";
import CustomerWiseVue from "@shared/customer-wise-vue";
import { Component } from "vue-property-decorator";
import { cloneDeep, indexOf } from "lodash-es";
import inventoryService from "@services/inventory-service";
import errorHanlder from '@shared/error-handler';
import ItemAutoComplete from "@components/itemspec-auto-complete/itemspec-auto-complete";
import util from "@shared/util";
import DateRange from "@components/date-range/date-range";

import "rxjs/add/operator/debounceTime";
import tlp from "./snActivityHistory.vue";
@Component({
    mixins: [tlp],
    components: {
        PredefinedCustomerSelect,
        OrganizationAutoComplete,
        MultipleOrganizationAutoComplete,
        TagsInput,
        FacilitySelect,
        Pager,
        WaittingBtn,
        ItemAutoComplete,
        DateRange,
    }
})
export default class SnLookUp extends CustomerWiseVue {

    searchParam: any = {  };
    snActivityHistoryReports: any = {};
    loading = false;

    private searchInventorySnActivityHistorySearch() {

        this.snActivityHistoryReports = [];
        this.loading = true;
        this.searchParam.customerId = this.getCustomerIdByUserSelect();
        this.searchParam.reportCategory = 'INVENTORY_SN_ACTIVITY_HISTORY';
        // let searchParam = this.removeFacilityParamAndFillTitleIdsWhenSearch(cloneDeep(this.searchParam));
        let querys = this.$route.query;
        if (querys) {
          if (querys.receiptId) {
            this.searchParam.receiptIds = [querys.receiptId];
          }
          if (querys.customerId) {
            this.searchParam.customerId = querys.customerId;
          }
          if (querys.orderId) {
            this.searchParam.orderIds = [querys.orderId];
          }
          if (querys.adjustmentIds) {
            if (typeof querys.adjustmentIds === 'string') {
              this.searchParam.adjustmentIds = [querys.adjustmentIds];
            } else {
              this.searchParam.adjustmentIds = querys.adjustmentIds;
            }
          }
          if (querys.sn) {
            this.searchParam.sn = querys.sn;
          }
          if (querys.itemSpecId) {
            this.searchParam.itemSpecId = querys.itemSpecId;
          }
      }

        inventoryService.searchInventorySnActivityHistorySearch(this.searchParam).subscribe(
            res => {
                this.loading = false;
                this.snActivityHistoryReports = res.results;
            },
            err => {
                this.loading = false;
                errorHandler.handle(err);
            }
        );
    }

    mounted() {
      this.searchInventorySnActivityHistorySearch();
    }


}
