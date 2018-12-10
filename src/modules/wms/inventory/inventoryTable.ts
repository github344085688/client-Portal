import ItemAutoComplete from "../../../components/itemspec-auto-complete/itemspec-auto-complete";
import SimplifiedPager from "../../..//components/simplified-pager/simplified-pager";
import CustomizeTable from "../../..//components/customize-table/customize-table";
import ElementSelect from "../../..//components/element-select/element-select";
import WaittingBtn from "../../..//components/waitting-button/waitting-btn";
import DateRange from "../../..//components/date-range/date-range";
import Pager from "../../..//components/pager/pager";
import errorHandler from "../../..//shared/error-handler";
import WiseVue from "../../..//shared/wise-vue";
import session from "../../..//shared/session";
import util from "../../..//shared/util";
import reportService from "../../../services/report-service";
import { Component, Prop, Provide } from "vue-property-decorator";
import { map, compact, find, cloneDeep, difference, forEach } from "lodash-es";
import DropWaittingBtn from "../../../components/drop-waitting-button/drop-waitting-btn";
import RadioBtn from "../../../components/radio-button/radio-btn";
import tlp from "./inventoryTable.vue";
import PredefinedCustomerSelect from "../../../components/predefined-customer-select/predefined-customer-select";
import FacilitySelect from "../../../components/facility-select/facility-select";
@Component({
  mixins: [tlp],
  components: {
    ElementSelect,
    DateRange,
    SimplifiedPager,
    CustomizeTable,
    Pager,
    WaittingBtn,
    RadioBtn,
    DropWaittingBtn,
    ItemAutoComplete,
    PredefinedCustomerSelect,
    FacilitySelect
  }
})
export default class Inventory extends WiseVue {

  inventorySearchParam: any = { paging: { pageNo: 1, limit: 10 } };
  inventoryReports: any = {};
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
  tableFileds: Array<any> = [];
  facilities: Array<any> = [];
  tableHead: any;

  facility: any = {};
  searchResultPaging: any = {};

  initload = false;
  loading = false;
  customerId: string = "";
  exportLoading: boolean = false;
  customerIds: Array<string> = [];

  lpLeveData: any = {};
  lpLeveList: any = {};
  lpLeveHead: any = {};
  snLeveData: any = {};
  snLeveList: any = {};
  lpLevePageSize: any = {};
  lpLeveTotalCount: any = {};
  SNLeveTotalCount: any = {};
  inventoryLPDetailsres: any = {};
  inventorySNDetailsres: any = {};

  onSelectCustomizeTable(payload: any) {
    let head = map(payload, "fieldName");
    this.tableHead = head;
    this.inventoryReports.head = head;
  }

  onItemSelectChange(payload: any) {
    this.resetInventoryParamAndsearchReport();
  }

  onSelectFacilityChange(payload: any) {
    let name = payload;
    this.facility = find(this.facilities, { 'name': name });
    if (this.inventorySearchParam.orderId) {
      delete this.inventorySearchParam.orderId;
    }
    this.resetInventoryParamAndsearchReport();
  }

  keyUp() {
    this.resetInventoryParamAndsearchReport();
  }


  private init() {
    let assignedCompanyFacilities = session.getAssignedCompanyFacilities();
    this.facilities = map(assignedCompanyFacilities, "facility");
    this.customerIds = this.getCustomerIds();
    this.facility = this.facilities[0];
    this.facility.accessUrl = this.facilities[0].accessUrl;
    this.inventorySearchParam.defaultFacilityName = this.facilities[0].name;
    this.inventorySearchParam.statuses = compact(map(this.inventoryStatus, 'dbName'));
    this.inventorySearchParam.statuses = 'All';
    this.inventorySearchParam.customerId = this.getCustomerIdByUserSelect();
    this.searchStatusReportByPaging();
  }

  private resetInventoryParamAndsearchReport() {
    this.inventorySearchParam.paging = { pageNo: 1, limit: 10 };
    this.searchStatusReportByPaging();
  }


  triggerSearchFromPager(pager: any) {
    this.inventorySearchParam.paging.limit = pager.pageSize;
    this.inventorySearchParam.paging.pageNo = pager.currentPage;
    this.searchStatusReportByPaging();
  }

  private initTable() {

    if (this.initload) {
        if (this.tableHead) {
            this.inventoryReports.head = this.tableHead;
        }

    } else {
        this.inventoryReports.head.forEach((head: any) => {
            let field = { fieldId: head, fieldName: head, checked: true };
            this.tableFileds.push(field);
        });
    }
}

  onselectCustomerChange(payload: any) {
    this.searchStatusReportByPaging();
  }

  searchStatusReportByPaging() {
    this.inventoryReports = [];
    this.searchResultPaging = {};
    this.loading = true;
    let searchParam = this.inventorySearchParam;
    if (this.inventorySearchParam['itemSpecId']) {
      this.inventorySearchParam['itemSpecIds'] = [this.inventorySearchParam['itemSpecId']];
    } else {
      delete this.inventorySearchParam['itemSpecIds'];
      delete this.inventorySearchParam['itemSpecId'];
    }
    reportService.searchOverallReport(searchParam, this.inventorySearchParam.facility.accessUrl).subscribe(
      res => {
        this.loading = false;
        this.lpLeveList = res.lpLevelData.dataGroup;
        this.lpLeveHead = res.lpLevelData.head;
        this.snLeveList = res.snLevelData.dataGroup;
        this.inventoryReports = res.results;
        this.searchResultPaging = res.paging;
        this.initTable();
        this.initload = true;
      },
      err => {
        this.loading = false;
        errorHandler.handle(err);
      }
    );
  }


  searchLPDetails(item: any) {
    let searchLPDetailName = `${item['itemSpecId']}|${item['unitId']}|${item['titleId']}`;
    item[searchLPDetailName] = !item[searchLPDetailName];
    this.lpLeveTotalCount[searchLPDetailName] = this.lpLeveList[searchLPDetailName];
    this.inventoryLPDetailsres[searchLPDetailName] = this.lpLeveList[searchLPDetailName].slice(0, 10);
    this.inventoryLPDetailsres.head = this.lpLeveHead;
    this.$forceUpdate();
  }

  searchSNDetails(item: any) {
    let searchSNDetailName = `${item['itemSpecId']}|${item['unitId']}|${item['titleId']}|${item['lpId']}`;
    item[searchSNDetailName] = !item[searchSNDetailName];
    this.SNLeveTotalCount[searchSNDetailName] = this.snLeveList[searchSNDetailName].length;
    let SNDetails = this.snLeveList[searchSNDetailName];
    this.inventorySNDetailsres[searchSNDetailName] = map(SNDetails, 'sn');
    this.inventorySNDetailsres.head = this.lpLeveHead;
    this.$forceUpdate();
  }


  funGetLPDetailFilterNmae(item: any) {
    return `${item['itemSpecId']}|${item['unitId']}|${item['titleId']}`;
  }

  funGetSNDetailFilterNmae(item: any) {
    return `${item['itemSpecId']}|${item['unitId']}|${item['titleId']}|${item['lpId']}`;
  }

  inventoryLPDetailsReportFromPager(pager: any) {
    let pageEnd = pager.currentPage * pager.pageSize;
    let pageStart = pageEnd - pager.pageSize;
    this.inventoryLPDetailsres[pager.keyId] = this.lpLeveList[pager.keyId].slice(pageStart, pageEnd);
    this.lpLevePageSize[pager.keyId] = pager.pageSize;
    this.$forceUpdate();
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
        this.resetInventoryParamAndsearchReport();
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
