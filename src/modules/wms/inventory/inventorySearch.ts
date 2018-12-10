import ItemAutoComplete from "../../../components/itemspec-auto-complete/itemspec-auto-complete";
import CustomizeTable from "../../../components/customize-table/customize-table";
import ElementSelect from "../../../components/element-select/element-select";
import WaittingBtn from "../../../components/waitting-button/waitting-btn";
import DateRange from "../../../components/date-range/date-range";
import Pager from "../../../components/pager/pager";
import errorHandler from "../../../shared/error-handler";
import WiseVue from "../../../shared/wise-vue";
import session from "../../../shared/session";
import util from "../../../shared/util";
import reportService from "../../../services/report-service";
import { Component, Prop, Provide } from "vue-property-decorator";
import { map, find, indexOf, forEach, compact } from "lodash-es";
import tlp from "./inventorySearch.vue";
import DropWaittingBtn from "../../../components/drop-waitting-button/drop-waitting-btn";
import RadioBtn from "../../../components/radio-button/radio-btn";
import PredefinedCustomerSelect from "../../../components/predefined-customer-select/predefined-customer-select";
import FacilitySelect from "../../../components/facility-select/facility-select";
@Component({
  mixins: [tlp],
  components: {
    ElementSelect,
    ItemAutoComplete,
    DateRange,
    CustomizeTable,
    Pager,
    WaittingBtn,
    RadioBtn,
    DropWaittingBtn,
    PredefinedCustomerSelect,
    FacilitySelect
  }

})
export default class InventorySearch extends WiseVue {

  inventorySearchParam: any = { paging: { pageNo: 1, limit: 10 } };
  inventoryReports: any = {};
  facilities: Array<any> = [];
  facility: any = {};
  searchInventoryPaging: any = {};
  loading = false;
  customerId: string = "";
  customerIds: Array<string> = [];
  exportLoading: boolean = false;
  inventoryStatus: Array<any> = [
    { name: 'All' },
    { name: 'Receiving', dbName: 'Receiving' },
    { name: 'Available', dbName: 'Available' },
    { name: 'Damage', dbName: 'Damage' },
    { name: 'Picked', dbName: 'Picked' },
    { name: 'Packed', dbName: 'Packed' },
    { name: 'Loaded', dbName: 'Loaded' },
    { name: 'UnShipped' },
    { name: 'OnHold', dbName: 'OnHold' },
    { name: 'Reserved', dbName: 'Reserved' }];
  exportList: Array<any> = ['Search Results', 'Current Inventory'];
  sortFieldByItem: any = '';
  sortFieldByLp: any = '';
  pagedLPDetails: any = {};
  allLPDetails: Array<string> = [];
  sortOrderList: Array<any> = ['Sort: Ascending', 'Sort: Descending'];
  sortItemSequence: number = 1;
  sortLPSequence: number = 1;
  expandedinventoryDetail: number = -1;
  expandedLPDetail: number = -1;
  lpLeveData: any = {};
  lpLeveList: any = {};
  lpLeveHead: any = {};
  snLeveData: any = {};
  snLeveList: any = {};
  lpLevePageSize: number = 10;
  lpLeveTotalCount: Array<string> = [];
  SNLeveTotalCount: any = {};
  LPDetaisCurrentPage: number = 1;
  LPDetaisCurrentPageSize: number = 10;
  onItemSelectChange(payload: any) {
    this.searchReport();
  }

  onSelectFacilityChange() {
    this.searchReport();
  }

  onSelectInventoryStatusChange(payload: any) {
    if (payload === "All") {
      this.inventorySearchParam.statuses = compact(map(this.inventoryStatus, 'dbName'));
    } else {
      if (payload === "UnShipped") {
        this.inventorySearchParam.statuses = ["Available", "Loaded", "Packed", "Picked", "Damage", "OnHold"];
      } else {
        let data: any = find(this.inventoryStatus, { name: payload });
        this.inventorySearchParam.statuses = [data.dbName];
      }
    }

    this.searchReport();
  }

  searchStatusReportByPaging() {
    this.inventoryReports = [];
    this.searchInventoryPaging = [];
    this.pagedLPDetails = {};
    this.lpLeveTotalCount = [];
    this.loading = true;
    if (this.inventorySearchParam['itemSpecId']) {
      this.inventorySearchParam['itemSpecIds'] = [this.inventorySearchParam['itemSpecId']];
    } else {
      delete this.inventorySearchParam['itemSpecIds'];
      delete this.inventorySearchParam['itemSpecId'];
    }
    let searchParam = this.inventorySearchParam;
    reportService.searchOverallReport(searchParam, this.inventorySearchParam.facility.accessUrl).subscribe(
      res => {
        this.loading = false;
        this.lpLeveList = res.lpLevelData.dataGroup;
        this.lpLeveHead = res.lpLevelData.head;
        this.snLeveList = res.snLevelData.dataGroup;
        this.inventoryReports = res.results;
        this.searchInventoryPaging = res.paging;
      },
      err => {
        this.loading = false;
        errorHandler.handle(err);
      }
    );
  }

