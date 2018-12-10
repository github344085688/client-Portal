import PredefinedCustomerSelect from "../../../../../components/predefined-customer-select/predefined-customer-select";
import ItemAutoComplete from "../../../../../components/itemspec-auto-complete/itemspec-auto-complete";
import CustomizeTable from "../../../../../components/customize-table/customize-table";
import FacilitySelect from "../../../../../components/facility-select/facility-select";
import ElementSelect from "../../../../../components/element-select/element-select";
import WaittingBtn from "../../../../../components/waitting-button/waitting-btn";
import DateRange from "../../../../../components/date-range/date-range";
import Pager from "../../../../../components/pager/pager";
import errorHandler from "../../../../../shared/error-handler";
import WiseVue from "../../../../../shared/wise-vue";
import session from "../../../../../shared/session";
import util from "../../../../../shared/util";
import reportService from "../../../../../services/report-service";
import { Component, Prop, Provide } from "vue-property-decorator";
import { map, find, indexOf } from "lodash-es";
import tlp from "./status.vue";

@Component({
    mixins: [tlp],
    components: {
        PredefinedCustomerSelect,
        ElementSelect,
        ItemAutoComplete,
        FacilitySelect,
        DateRange,
        CustomizeTable,
        Pager,
        WaittingBtn
    }
})
export default class Status extends WiseVue {

    statusSearchParam: any = { paging: { pageNo: 1, limit: 10 } };
    statusReports: any = {};

    tableFileds: Array<any> = [];
    facilities: Array<any> = [];
    tableHead: any;

    searchResultPaging: any = {};

    loading = false;
    initload = false;
    customerIds: Array<string> = [];
    exportLoading: boolean = false;

    inventoryDetailField: Array<any> = ["Hold", "Damaged", "Available", "Total"];
    onSelectDateRange(payload: any) {

    }

    onItemSelectChange(payload: any) {
        this.searchReport();
    }

    onSelectCustomizeTable(payload: any) {
        let head = map(payload, "fieldName");
        this.tableHead = head;
        this.statusReports.head = head;
    }

    onSelectFacilityChange() {
        this.searchReport();
    }

    onselectCustomerChange(payload: any) {
        this.searchReport();
    }

    searchStatusReportByPaging() {
        this.statusReports = [];
        this.searchResultPaging = [];
        this.loading = true;
        let searchParam = this.statusSearchParam;
        reportService.searchStatusReportByPaging(searchParam, this.statusSearchParam.facility.accessUrl).subscribe(
            res => {
                this.statusReports = res.results;
                this.searchResultPaging = res.paging;
                this.loading = false;
                this.initTable();
                this.initload = true;
            },
            err => {
                this.loading = false;
                errorHandler.handle(err);
            }
        );
    }

    toInventoryDetail(head: string) {
        if (indexOf(this.inventoryDetailField, head) > -1) {
            return true;
        }
        return false;
    }

    private searchReport() {
        this.statusSearchParam.paging = { pageNo: 1, limit: 10 };
        this.searchStatusReportByPaging();
    }

    private init() {

        this.customerIds = this.getCustomerIds();
        this.statusSearchParam.itemSpecId = this.$route.params.searchItemSpecId ? this.$route.params.searchItemSpecId : null;
        this.searchStatusReportByPaging();
    }

    private initTable() {

        if (this.initload) {
            if (this.tableHead) {
                this.statusReports.head = this.tableHead;
            }

        } else {
            this.statusReports.head.forEach((head: any) => {
                let field = { fieldId: head, fieldName: head, checked: true };
                this.tableFileds.push(field);
            });
        }
    }

    triggerSearchFromPager(pager: any) {
        this.statusSearchParam.paging.limit = pager.pageSize;
        this.statusSearchParam.paging.pageNo = pager.currentPage;
        this.searchStatusReportByPaging();
    }

    mounted() {
        this.init();
    }

    exportExcel() {
        this.exportLoading = true;
        reportService.statusReportDownLoad(this.statusSearchParam, this.statusSearchParam.facility.accessUrl).then((res => {
            this.exportLoading = false;
            util.exportFile(res, "inventoryStatus.xlsx");
        })).catch(err => {
            this.exportLoading = false;
            errorHandler.handle(err);
        });
    }

    goToInventoryDetail(statu: any, head: string) {
        this.$router.replace({ name: 'InventoryDetail', params: {path: 'Status', customerId: this.statusSearchParam.customerId, itemSpecId: statu['Item ID'], title: statu['Title'], status: head, accessUrl: this.statusSearchParam.facility.accessUrl, searchItemSpecId: this.statusSearchParam.itemSpecId } });
    }
}