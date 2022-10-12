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
import { isEmpty, cloneDeep, forEach } from "lodash-es";
import ItemAutoComplete from "@components/itemspec-auto-complete/itemspec-auto-complete";
import reportService from "@services/report-service";
import tlp from "./generic-transload-report.vue";
import TagsInput from "@components/tags-input/tags-input";
import MultipleItemAutoComplete from "@components/multiple-item-auto-complete/multiple-item-auto-complete";


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
        FillInput,
        TagsInput,
        MultipleItemAutoComplete
    }
})
export default class ScheduleSummary extends CustomerWiseVue {
    currentPageDates: any = [];
    searchParam: any = { paging: { pageNo: 1, limit: 10, pageSize: 10 } };
    searchResultPaging: any = { paging: { pageNo: 1, limit: 10, pageSize: 10 } };
    genericTransloadReport: any = {};

    loading = false;
    exportLoading: boolean = false;


    onSelectFacilityChange(payload: any) {

    }

    onselectCustomerChange(payload: any) {

    }

    triggerSearchFromPager(pager: any) {
        this.searchParam.paging.limit = pager.pageSize;
        this.searchParam.paging.pageNo = pager.currentPage;
        this.searchGenericTransload();
    }

    searchGenericTransload() {
        if (!this.verify(this.searchParam)) {
            return;
        }
        this.searchResultPaging = [];
        this.loading = true;
        let searchParam = this.removeFacilityParamAndFillTitleIdsWhenSearch(cloneDeep(this.searchParam));
        forEach(searchParam, function (value: any, key: any) {
            if (JSON.stringify(value) === '[]') {
                searchParam[key] = null;
            }
        });
        reportService.searchGenericTransload(searchParam).subscribe(
            res => {
                this.genericTransloadReport = res.results;
                this.searchResultPaging = res.paging;
                this.loading = false;
            },
            err => {
                this.loading = false;
                errorHandler.handle(err);
            }
        );
    }

    verify(param: any) {
        let searchParam = cloneDeep(param);
        if (!isEmpty(searchParam.orderIds) || !isEmpty(searchParam.receiptIds) || !isEmpty(searchParam.containerNos) ||
            !isEmpty(searchParam.cartonNos) || !isEmpty(searchParam.trailers)) {
            return true;
        }
        if ((!isEmpty(searchParam.itemSpecIds) || !isEmpty(searchParam.destinations)) && !isEmpty(searchParam.status)) {
            return true;
        }
        if (!isEmpty(searchParam.itemSpecIds) || !isEmpty(searchParam.destinations) || !isEmpty(searchParam.customerId)
            || !isEmpty(searchParam.status)) {
            if (!searchParam.timeFrom || !searchParam.timeTo) {
                util.popUpWarningMessage('Please select time from and to.');
                return false;
            }
        }
        return true;
    }

    searchReport() {
        this.searchParam.paging = { pageNo: 1, limit: 10 };
        this.searchGenericTransload();
    }

    exportExcel() {
        if (!this.genericTransloadReport.data || this.genericTransloadReport.data.length === 0) {
            util.popUpWarningMessage("Not data export");
            return;
        }
        this.exportLoading = true;
        let searchParam = this.removeFacilityParamAndFillTitleIdsWhenSearch(cloneDeep(this.searchParam));
        reportService.downloadGenericTransload(searchParam).then(((res: any) => {
            this.exportLoading = false;
            util.exportFile(res, "generic-transload-report.xlsx");
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
        this.searchParam.shipDateFrom = payload.timeFrom;
        this.searchParam.shipDateTo = payload.timeTo;
    }

    onSelectAppointmentDateRange(payload: any) {
        this.searchParam.receiveDateFrom = payload.timeFrom;
        this.searchParam.receiveDateTo = payload.timeTo;
    }

    onSelectInYardDateRange(payload: any) {
        this.searchParam.timeFrom = payload.timeFrom;
        this.searchParam.timeTo = payload.timeTo;
    }



}