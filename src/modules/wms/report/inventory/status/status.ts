
import PredefinedCustomerSelect from "@components/predefined-customer-select/predefined-customer-select";
import MultipleOrganizationAutoComplete from "@components/multiple-organization-auto-complete/multiple-organization-auto-complete";
import ItemAutoComplete from "@components/itemspec-auto-complete/itemspec-auto-complete";
import PredefinedTableLayout from "@components/predefined-table-layout/predefined-table-layout";
import PredefinedExportBtn from "@components/predefined-export-btn/predefined-export-btn";
import SimplifiedPager from "@components/simplified-pager/simplified-pager";
import CustomizeTable from "@components/customize-table/customize-table";
import FacilitySelect from "@components/facility-select/facility-select";
import ElementSelect from "@components/element-select/element-select";
import MultipleItemAutoComplete from "@components/multiple-item-auto-complete/multiple-item-auto-complete";
import WaittingBtn from "@components/waitting-button/waitting-btn";
import TagsInput from "@components/tags-input/tags-input";
import DateRange from "@components/date-range/date-range";
import errorHandler from "@shared/error-handler";
import Pager from "@components/pager/pager";
import CustomerWiseVue from "@shared/customer-wise-vue";
import { Component } from "vue-property-decorator";
import util from "@shared/util";
import { indexOf, cloneDeep, forEach, groupBy } from "lodash-es";
import inventoryService from "@services/inventory-service";
import reportUtil from "@shared/report-util";
import { Subject } from "rxjs/Subject";
import "rxjs/add/operator/debounceTime";
import tlp from "./status.vue";
@Component({
    mixins: [tlp],
    components: {
        PredefinedCustomerSelect,
        MultipleOrganizationAutoComplete,
        PredefinedTableLayout,
        PredefinedExportBtn,
        ElementSelect,
        ItemAutoComplete,
        FacilitySelect,
        DateRange,
        CustomizeTable,
        Pager,
        WaittingBtn,
        SimplifiedPager,
        MultipleItemAutoComplete,
        TagsInput,
    }
})
export default class Status extends CustomerWiseVue {

    searchParam: any = { paging: { pageNo: 1, limit: 10 }, reportCategory: 'INVENTORY_STATUS' };
    inventoryStatusReports: any = {};
    facilities: Array<any> = [];
    searchResultPaging: any = {};
    statusItemDetail: any = {};
    loading = false;
    customizeComplete = false;
    exportLoading: boolean = false;
    searchByInput: Subject<void> = new Subject();
    inventoryDetailField: Array<any> = ["Hold", "Damaged", "Incoming", "Open Order", "Allocated"];
    customizitionTableView: any = {};
    exportDates: Array<any> = ['Status Level (.xls)', 'LotNo Level (.xls)'];
  itemLoading: any = {};
  childrenShow: any = {};
  childrenReport: any = {};
    onSelectExportName(payload: any) {

        if (payload === 'Status Level (.xls)') {
            this.exportStatusLevelExcel();
        }
        else if (payload === 'Item Level (.xls)') {
            this.exportItemLevelExcel();
        }
        else if (payload === 'LotNo Level (.xls)') {
            this.exportLotNoExcel();
        }
    }
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

    onSelectFacilityChange(payload: any) {
        // this.searchReport();
    }

    onselectCustomerChange(payload: any) {
        this.searchParam.titleIds = [];
        this.searchParam.itemSpecId = null;
        // this.searchReport();
        this.customizeComplete = false;
    }
    onselectTitleChange(payload: any) {
        // this.searchReport();
    }
    onItemSelectChange(payload: any) {
        // this.searchReport();
    }

    selectedLayout: any = null;
    onGroupViewLayoutChange(layout: any) {
        this.selectedLayout = layout;
        if (!layout || !layout.groupColumns || layout.groupColumns.length === 0) {
            this.setInitGroupReport();
        } else {
            this.inventoryStatusReports.data = reportUtil.getReOrgGroupTableSource(this.orginInventoryStatus.data, layout);
        }
    }

    dragStart(event: any) {
        event.dataTransfer.setData("Text", event.target.innerText);
    }

