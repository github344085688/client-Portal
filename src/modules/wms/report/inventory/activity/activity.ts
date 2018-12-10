
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
import { map, find } from "lodash-es";
import tlp from "./activity.vue";

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

    activitySearchParam: any = { paging: { pageNo: 1, limit: 10 } };
    activityReports: any = {};

    tableFileds: Array<any> = [];
    facilities: Array<any> = [];
    tableHead: any;

    searchResultPaging: any = {};

    loading = false;
    initload = false;
    customerIds: Array<string> = [];
    exportLoading: boolean = false;
    onSelectDateRange(payload: any) {
        this.activitySearchParam.timeFrom = payload.timeFrom;
        this.activitySearchParam.timeTo = payload.timeTo;
        this.searchReport();
    }

    onItemSelectChange(payload: any) {

        if (!payload) {
            delete this.activitySearchParam.itemSpecId;
            delete this.activitySearchParam.itemSpecIds;
        } else {
            this.activitySearchParam.itemSpecIds = [payload.id];
        }
        this.searchReport();
    }

    onSelectCustomizeTable(payload: any) {
        let head = map(payload, "fieldName");
        this.tableHead = head;
        this.activityReports.head = head;
    }


    onSelectFacilityChange() {
        this.searchReport();
    }

    onselectCustomerChange(payload: any) {

        this.searchReport();
    }

    private searchReport() {
        this.activitySearchParam.paging = { pageNo: 1, limit: 10 };
        this.searchActivityReportByPaging();
    }

    searchActivityReportByPaging() {
        this.activityReports = [];
        this.searchResultPaging = [];
        this.loading = true;
        let searchParam = this.activitySearchParam;
        reportService.searchActivityReportByPaging(searchParam, this.activitySearchParam.facility.accessUrl).subscribe(
            res => {
                this.activityReports = res.results;
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

    private init() {

        this.activitySearchParam.timeTo = util.fomateEndDate(new Date());
        let currentDate = new Date();
        currentDate.setTime(currentDate.getTime() - 24 * 60 * 60 * 1000 * 6);
        this.activitySearchParam.timeFrom = util.fomateStartDate(currentDate);
        this.customerIds = this.getCustomerIds();
        this.searchActivityReportByPaging();
    }

    private initTable() {

        if (this.initload) {
            if (this.tableHead) {
                this.activityReports.head = this.tableHead;
            }

        } else {
            this.activityReports.head.forEach((head: any) => {
                let field = { fieldId: head, fieldName: head, checked: true };
                this.tableFileds.push(field);
            });
        }
    }

    triggerSearchFromPager(pager: any) {
        this.activitySearchParam.paging.limit = pager.pageSize;
        this.activitySearchParam.paging.pageNo = pager.currentPage;
        this.searchActivityReportByPaging();
    }

    mounted() {
        this.init();
    }

    exportExcel() {
        this.exportLoading = true;
        reportService.activityDownLoad(this.activitySearchParam, this.activitySearchParam.facility.accessUrl).then((res => {
            this.exportLoading = false;
            util.exportFile(res, "inventoryActivity.xlsx");
        })).catch((err: any) => {
            this.exportLoading = false;
            errorHandler.handle(err);
        });
    }
}