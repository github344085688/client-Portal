import PredefinedCustomerSelect from "@components/predefined-customer-select/predefined-customer-select";
import MultipleOrganizationAutoComplete from "@components/multiple-organization-auto-complete/multiple-organization-auto-complete";
import ElementSelect from "@components/element-select/element-select";
import FacilitySelect from "@components/facility-select/facility-select";
import WaittingBtn from "@components/waitting-button/waitting-btn";
import DateRange from "@components/date-range/date-range";
import Pager from "@components/pager/pager";
import errorHandler from "@shared/error-handler";
import CustomerWiseVue from "@shared/customer-wise-vue";
import util from "@shared/util";
import InboundService from "@services/inbound-service";
import { Component } from "vue-property-decorator";
import { indexOf, cloneDeep } from "lodash-es";
import tlp from "./schedule-summary.vue";

@Component({
    mixins: [tlp],
    components: {
        ElementSelect,
        PredefinedCustomerSelect,
        MultipleOrganizationAutoComplete,
        FacilitySelect,
        DateRange,
        Pager,
        WaittingBtn
    }
})
export default class ScheduleSummary extends CustomerWiseVue {

    paging: any = { pageNo: 1, limit: 10 };
    searchParam: any = {};
    currentPageDates: any = [];
    scheduledSummaryReports: any = { data: [] };
    facilities: Array<any> = [];

    loading = false;
    exportLoading: boolean = false;

    onSelectDateRange(payload: any) {
        this.searchParam.appointmentTimeFrom  = payload.timeFrom;
        this.searchParam.appointmentTimeTo = payload.timeTo;
        // this.searchReport();
    }

    onSelectFacilityChange(payload: any) {
        if (this.searchParam.receiptIds) {
            delete this.searchParam.receiptIds;
        }
        // this.searchReport();
    }

    onselectCustomerChange(payload: any) {
        this.searchParam.titleIds = [];
        // this.searchReport();
    }

    triggerSearchFromPager(pager: any) {
        this.paging.limit = pager.pageSize;
        this.paging.pageNo = pager.currentPage;
        this.loadContent(this.paging.pageNo);
    }

    private loadContent(currentPage: number) {
        this.currentPageDates = this.scheduledSummaryReports.data.slice((currentPage - 1) * this.paging.limit,
            currentPage * this.paging.limit > this.scheduledSummaryReports.data.length ? this.scheduledSummaryReports.data.length : currentPage * this.paging.limit);
        this.$forceUpdate();
    }


    searchScheduleSummaryReportByPaging() {
        this.scheduledSummaryReports  = { data: [] };
        this.loading = true;
        let searchParam = this.removeFacilityParamAndFillTitleIdsWhenSearch(cloneDeep(this.searchParam));
        InboundService.searchScheduleSummaryReportByPaging(searchParam).subscribe(
            res => {
                this.scheduledSummaryReports = res.results;
                this.loadContent(1);
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
        this.searchScheduleSummaryReportByPaging();
    }

    linkFields: any = ['Expected Receipt Count'];
    isLinkField(head: string) {
        if (indexOf(this.linkFields, head) > -1) {
            return true;
        }
        return false;
    }

    goInquiryDetail(summaryData: any) {
        let openNewRouter = this.$router.resolve({ name: 'InboundInquiry', query: { receiptIds: summaryData.receiptIds } });
        window.open(openNewRouter.href, '_blank');
    }

    exportExcel() {
        this.exportLoading = true;
        let searchParam = this.removeFacilityParamAndFillTitleIdsWhenSearch(cloneDeep(this.searchParam));
        InboundService.scheduleSummaryDownLoad(searchParam).then((res => {
            this.exportLoading = false;
            util.exportFile(res, "Inbound-Schedule-Summary.xlsx");
        })).catch(err => {
            this.exportLoading = false;
            errorHandler.handle(err);
        });
    }
    private init() {
        this.searchParam.reportCategory = "INBOUND_SCHEDULE_SUMMARY";
        // this.searchScheduleSummaryReportByPaging();
    }
    mounted() {
        this.init();
    }

}