    orginInventoryStatus: any = [];
    private searchInventoryStatusByPaging() {
        if (!this.searchParam.headerList.length) {
            errorHandler.handle('Please Select at least one criteria for each customize column.');
            return;
        }
        this.inventoryStatusReports = [];
        this.searchResultPaging = [];
        this.loading = true;
        let searchParam = this.removeFacilityParamAndFillTitleIdsWhenSearch(cloneDeep(this.searchParam));

        inventoryService.searchInventoryStatusByPaging(searchParam).subscribe(
            res => {
                this.orginInventoryStatus = cloneDeep(res.results);
                this.inventoryStatusReports = res.results;
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
        this.inventoryStatusReports.data = groupBy(reports, 'source');
        // when customize change and has been selected layout
        if (this.selectedLayout && this.selectedLayout.groupColumns.length > 0) {
            this.inventoryStatusReports.data = reportUtil.getReOrgGroupTableSource(this.orginInventoryStatus.data, this.selectedLayout);
        }
    }


    searchReport() {
        this.searchParam.paging = { pageNo: 1, limit: 10 };
        this.searchParam.headerList = reportUtil.getNestedColumnList(this.customizitionTableView);
        this.searchInventoryStatusByPaging();
    }

    triggerSearchFromPager(pager: any) {
        this.searchParam.paging.limit = pager.pageSize;
        this.searchParam.paging.pageNo = pager.currentPage;
        this.searchInventoryStatusByPaging();
    }

    mounted() {
        if (this.$route.params && this.$route.params.path) {
            this.searchParam.titleId = this.$route.params.titleId ? this.$route.params.titleId : null;
            this.searchParam.itemKeyword = this.$route.params.itemKeyword ? this.$route.params.itemKeyword : null;
            this.searchParam.facility = this.$route.params.facility;
        }


        // this.searchByInput.debounceTime(constants.debounceTime).subscribe(
        //     this.searchByInputReport,
        //     err => {
        //         errorHanlder.handle(err);
        //     }
        // );
    }

    // searchByInputReport() {
    //     this.searchReport();
    // }

    private exportStatusLevelExcel() {
        this.exportLoading = true;
        let searchParam = this.removeFacilityParamAndFillTitleIdsWhenSearch(cloneDeep(this.searchParam));
        inventoryService.statusReportDownLoad(searchParam).then((res => {
            this.exportLoading = false;
            util.exportFile(res, "Inventory-Status.xlsx");
        })).catch(err => {
            this.exportLoading = false;
            errorHandler.handle(err);
        });
    }
    private exportItemLevelExcel() {
        this.exportLoading = true;
        let searchParam = this.removeFacilityParamAndFillTitleIdsWhenSearch(cloneDeep(this.searchParam));
        searchParam.reportCategory = "INVENTORY_STATUS_ITEM_DETAIL";
        delete searchParam.headerList;
        inventoryService.statusItemDetailReportDownLoad(searchParam).then((res => {
            this.exportLoading = false;
            util.exportFile(res, "Inventory-Status-Item-Level.xlsx");
        })).catch(err => {
            this.exportLoading = false;
            errorHandler.handle(err);
        });
    }
    private exportLotNoExcel() {
        this.exportLoading = true;
        let searchParam = this.removeFacilityParamAndFillTitleIdsWhenSearch(cloneDeep(this.searchParam));
        delete searchParam.headerList;
        inventoryService.statusLotNoReportDownLoad(searchParam).then((res => {
            this.exportLoading = false;
            util.exportFile(res, "Inventory-LotNo-Level.xlsx");
        })).catch(err => {
            this.exportLoading = false;
            errorHandler.handle(err);
        });
    }

    toInventoryDetail(inventoryStatu: any, head: string) {
        if (indexOf(this.inventoryDetailField, head) > -1 && inventoryStatu[head] > 0) {
            return true;
        }
        return false;
    }

    goToInventoryDetail(inventoryStatu: any, head: string) {
        let openNewRouter: any = null;
        if (head === "Allocated") {
            openNewRouter = this.$router.resolve({ name: 'ItemLineLevelReport', query: { orderItemLineIds: inventoryStatu.orderItemLineIds, titleName: inventoryStatu['Title'], itemID: inventoryStatu['Item ID']} });
        } else if (head === "Incoming") {
            let statuses: any = ['Imported', 'Open', 'Appointment Made', 'In Yard'];
            openNewRouter = this.$router.resolve({ name: 'InboundInquiry', query: { itemSpecId: inventoryStatu.itemSpecId, statuses: statuses, titleId: inventoryStatu.titleId} });
        } else if (head === 'Open Order') {
            let statuses: any  = ['Imported', 'Open'];
            openNewRouter = this.$router.resolve({ name: 'OutboundInquiry', query: { itemSpecId: inventoryStatu.itemSpecId, statuses: statuses, titleId: inventoryStatu.titleId} });
        } else {
            openNewRouter = this.$router.resolve({ name: 'InventoryDetail', query: { itemSpecId: inventoryStatu.itemSpecId, status: head, titleName: inventoryStatu['Title'], itemID: inventoryStatu['Item ID'], titleId: inventoryStatu.titleId, unitId: inventoryStatu.unitId}});
        }
        window.open(openNewRouter.href, '_blank');
    }





  getStatusItemLevelKey(item: any) {
    return item.itemSpecId + item.titleId + item.supplierId;
  }

  showItemLevelTable(key: any, item: any) {
    this.initChildrenSearch(key);
    if (!this.childrenShow[key]) return;
    this.searchInventoryItemActivityReport(key, item);
  }

  private initChildrenSearch(key: any) {
    this.childrenShow[key] = !this.childrenShow[key];
    this.$forceUpdate();
  }



  private searchInventoryItemActivityReport(key: any, item: any) {
    let params = {
      'customerId': item.customerId,
      'itemSpecId': item.itemSpecId,
      'baseUnitId': item.unitId,
      'titleId': item.titleId,
      "supplierId": item.supplierId,
      'reportCategory': 'INVENTORY_STATUS_ITEM_DETAIL_ON_HAND'
    };
    this.itemLoading[key] = true;
    this.$forceUpdate();
    inventoryService.searchStatusRreportItemOnhandDetail(params).subscribe(
      res => {
        this.childrenReport[key] = res.results;
        this.itemLoading[key] = false;
        this.$forceUpdate();
      },
      err => {
        errorHandler.handle(err);
      }
    );
  }


  getLeveLHead(key: any) {
    return this.childrenReport[key] ? this.childrenReport[key].head : [];
  }

  getLeveLData(key: any) {
    return this.childrenReport[key] ? this.childrenReport[key].data : [];
  }


}