  onselectCustomerChange(payload: any) {
    this.searchStatusReportByPaging();
  }

  private searchReport() {
    this.inventorySearchParam.paging = { pageNo: 1, limit: 10 };
    this.searchStatusReportByPaging();
  }

  private init() {
    let assignedCompanyFacilities = session.getAssignedCompanyFacilities();
    this.facilities = map(assignedCompanyFacilities, "facility");
    this.facility.accessUrl = this.facilities[0].accessUrl;
    this.customerIds = this.getCustomerIds();
    this.inventorySearchParam.customerId = this.getCustomerIdByUserSelect();
    this.searchStatusReportByPaging();
  }


  triggerSearchFromPager(pager: any) {
    this.expandedinventoryDetail = -1;
    this.inventorySearchParam.paging.limit = pager.pageSize;
    this.inventorySearchParam.paging.pageNo = pager.currentPage;
    this.searchStatusReportByPaging();
  }

  onItemSortresultsby() {
    util.sortBy(this.inventoryReports.data, this.sortFieldByItem, this.sortItemSequence);
    this.$forceUpdate();
  }

  onLPSortresultsby() {
    util.sortBy(this.pagedLPDetails.data, this.sortFieldByLp, this.sortLPSequence);
    this.$forceUpdate();
  }

  sortInventory(sortSequenceName: string) {
    if (!this.sortFieldByItem) {
      errorHandler.handle('Select a field to sort');
      return;
    }
    if (sortSequenceName == "Sort: Descending") {
      this.sortItemSequence = 1;
    } else {
      this.sortItemSequence = -1;
    }
    util.sortBy(this.inventoryReports.data, this.sortFieldByItem, this.sortItemSequence);
    this.$forceUpdate();
  }

  sortLPDetails(sortSequenceName: string) {
    if (!this.sortFieldByLp) {
      errorHandler.handle('Select a field to sort');
      return;
    }
    if (sortSequenceName == "Sort: Descending") {
      this.sortLPSequence = 1;
    } else {
      this.sortLPSequence = -1;
    }
    util.sortBy(this.allLPDetails, this.sortFieldByLp, this.sortLPSequence);
    let pageEnd = this.LPDetaisCurrentPage * this.LPDetaisCurrentPageSize;
    let pageStart = pageEnd - this.lpLevePageSize;
    this.searchToDisplayLPDetails(pageStart , pageEnd);
  }

  searchToDisplayLPDetails(pageStart: number, pageEnd: number) {
    this.pagedLPDetails.data = this.allLPDetails.slice(pageStart, pageEnd);
    this.$forceUpdate();
  }

  searchILPDetails(item: any, index: number) {
    this.expandedinventoryDetail = index;
    let searchLPDetailName = `${item['itemSpecId']}|${item['unitId']}|${item['titleId']}`;
    this.lpLeveTotalCount = this.lpLeveList[searchLPDetailName];
    this.allLPDetails = this.lpLeveList[searchLPDetailName];
    this.searchToDisplayLPDetails(0 , 10);
    this.pagedLPDetails.head = [...this.lpLeveHead];
    this.pagedLPDetails.head.splice(this.pagedLPDetails.head.findIndex( (item: String) => item === 'Item ID'), 1);
    this.pagedLPDetails.head.splice(this.pagedLPDetails.head.findIndex( (item: String) => item === 'Description'), 1);
    this.pagedLPDetails.head.splice(this.pagedLPDetails.head.findIndex( (item: String) => item === 'UPC'), 1);
  }

  triggerInventoryLPDetailsre(pager: any) {
    let pageEnd = pager.currentPage * pager.pageSize;
    this.LPDetaisCurrentPage = pager.currentPage;
    this.LPDetaisCurrentPageSize = pager.pageSize;
    let pageStart = pageEnd - pager.pageSize;
    this.searchToDisplayLPDetails(pageStart , pageEnd);
    this.lpLevePageSize = pager.pageSize;
    window.scrollTo(0, 0);
  }



  searchItemSNDetails(details: any, index: any) {
    details.isExpandedLPDetail = !details.isExpandedLPDetail;
    let searchSNDetailName = `${details['itemSpecId']}|${details['unitId']}|${details['titleId']}|${details['LP']}`;
    let snLeves = this.snLeveList[searchSNDetailName];
    this.SNLeveTotalCount[searchSNDetailName] = map(snLeves, 'SN #');
    this.$forceUpdate();
  }


  filterInventoryReport(value: any) {
    if (value == 'Item ID' || value == 'Total' || value == 'Description' || value == 'UOM') return false;
    else return true;
  }

  gitLpDetailsfilerName(item: any) {
    return `${item['itemSpecId']}|${item['unitId']}|${item['titleId']}|${item['LP']}`;
  }

  mounted() {
    this.init();
  }


  exportExcel() {
    this.exportLoading = true;
    reportService.overallReportExport(this.inventorySearchParam, this.facility.accessUrl).then((res => {
      this.exportLoading = false;
      util.exportFile(res, "inventory.xlsx");
    })).catch(err => {
      this.exportLoading = false;
      errorHandler.handle(err);
    });
  }

}
