import PredefinedCustomerSelect from "../../../../../components/predefined-customer-select/predefined-customer-select";
import PredefinedExportBtn from "../../../../../components/predefined-export-btn/predefined-export-btn";
import ReceiptAutoComplete from "../../../../../components/receipt-auto-complete/receipt-auto-complete";
import CustomizeTable from "../../../../../components/customize-table/customize-table";
import ElementSelect from "../../../../../components/element-select/element-select";
import FacilitySelect from "../../../../../components/facility-select/facility-select";
import WaittingBtn from "../../../../../components/waitting-button/waitting-btn";
import SimplifiedPager from "../../../../../components/simplified-pager/simplified-pager";
import DateRange from "../../../../../components/date-range/date-range";
import Pager from "../../../../../components/pager/pager";
import errorHandler from "../../../../../shared/error-handler";
import WiseVue from "../../../../../shared/wise-vue";
import session from "../../../../../shared/session";
import util from "../../../../../shared/util";
import reportService from "../../../../../services/report-service";
import { Component, Prop, Provide } from "vue-property-decorator";
import { map, compact, find, cloneDeep, forEach, difference } from "lodash-es";
import tlp from "./scheduled.vue";

@Component({
    mixins: [tlp],
    components: {
        ElementSelect,
        PredefinedCustomerSelect,
        PredefinedExportBtn,
        ReceiptAutoComplete,
        FacilitySelect,
        DateRange,
        CustomizeTable,
        Pager,
        WaittingBtn,
        SimplifiedPager
    }
})
export default class Scheduled extends WiseVue {

    scheduledSearchParam: any = { paging: { pageNo: 1, limit: 10 } };
    scheduledReports: any = {};
    receiptStatus: Array<any> = [{ name: 'All' }, { name: 'Imported', dbName: 'IMPORTED' }, { name: 'Open', dbName: 'OPEN' }, { name: 'Appointment Made', dbName: 'APPOINTMENT_MADE' }];
    tableFileds: Array<any> = [];
    facilities: Array<any> = [];
    exportDates: Array<any> = ['Receipt Level (.xls)', 'Item Level (.xls)'];
    tableHead: any;

    searchResultPaging: any = {};

    loading = false;
    initTableHead = false;
    customerIds: Array<string> = [];
    exportLoading: boolean = false;

    onSelectExportName(payload: any) {

        if (payload === 'Receipt Level (.xls)') {
            this.exportReceiptLevelExcel();
        }
        else if (payload === 'Item Level (.xls)') {
            this.exportItemLevelExcel();
        }
    }
    onSelectDateRange(payload: any) {
        this.scheduledSearchParam.createdTimeFrom = payload.timeFrom;
        this.scheduledSearchParam.createdTimeTo = payload.timeTo;
        this.resetScheduledParamAndsearchReport();
    }

    onselectReceiptStatus(payload: any) {

        if (payload === "All") {
            this.scheduledSearchParam.receiptStatuses = compact(map(this.receiptStatus, 'dbName'));
        } else {
            let data: any = find(this.receiptStatus, { name: payload });
            this.scheduledSearchParam.receiptStatuses = [data.dbName];

        }
        this.resetScheduledParamAndsearchReport();
    }

    onSelectCustomizeTable(payload: any) {
        let head = map(payload, "fieldName");
        this.tableHead = head;
        this.scheduledReports.head = head;
    }

    onReceiptSelectChange(payload: any) {

        if (!payload) {
            if (this.scheduledSearchParam.receiptId) {
                delete this.scheduledSearchParam.receiptId;
            }
        } else {
            this.scheduledSearchParam.receiptIds = [payload.id];
        }

        this.resetScheduledParamAndsearchReport();
    }

    onSelectFacilityChange(payload: any) {
        if (this.scheduledSearchParam.receiptIds) {
            delete this.scheduledSearchParam.receiptIds;
        }
        this.resetScheduledParamAndsearchReport();
    }

    onselectCustomerChange(payload: any) {
        this.resetScheduledParamAndsearchReport();
    }

    triggerSearchFromPager(pager: any) {
        this.scheduledSearchParam.paging.limit = pager.pageSize;
        this.scheduledSearchParam.paging.pageNo = pager.currentPage;
        this.searchReceiptLevelReportByPaging();
    }

    searchReceiptLevelReportByPaging() {
        this.scheduledReports = [];
        this.searchResultPaging = [];
        this.initReceiptChildItem();
        this.loading = true;
        let searchParam = cloneDeep(this.scheduledSearchParam);
        if (searchParam.useless) {
            delete searchParam.useless;
        }
        reportService.searchReceiptLevelReportByPaging(searchParam, this.scheduledSearchParam.facility.accessUrl).subscribe(
            res => {
                this.searchResultPaging = res.paging;
                this.scheduledReports = res.results;
                this.initTableBySelectedHead();
                this.loading = false;
                this.initTableHead = true;
            },
            err => {
                this.loading = false;
                errorHandler.handle(err);
            }
        );
    }

