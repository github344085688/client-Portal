
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
import tlp from "./aging.vue";
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
        SimplifiedPager
    }
})
export default class Aging extends CustomerWiseVue {

    searchParam: any = { paging: { pageNo: 1, limit: 10 }, reportCategory: 'INVENTORY_AGING' };
    inventoryAgingReports: any = {};
    facilities: Array<any> = [];
    searchResultPaging: any = {};
    loading = false;
    customizeComplete = false;
    exportLoading: boolean = false;
    searchByInput: Subject<void> = new Subject();
    inventoryDetailField: Array<any> = [];
    customizitionTableView: any = {};
    onSelectStatus(payload: any) {
        // this.searchReport();
    }

    onSelectCustomizeTable(payload: any) {
        this.customizitionTableView = payload;
        if (!this.customizitionTableView.isFirstInit) {
            this.searchReport();
        }
        // this.searchReport();
        this.customizeComplete = true;
    }
    onItemSelectChange(item: any) {
    }

    onSelectFacilityChange(facility: any) {
    }

    onselectCustomerChange(customer: any) {
        this.customizeComplete = false;
        this.searchParam.itemSpecId = null;
        this.searchParam.titleIds = [];
    }

    selectedLayout: any = null;
    onGroupViewLayoutChange(layout: any) {
        this.selectedLayout = layout;
        if (!layout || !layout.groupColumns || layout.groupColumns.length === 0) {
            this.setInitGroupReport();
        } else {
            this.inventoryAgingReports.data = reportUtil.getReOrgGroupTableSource(this.orginInventoryStatus.data, layout);
        }
    }

    dragStart(event: any) {
        event.dataTransfer.setData("Text", event.target.innerText);
    }

    onSingleDateRange(date: any) {
      if (date) {
        this.searchParam.endDate = date;
      } else {
        delete this.searchParam.endDate;
      }
    }

    orginInventoryStatus: any = [];
    private searchInventoryAgingByPaging() {
        if (!this.searchParam.headerList.length) {
            errorHandler.handle('Please Select at least one criteria for each customize column.');
            return;
        }
        this.inventoryAgingReports = [];
        this.searchResultPaging = [];
        this.loading = true;
        if (this.searchParam.agingDates) {
          this.searchParam.agingDates = Math.floor(this.searchParam.agingDates);
        } else {
          delete this.searchParam.agingDates;
        }
        let searchParam = this.removeFacilityParamAndFillTitleIdsWhenSearch(cloneDeep(this.searchParam));
        inventoryService.searchInventoryAgingByPaging(searchParam).subscribe(
            res => {
                this.orginInventoryStatus = cloneDeep(res.results);
                this.inventoryAgingReports = res.results;
                this.searchResultPaging = res.paging;
                this.setInitGroupReport();
                this.loading = false;
            },
            err => {
                this.loading = false;
                errorHandler.handle(err);
            }
        );
    }


    private setInitGroupReport() {
        let reports = cloneDeep(this.orginInventoryStatus.data);
        forEach(reports, (dt) => {
            dt.source = 'dbSource';
        });
        this.inventoryAgingReports.data = groupBy(reports, 'source');
        if (this.selectedLayout && this.selectedLayout.groupColumns.length > 0) {
            this.inventoryAgingReports.data = reportUtil.getReOrgGroupTableSource(this.orginInventoryStatus.data, this.selectedLayout);
        }
    }


      searchReport() {
        this.searchParam.paging = {pageNo: 1, limit: 10};
        this.searchParam.headerList = reportUtil.getNestedColumnList(this.customizitionTableView);
        this.searchInventoryAgingByPaging();
      }

    triggerSearchFromPager(pager: any) {
        this.searchParam.paging.limit = pager.pageSize;
        this.searchParam.paging.pageNo = pager.currentPage;
        this.searchInventoryAgingByPaging();
    }

    mounted() {
    }

    exportExcel() {
        this.exportLoading = true;
        let searchParam = this.removeFacilityParamAndFillTitleIdsWhenSearch(cloneDeep(this.searchParam));
        inventoryService.agingReportDownLoad(searchParam).then((res => {
            this.exportLoading = false;
            util.exportFile(res, "Inventory-Aging.xlsx");
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
}
