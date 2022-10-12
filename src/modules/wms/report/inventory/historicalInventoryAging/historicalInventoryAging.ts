
import PredefinedCustomerSelect from "@components/predefined-customer-select/predefined-customer-select";
import MultipleOrganizationAutoComplete from "@components/multiple-organization-auto-complete/multiple-organization-auto-complete";
import PredefinedTableLayout from "@components/predefined-table-layout/predefined-table-layout";
import ItemAutoComplete from "@components/itemspec-auto-complete/itemspec-auto-complete";
import SimplifiedPager from "@components/simplified-pager/simplified-pager";
import CustomizeTable from "@components/customize-table/customize-table";
import FacilitySelect from "@components/facility-select/facility-select";
import ElementSelect from "@components/element-select/element-select";
import WaittingBtn from "@components/waitting-button/waitting-btn";
import DateRange from "@components/date-range/date-range";
import SingleDateRange from "@components/single-date-range/single-date-range";
import errorHandler from "@shared/error-handler";
import Pager from "@components/pager/pager";
import CustomerWiseVue from "@shared/customer-wise-vue";
import { Component } from "vue-property-decorator";
import { map, compact, indexOf, cloneDeep, orderBy, filter, forEach, groupBy } from "lodash-es";
import inventoryService from "@services/inventory-service";
import errorHanlder from '@shared/error-handler';
import reportUtil from "@shared/report-util";
import util from "@shared/util";
import constants from '@shared/constants';
import { Subject } from "rxjs/Subject";
import "rxjs/add/operator/debounceTime";
import tlp from "./historicalInventoryAging.vue";

import TagsInput from "@components/tags-input/tags-input";
@Component({
    mixins: [tlp],
    components: {
        PredefinedCustomerSelect,
        MultipleOrganizationAutoComplete,
        PredefinedTableLayout,
        ElementSelect,
        ItemAutoComplete,
        FacilitySelect,
        DateRange,
        SingleDateRange,
        CustomizeTable,
        Pager,
        WaittingBtn,
        SimplifiedPager,
        TagsInput
    }
})
export default class HistoricalInventoryAging extends CustomerWiseVue {

    searchParam: any = { };
    paging: any = { pageNo: 1, limit: 10 };
    inventoryAgingReports: any = { data: [] };
    facilities: Array<any> = [];
    searchResultPaging: any = {};
    currentPageDates: any = [];
    loading = false;
    customizeComplete = true;
    exportLoading: boolean = false;
    searchByInput: Subject<void> = new Subject();
    inventoryDetailField: Array<any> = [];
    customizitionTableView: any = {};

    onSelectFacilityChange(facility: any) {
    }

    onselectCustomerChange(customer: any) {
        this.customizeComplete = false;
        this.searchParam.itemSpecId = null;
        this.searchParam.titleIds = [];
    }

    dragStart(event: any) {
        event.dataTransfer.setData("Text", event.target.innerText);
    }

    onSingleDateFeomRange(date: any) {
      if (date) {
        this.searchParam.dateFrom = date;
      } else {
        delete this.searchParam.dateFrom;
      }
    }

    onSingleDateToRange(date: any) {
      if (date) {
        this.searchParam.dateTo = util.fomateEndDate(new Date(date));
      } else {
        delete this.searchParam.dateTo;
      }
    }

    private searchHistoricalInventoryAgingByPaging() {
        this.inventoryAgingReports = { data: [] };
        this.searchResultPaging = [];
        this.loading = true;
        let searchParam = this.removeFacilityParamAndFillTitleIdsWhenSearch(cloneDeep(this.searchParam));
        inventoryService.searchHistoricalInventoryAgingByPaging(searchParam).subscribe(
            res => {
                this.inventoryAgingReports = res.results;
                this.loading = false;
                this.loadContent(1);
            },
            err => {
                this.loading = false;
                errorHandler.handle(err);
            }
        );
    }

    triggerSearchFromPager(pager: any) {
      this.paging.limit = pager.pageSize;
      this.paging.pageNo = pager.currentPage;
      this.loadContent(this.paging.pageNo);
    }

      private loadContent(currentPage: number) {
        this.currentPageDates = this.inventoryAgingReports.data.slice((currentPage - 1) * this.paging.limit,
          currentPage * this.paging.limit > this.inventoryAgingReports.data.length ? this.inventoryAgingReports.data.length : currentPage * this.paging.limit);
        this.$forceUpdate();
      }

      searchReport() {
        this.searchHistoricalInventoryAgingByPaging();
      }

    mounted() {
    }

    exportExcel() {
        this.exportLoading = true;
        let searchParam = this.removeFacilityParamAndFillTitleIdsWhenSearch(cloneDeep(this.searchParam));
        inventoryService.agingReportReceiptLevelDownLoad(searchParam).then((res => {
            this.exportLoading = false;
            util.exportFile(res, "historical_inventory_aging.xlsx");
        })).catch(err => {
            this.exportLoading = false;
            errorHandler.handle(err);
        });
    }

    toInventoryDetail(head: string) {
        if (indexOf(this.inventoryDetailField, head) > -1) {
            return true;
        }
        return false;
    }

    onItemSelectChange(item: any) {
      if (!item) {
        delete this.searchParam.itemSpecId;
        delete this.searchParam.itemSpecIds;
      } else {
        this.searchParam.itemSpecIds = [item.id];
      }
    }
}
