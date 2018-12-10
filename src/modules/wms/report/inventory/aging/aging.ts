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
import util from "../../../../../shared/util";
import reportService from "../../../../../services/report-service";
import { Component, Prop, Provide } from "vue-property-decorator";
import { map, find, indexOf } from "lodash-es";
import tlp from "./aging.vue";
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
export default class Aging extends WiseVue {

    agingSearchParam: any = { paging: { pageNo: 1, limit: 10 } };
    agingReports: any = {};

    tableFileds: Array<any> = [];
    facilities: Array<any> = [];
    tableHead: any;

    searchResultPaging: any = {};

    loading = false;
    initload = false;
    customerIds: Array<string> = [];
    exportLoading: boolean = false;
    inventoryDetailField: Array<any> = ["Item ID"];

    onSelectDateRange(payload: any) {

    }

    onItemSelectChange(payload: any) {
        this.searchReport();
    }

    onSelectCustomizeTable(payload: any) {
        let head = map(payload, "fieldName");
        this.tableHead = head;
        this.agingReports.head = head;
    }


    onSelectFacilityChange() {
        this.searchReport();
    }
    onselectCustomerChange(payload: any) {
        this.searchReport();
    }

    searchAgingReportByPaging() {
        this.agingReports = [];
        this.searchResultPaging = [];
        this.loading = true;
        let searchParam = this.agingSearchParam;
        reportService.searchAgingReportByPaging(searchParam, this.agingSearchParam.facility.accessUrl).subscribe(
            res => {
                this.agingReports = res.results;
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

    private searchReport() {
        this.agingSearchParam.paging = { pageNo: 1, limit: 10 };
        this.searchAgingReportByPaging();
    }

    private init() {
        this.customerIds = this.getCustomerIds();
        this.searchAgingReportByPaging();
    }

    private initTable() {

        if (this.initload) {
            if (this.tableHead) {
                this.agingReports.head = this.tableHead;
            }

        } else {
            this.agingReports.head.forEach((head: any) => {
                let field = { fieldId: head, fieldName: head, checked: true };
                this.tableFileds.push(field);
            });
        }
    }

    triggerSearchFromPager(pager: any) {
        this.agingSearchParam.paging.limit = pager.pageSize;
        this.agingSearchParam.paging.pageNo = pager.currentPage;
        this.searchAgingReportByPaging();
    }

    mounted() {
        this.init();
    }

    exportExcel() {
        this.exportLoading = true;
        reportService.agingReportDownLoad(this.agingSearchParam, this.agingSearchParam.facility.accessUrl).then((res => {
            this.exportLoading = false;
            util.exportFile(res, "inventoryAging.xlsx");
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

    goToInventoryDetail(statu: any, head: string) {
        this.$router.replace({ name: 'InventoryDetail', params: { path: 'Aging', customerId: this.agingSearchParam.customerId, itemSpecId: statu['Item ID'], title: statu['Title'], status: head, accessUrl: this.agingSearchParam.facility.accessUrl, searchItemSpecId: this.agingSearchParam.itemSpecId } });
    }
}