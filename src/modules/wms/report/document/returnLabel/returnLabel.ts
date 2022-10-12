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
import { indexOf, cloneDeep, filter, find, remove, map } from "lodash-es";
import TagsInput from "@components/tags-input/tags-input";

import tlp from "./returnLabel.vue";
// import { map } from "rxjs/operator/map";

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
        TagsInput
    }
})
export default class ScheduleSummary extends CustomerWiseVue {

    paging: any = { pageNo: 1, limit: 10, totalCount: 0 };
    searchParam: any = {};
    currentPageDates: any = [];
    dataReports: any = { data: [] };
    facilities: Array<any> = [];
    pageOptions: Array<any> = [10, 50, 100];
    orderItemLineDynamicFields: any = {};

    loading = false;
    exportLoading: boolean = false;

    onSelectFacilityChange(payload: any) {
        // this.searchReport();
    }

    onselectCustomerChange(payload: any) {
        this.searchParam.titleIds = [];
        this.orderItemLineDynamicFields = {};
        this.orderItemLineDynamicFields = payload.orderItemLineDynamicFields || {};
        // this.searchReport();
    }

    triggerSearchFromPager(pager: any) {
        this.paging.limit = pager.pageSize;
        this.paging.pageNo = pager.currentPage;
        this.searchDocumentReturnLabel();
    }


    searchDocumentReturnLabel() {
        this.dataReports = { data: [] };
        this.loading = true;
        let searchParam = this.removeFacilityParamAndFillTitleIdsWhenSearch(cloneDeep(this.searchParam));
        searchParam.paging = this.paging;
        InboundService.searchDocumentReturnLabel(searchParam).subscribe(
            res => {
                this.dataReports = res.results;
                this.paging = res.paging ? res.paging : { pageNo: 1, limit: 10, totalCount: 0 };
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
        this.searchDocumentReturnLabel();
    }

    batchDownload() {
        if (this.selectedInquirys.length == 0) {
            util.popUpWarningMessage('Please Select at least one return label.');
            return;
        }
        this.exportLoading = true;
        let trackingNos = map(this.selectedInquirys, "Return Label");
        let searchParam = { trackingNos: trackingNos };
        InboundService.batchDownloadDocumentReturnLabel(searchParam).then((res => {
            this.exportLoading = false;
            util.exportFile(res, "rerturnLabel.rar");
        })).catch(err => {
            this.exportLoading = false;
            errorHandler.handle(err);
        });
    }

    download(data: any) {
        if (!data['Return Label']) {
            return;
        }
        this.exportLoading = true;
        InboundService.downloadDocumentReturnLabel(data['Return Label']).then((res => {
            this.exportLoading = false;
            util.exportFile(res, data['SOIDS'][0] + ".pdf");
        })).catch(err => {
            this.exportLoading = false;
            errorHandler.handle(err);
        });
    }

    getNames(data: any) {
        if (Array.isArray(data)) {
            return data.join(", ");
        } else {
            return data;
        }
    }

    isSelectedAll: boolean = false;
    selectedInquirys: Array<any> = [];
    selectAll() {
        this.isSelectedAll = !this.isSelectedAll;
        if (this.isSelectedAll) {
            let orginDate = filter(this.dataReports.data, 'Return Label');
            this.selectedInquirys = orginDate;
        } else {
            this.selectedInquirys = [];
        }
    }

    isChecked(receivedInquiry: any) {
        let isContain = find(this.selectedInquirys, { "Return Label": receivedInquiry['Return Label'] });
        if (!isContain) {
            return false;
        }
        return true;
    }

    selectSingle(receivedInquiry: any) {
        let isContain = find(this.selectedInquirys, { "Return Label": receivedInquiry['Return Label'] });
        if (!isContain) {
            this.selectedInquirys.push(receivedInquiry);
            let orginDate = filter(this.dataReports.data, 'Return Label');
            if (this.selectedInquirys.length > 0 && this.selectedInquirys.length === orginDate.length) {
                this.isSelectedAll = true;
            }
        } else {
            remove(this.selectedInquirys, (select: any) => select['Return Label'] == receivedInquiry['Return Label']);
            this.isSelectedAll = false;
        }
        this.$forceUpdate();
    }


    // private init() {
    //     // this.searchParam.reportCategory = "INBOUND_SCHEDULE_SUMMARY";
    //     // this.searchDocumentReturnLabel();
    // }
    // mounted() {
    //     this.init();
    // }

}