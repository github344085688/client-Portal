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
import OutboundService from "@services/outbound-service";
import { Component, Prop, Provide } from "vue-property-decorator";
import { map, compact, indexOf, cloneDeep, forEach, difference } from "lodash-es";
import tlp from "./shipping-summary.vue";

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
export default class ShippedSummary extends CustomerWiseVue {

    paging: any = { pageNo: 1, limit: 10 };
    searchParam: any = {};
    shippingSummaryReports: any = { data: [] };
    facilities: Array<any> = [];
    currentPageDates: any = [];

    loading = false;
    exportLoading: boolean = false;

    onSelectDateRange(payload: any) {
        this.searchParam.timeFrom = payload.timeFrom;
        this.searchParam.timeTo = payload.timeTo;
        // this.searchReport();
    }

    onSelectFacilityChange(payload: any) {
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
        this.currentPageDates = this.shippingSummaryReports.data.slice((currentPage - 1) * this.paging.limit,
            currentPage * this.paging.limit > this.shippingSummaryReports.data.length ? this.shippingSummaryReports.data.length : currentPage * this.paging.limit);
        this.$forceUpdate();
    }


    searchShippingSummaryReportByPaging() {
        this.shippingSummaryReports = { data: [] };
        this.loading = true;
        let searchParam = this.removeFacilityParamAndFillTitleIdsWhenSearch(cloneDeep(this.searchParam));
        OutboundService.searchShippingSummaryReportByPaging(searchParam).subscribe(
            res => {
                this.shippingSummaryReports = res.results;
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
        this.searchShippingSummaryReportByPaging();
    }

    linkFields: any = ['Shipped Order Count'];
    isLinkField(head: string) {
        if (indexOf(this.linkFields, head) > -1) {
            return true;
        }
        return false;
    }

    goInquiryDetail(summaryData: any) {
        let openNewRouter = this.$router.resolve({ name: 'OutboundInquiry', query: { orderIds: summaryData.orderIds } });
        window.open(openNewRouter.href, '_blank');
    }

    exportExcel() {
        this.exportLoading = true;
        let searchParam = this.removeFacilityParamAndFillTitleIdsWhenSearch(cloneDeep(this.searchParam));
        OutboundService.shippingSummaryDownLoad(searchParam).then((res => {
            this.exportLoading = false;
            util.exportFile(res, "Outbound-Shipping-Summary.xlsx");
        })).catch(err => {
            this.exportLoading = false;
            errorHandler.handle(err);
        });
    }

    private init() {
        this.searchParam.reportCategory = "OUTBOUND_SHIPPING_SUMMARY";
        // this.searchShippingSummaryReportByPaging();
    }
    mounted() {
        this.init();
    }

}