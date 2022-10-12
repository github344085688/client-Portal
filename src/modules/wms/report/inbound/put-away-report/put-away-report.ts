import PredefinedCustomerSelect from "@components/predefined-customer-select/predefined-customer-select";
import MultipleOrganizationAutoComplete from "@components/multiple-organization-auto-complete/multiple-organization-auto-complete";
import ElementSelect from "@components/element-select/element-select";
import FacilitySelect from "@components/facility-select/facility-select";
import WaittingBtn from "@components/waitting-button/waitting-btn";
import FillInput from "@components/fill-input/fill-input";
import DateRange from "@components/date-range/date-range";
import Pager from "@components/pager/pager";
import errorHandler from "@shared/error-handler";
import CustomerWiseVue from "@shared/customer-wise-vue";
import util from "@shared/util";
import InboundService from "@services/inbound-service";
import { Component } from "vue-property-decorator";
import { indexOf, cloneDeep } from "lodash-es";
import ItemAutoComplete from "@components/itemspec-auto-complete/itemspec-auto-complete";
import reportService from "@services/report-service";
import tlp from "./put-away-report.vue";

@Component({
    mixins: [tlp],
    components: {
        ElementSelect,
        PredefinedCustomerSelect,
        MultipleOrganizationAutoComplete,
        FacilitySelect,
        DateRange,
        Pager,
        WaittingBtn,
        ItemAutoComplete,
        FillInput
    }
})
export default class ScheduleSummary extends CustomerWiseVue {
    receiptStatus: Array<any> = ['Imported', 'Open', 'Appointment Made', 'In Yard', 'In Progress', 'Task Completed', 'Exception', 'Closed', 'Force Closed', 'Cancelled', 'Reopened'];
    currentPageDates: any = [];
    searchParam: any = { paging: { pageNo: 1, limit: 10, pageSize: 10 } };
    searchResultPaging: any = { paging: { pageNo: 1, limit: 10, pageSize: 10 } };
    putAwayReport: any = {};
    facilities: Array<any> = [];

    loading = false;
    exportLoading: boolean = false;


    onSelectFacilityChange(payload: any) {

    }

    onselectCustomerChange(payload: any) {

    }

    triggerSearchFromPager(pager: any) {
        this.searchParam.paging.limit = pager.pageSize;
        this.searchParam.paging.pageNo = pager.currentPage;
        this.searchPutawayReportByPaging();
    }

    searchPutawayReportByPaging() {
        this.searchResultPaging = [];
        this.loading = true;
        let searchParam = this.removeFacilityParamAndFillTitleIdsWhenSearch(cloneDeep(this.searchParam));
        reportService.searchPutawayReportByPaging(searchParam).subscribe(
            res => {
                this.putAwayReport = res.results;
                this.searchResultPaging = res.paging;
                this.loading = false;
            },
            err => {
                this.loading = false;
                errorHandler.handle(err);
            }
        );
    }

    searchReport() {
        this.searchParam.paging = { pageNo: 1, limit: 10 };
        this.searchPutawayReportByPaging();
    }

    exportExcel() {
        this.exportLoading = true;
        let searchParam = this.removeFacilityParamAndFillTitleIdsWhenSearch(cloneDeep(this.searchParam));
        reportService.putAwayReportDownLoad(searchParam).then(((res: any) => {
            this.exportLoading = false;
            util.exportFile(res, "put-away-report.xlsx");
        })).catch(err => {
            this.exportLoading = false;
            errorHandler.handle(err);
        });
    }

    private init() {
    }

    mounted() {
        this.init();
    }



    onSelectCreateDateRange(payload: any) {
        this.searchParam.receivingDateFrom = payload.timeFrom;
        this.searchParam.receivingDateTo = payload.timeTo;
    }

    onSelectAppointmentDateRange(payload: any) {
        this.searchParam.putawayDateFrom = payload.timeFrom;
        this.searchParam.putawayDateTo = payload.timeTo;
    }

    onSelectInYardDateRange(payload: any) {
        this.searchParam.receiptImportDateFrom = payload.timeFrom;
        this.searchParam.receiptImportDateTo = payload.timeTo;
    }



}