    private resetScheduledParamAndsearchReport() {
        this.scheduledSearchParam.paging = { pageNo: 1, limit: 10 };
        this.searchReceiptLevelReportByPaging();
    }

    private initTableBySelectedHead() {

        if (this.initTableHead) {
            if (this.tableHead) {
                this.scheduledReports.head = this.tableHead;
            }

        } else {
            this.scheduledReports.head.forEach((head: any) => {
                let field = { fieldId: head, fieldName: head, checked: true };
                this.tableFileds.push(field);
            });
        }
    }

    private initReceiptChildItem() {
        this.itemLoading = {};
        this.childItemShow = {};
        this.itemLevelReport = {};
        this.itemLevelReportPager = {};
    }

    private exportReceiptLevelExcel() {
        this.exportLoading = true;
        reportService.receiptLevelDownLoad(this.scheduledSearchParam, this.scheduledSearchParam.facility.accessUrl).then((res => {
            this.exportLoading = false;
            util.exportFile(res, "Inbound-Receipt-Level-Scheduled.xlsx");
        })).catch(err => {
            this.exportLoading = false;
            errorHandler.handle(err);
        });
    }

    private exportItemLevelExcel() {
        this.exportLoading = true;
        reportService.itemLevelDownLoad(this.scheduledSearchParam, this.scheduledSearchParam.facility.accessUrl).then((res => {
            this.exportLoading = false;
            util.exportFile(res, "Inbound-Item-Level-Scheduled.xlsx");
        })).catch(err => {
            this.exportLoading = false;
            errorHandler.handle(err);
        });
    }

    itemLoading: any = {};
    childItemShow: any = {};
    itemLevelReport: any = {};
    itemLevelReportPager: any = {};

    showChildItemTable(receiptId: any) {

        let showChild: any = {};
        showChild[receiptId] = !this.childItemShow[receiptId];
        this.childItemShow = Object.assign({}, this.childItemShow, showChild);
        if (!showChild[receiptId]) return;
        this.itemLevelReport[receiptId] = null;
        this.itemLevelReportPager[receiptId] = null;
        let param: any = { paging: { pageNo: 1, limit: 10 } };
        param.receiptIds = [receiptId];
        this.searchItemLevelReportByPaging(param);
    }

    searchItemLevelReportFromPager(pager: any) {
        let param: any = { paging: { pageNo: 1, limit: 10 } };
        if (pager.keyId && this.itemLevelReportPager[pager.keyId]) {
            param = this.itemLevelReportPager[pager.keyId];
            param.paging.limit = pager.pageSize;
            param.paging.pageNo = pager.currentPage;
            param.receiptIds = [pager.keyId];
            this.searchItemLevelReportByPaging(param);
        }

    }

    private searchItemLevelReportByPaging(param: any) {
        this.itemLoading[(param.receiptIds).toString()] = true;
        param.reportType = "INBOUND_SCHEDULE";
        reportService.searchItemLevelReportByPaging(param, this.scheduledSearchParam.facility.accessUrl).subscribe(
            res => {
                this.itemLevelReport[(param.receiptIds).toString()] = res.results;
                this.itemLevelReportPager[(param.receiptIds).toString()] = { paging: res.paging };
                let loadingEnd: any = {};
                loadingEnd[(param.receiptIds).toString()] = false;
                this.itemLoading = Object.assign({}, this.itemLoading, loadingEnd);
            },
            err => {
                errorHandler.handle(err);
            }
        );
    }

    private init() {

        let currentDate = new Date();
        currentDate.setTime(currentDate.getTime() - 24 * 60 * 60 * 1000 * 6);
        this.scheduledSearchParam.createdTimeFrom = util.fomateStartDate(currentDate);
        this.scheduledSearchParam.createdTimeTo = util.fomateEndDate(new Date());
        this.scheduledSearchParam.receiptStatuses = compact(map(this.receiptStatus, 'dbName'));
        this.scheduledSearchParam.reportType = "INBOUND_SCHEDULE";
        this.scheduledSearchParam.useless = 'All';
        this.customerIds = this.getCustomerIds();
        this.searchReceiptLevelReportByPaging();
    }

    getToTalCount(receiptId: any) {
        return this.itemLevelReportPager[receiptId] ? this.itemLevelReportPager[receiptId].paging.totalCount : null;
    }

    getPageSize(receiptId: any) {
        return this.itemLevelReportPager[receiptId] ? this.itemLevelReportPager[receiptId].paging.pageSize : 10;
    }

    setPageVisibility(receiptId: any) {
        if (this.itemLevelReportPager[receiptId] && this.itemLevelReportPager[receiptId].paging.totalCount > 10) {
            return true;
        } else {
            return false;
        }
    }

    getItemLeveLData(receiptId: any) {
        return this.itemLevelReport[receiptId] ? this.itemLevelReport[receiptId].data : [];
    }

    getItemLeveLHead(receiptId: any) {
        return this.itemLevelReport[receiptId] ? difference(this.itemLevelReport[receiptId].head, this.scheduledReports.head) : [];
    }
    mounted() {
        this.init();
    }

}