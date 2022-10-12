
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
import MultipleItemAutoComplete from "@components/multiple-item-auto-complete/multiple-item-auto-complete";
import util from "@shared/util";
import DateRange from "@components/date-range/date-range";

import "rxjs/add/operator/debounceTime";
import tlp from "./snLookUp.vue";
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
        MultipleItemAutoComplete,
    }
})
export default class SnLookUp extends CustomerWiseVue {

    searchParam: any = { paging: { pageNo: 1, limit: 10 }, reportCategory: 'INVENTORY_SN_ACTIVITY' };
    snLookUpReports: any = {};
    facilities: Array<any> = [];
    searchResultPaging: any = {};
    statues: Array<any> = ['Receiving', 'Available', 'Damage', 'Picked',
        'Packed', 'Loaded', 'OnHold', 'Reserved', 'Occupied', 'Shipped', 'configuring'];
    types: Array<any> = ['Inbound', 'Outbound'];
    loading = false;
    exportLoading: boolean = false;
    isShowType: boolean = false;
    centerDialogVisible: boolean = false;

    onSelectStatus(payload: any) {
        // this.searchReport();
    }



    onSelectFacilityChange(payload: any) {
        // this.searchReport();
    }

    onselectCustomerChange(payload: any) {
    this.searchParam.itemSpecIds = null;
    this.searchParam.titleIds = [];

  }

    onSelectCreateDateRange(payload: any) {
        this.searchParam.dateFrom = payload.timeFrom;
        this.searchParam.dateTo = payload.timeTo;
    }

    private searchInventorySnLookUpByPaging() {

        this.snLookUpReports = [];
        this.searchResultPaging = [];
        this.loading = true;
        let searchParam = this.removeFacilityParamAndFillTitleIdsWhenSearch(cloneDeep(this.searchParam));

        inventoryService.searchInventorySnLookUpByPaging(searchParam).subscribe(
            res => {
                this.loading = false;
                this.snLookUpReports = res.results;
                this.searchResultPaging = res.paging;
            },
            err => {
                this.loading = false;
                errorHandler.handle(err);
            }
        );
    }

     exportExcel() {
        this.exportLoading = true;
        let searchParam = this.removeFacilityParamAndFillTitleIdsWhenSearch(cloneDeep(this.searchParam));
            inventoryService.snLookUpReportDownLoad(searchParam).then((res => {
                this.exportLoading = false;
                util.exportFile(res, "Inventory-Sn-Look-Up.xlsx");
            })).catch(err => {
                this.exportLoading = false;
                errorHandler.handle(err);
            });
    }

    toggleSearchConditions() {
        let customerId = cloneDeep(this.searchParam.customerId);
        let facility = cloneDeep(this.searchParam.facility);
        this.searchParam = { customerId: customerId, facility: facility, paging: { pageNo: 1, limit: 10 }, reportCategory: 'INVENTORY_SN_ACTIVITY' };
        if (this.isShowType) {
            this.isShowType = false;
        } else {
            this.isShowType = true;
        }
    }

    searchReport() {
        this.searchParam.paging = { pageNo: 1, limit: 10 };
        this.searchInventorySnLookUpByPaging();
    }

    triggerSearchFromPager(pager: any) {
        this.searchParam.paging.limit = pager.pageSize;
        this.searchParam.paging.pageNo = pager.currentPage;
        this.searchInventorySnLookUpByPaging();
    }
    mounted() {
    }

    linkFields: any = ['Receive #', 'Order #', 'SN'];
    isLinkField(head: string) {
        if (indexOf(this.linkFields, head) > -1) {
            return true;
        }
        return false;
    }

    goInquiryDetail(snLookUpReport: any, head: string) {
        let openNewRouter: any = null;
        if (head === 'Receive #') {
            openNewRouter = this.$router.resolve({ name: 'InboundInquiry', query: { receiptIds: snLookUpReport.receiptId, itemSpecId: snLookUpReport.itemSpecId } });
        }
        if (head === 'Order #') {
            openNewRouter = this.$router.resolve({ name: 'OutboundInquiry', query: { orderIds: snLookUpReport.orderId, itemSpecId: snLookUpReport.itemSpecId } });
        }
        if (head === 'SN') {
            openNewRouter = this.$router.resolve({ name: 'SnActivityHistory', query: { receiptId: snLookUpReport.receiptId, orderId: snLookUpReport.orderId, customerId: snLookUpReport.customerId, adjustmentIds: snLookUpReport.adjustmentIds, sn: snLookUpReport.SN, itemSpecId: snLookUpReport.itemSpecId } });
        }
        window.open(openNewRouter.href, '_blank');
    }
}
