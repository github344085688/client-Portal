import PredefinedCustomerSelect from "../../../../../components/predefined-customer-select/predefined-customer-select";
import OrganizationAutoComplete from "../../../../../components/organization-auto-complete/organization-auto-complete";
import PredefinedExportBtn from "../../../../../components/predefined-export-btn/predefined-export-btn";
import OrderAutoComplete from "../../../../../components/order-auto-complete/order-auto-complete";
import SimplifiedPager from "../../../../../components/simplified-pager/simplified-pager";
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
import { map, compact, find, cloneDeep, difference, forEach } from "lodash-es";
import tlp from "./scheduled.vue";
import { Subject } from "rxjs/Subject";
import "rxjs/add/operator/debounceTime";
import errorHanlder from '../../../../../shared/error-handler';
import constants from '../../../../../shared/constants';
@Component({
    mixins: [tlp],
    components: {
        PredefinedCustomerSelect,
        OrganizationAutoComplete,
        PredefinedExportBtn,
        ElementSelect,
        OrderAutoComplete,
        SimplifiedPager,
        DateRange,
        CustomizeTable,
        FacilitySelect,
        Pager,
        WaittingBtn
    }
})
export default class Scheduled extends WiseVue {

    scheduledSearchParam: any = { paging: { pageNo: 1, limit: 10 } };
    scheduledReports: any = {};
    shippingStatus: Array<any> = [{ name: 'All' }, { name: 'Imported', dbName: 'IMPORTED' }, { name: 'Open', dbName: 'OPEN' }, { name: 'Committed', dbName: 'COMMITTED' },
    { name: 'Partial Committed', dbName: 'PARTIAL_COMMITTED' }, { name: 'Commit Blocked', dbName: 'COMMIT_BLOCKED' }, { name: 'Commit Failed', dbName: 'COMMIT_FAILED' }, { name: 'On Hold', dbName: 'ON_HOLD' }
        , { name: 'Planned', dbName: 'PLANNED' }, { name: 'Picking', dbName: 'PICKING' }, { name: 'Picked', dbName: 'PICKED' }
        , { name: 'Packing', dbName: 'PACKING' }, { name: 'Packed', dbName: 'PACKED' }, { name: 'Loading', dbName: 'LOADING' }
        , { name: 'Loaded', dbName: 'LOADED' }, { name: 'Reopen', dbName: 'REOPEN' }, { name: 'Cancelled', dbName: 'CANCELLED' }];
    tableFileds: Array<any> = [];
    facilities: Array<any> = [];
    tableHead: any;

    searchResultPaging: any = {};

    loading = false;
    initload = false;
    customerIds: Array<string> = [];
    exportLoading: boolean = false;
    searchTrackingNumbers: Subject<void> = new Subject();
    exportDates: Array<any> = ['Order Level (.xls)', 'Item Level (.xls)'];
    onSelectExportName(payload: any) {

        if (payload === 'Order Level (.xls)') {
            this.exportOrderLevelExcel();
        }
        else if (payload === 'Item Level (.xls)') {
            this.exportItemLevelExcel();
        }
    }
    onSelectScheduledDateRange(payload: any) {
        this.scheduledSearchParam.scheduleDateFrom = payload.timeFrom;
        this.scheduledSearchParam.scheduleDateTo = payload.timeTo;
        this.resetScheduledParamAndsearchReport();
    }

    onSelectOrderDateRange(payload: any) {
        this.scheduledSearchParam.orderedDateFrom = payload.timeFrom;
        this.scheduledSearchParam.orderedDateTo = payload.timeTo;
        this.resetScheduledParamAndsearchReport();
    }

    onSelectOrderStatus(payload: any) {

        if (payload === "All") {
            this.scheduledSearchParam.statuses = compact(map(this.shippingStatus, 'dbName'));
        } else {
            let data: any = find(this.shippingStatus, { name: payload });
            this.scheduledSearchParam.statuses = [data.dbName];

        }
        this.resetScheduledParamAndsearchReport();
    }

    onSelectCustomizeTable(payload: any) {
        let head = map(payload, "fieldName");
        this.tableHead = head;
        this.scheduledReports.head = head;
    }

    onSelectFacilityChange(payload: any) {

        if (this.scheduledSearchParam.orderId) {
            delete this.scheduledSearchParam.orderId;
        }
        this.resetScheduledParamAndsearchReport();
    }

    onOrderSelectChange(payload: any) {
        this.resetScheduledParamAndsearchReport();
    }

    onselectCustomerChange(payload: any) {
        this.resetScheduledParamAndsearchReport();
    }

    keyUp() {
        this.resetScheduledParamAndsearchReport();
    }

    searchOutboundScheduleReportByPaging() {

        this.scheduledReports = [];
        this.searchResultPaging = [];
        this.initReceiptChildItem();
        this.loading = true;
        let searchParam = cloneDeep(this.scheduledSearchParam);
        if (searchParam.orderId) {
            searchParam.orderIds = [searchParam.orderId];
        }
        if (searchParam.retailerId) {
            searchParam.retailerIds = [searchParam.retailerId];
        }
        if (searchParam.useless) {
            delete searchParam.useless;
        }
        if (searchParam.hasOwnProperty('orderId')) {
            delete searchParam.orderId;
        }
        reportService.searchOutboundScheduleReportByPaging(searchParam, this.scheduledSearchParam.facility.accessUrl).subscribe(
            res => {
                this.scheduledReports = res.results;
                this.searchResultPaging = res.paging;
                this.loading = false;
                this.initTableBySelectedHead();
                this.initload = true;
            },
            err => {
                this.loading = false;
                errorHandler.handle(err);
            }
        );
    }

    private init() {
        let currentDate = new Date();
        currentDate.setTime(currentDate.getTime() - 24 * 60 * 60 * 1000 * 6);
        this.scheduledSearchParam.scheduleDateTo = util.fomateEndDate(new Date());
        this.scheduledSearchParam.scheduleDateFrom = util.fomateStartDate(currentDate);
        this.scheduledSearchParam.statuses = compact(map(this.shippingStatus, 'dbName'));
        this.scheduledSearchParam.useless = 'All';
        this.customerIds = this.getCustomerIds();
        this.searchOutboundScheduleReportByPaging();
    }

    private resetScheduledParamAndsearchReport() {
        this.scheduledSearchParam.paging = { pageNo: 1, limit: 10 };
        this.searchOutboundScheduleReportByPaging();
    }

    private initTableBySelectedHead() {

        if (this.initload) {
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

    triggerSearchFromPager(pager: any) {
        this.scheduledSearchParam.paging.limit = pager.pageSize;
        this.scheduledSearchParam.paging.pageNo = pager.currentPage;
        this.searchOutboundScheduleReportByPaging();
    }


    itemLoading: any = {};
    childItemShow: any = {};
    itemLevelReport: any = {};
    itemLevelReportPager: any = {};

    showChildItemTable(orderId: any) {

        let showChild: any = {};
        showChild[orderId] = !this.childItemShow[orderId];
        this.childItemShow = Object.assign({}, this.childItemShow, showChild);
        if (!showChild[orderId]) {
            this.itemLevelReport[orderId] = null;
            this.itemLevelReportPager[orderId] = null;
            return;
        }

        let param: any = { paging: { pageNo: 1, limit: 10 } };
        param.orderId = orderId;
        this.searchOutboundScheduleItemLineByPaging(param);
    }

    searchItemLevelReportFromPager(pager: any) {
        let param: any = { paging: { pageNo: 1, limit: 10 } };
        if (pager.keyId && this.itemLevelReportPager[pager.keyId]) {
            param = this.itemLevelReportPager[pager.keyId];
            param.paging.limit = pager.pageSize;
            param.paging.pageNo = pager.currentPage;
            param.orderId = pager.keyId;
            this.searchOutboundScheduleItemLineByPaging(param);
        }

    }

    private initReceiptChildItem() {
        this.itemLoading = {};
        this.childItemShow = {};
        this.itemLevelReport = {};
        this.itemLevelReportPager = {};
    }

    private searchOutboundScheduleItemLineByPaging(param: any) {
        this.itemLoading[param.orderId] = true;
        reportService.searchOutboundScheduleItemLineByPaging(param, this.scheduledSearchParam.facility.accessUrl).subscribe(
            res => {
                this.itemLevelReport[param.orderId] = res.results;
                this.itemLevelReportPager[param.orderId] = { paging: res.paging };
                let loadingEnd: any = {};
                loadingEnd[param.orderId] = false;
                this.itemLoading = Object.assign({}, this.itemLoading, loadingEnd);
            },
            err => {
                errorHandler.handle(err);
            }
        );
    }

    getToTalCount(orderId: any) {
        return this.itemLevelReportPager[orderId] ? this.itemLevelReportPager[orderId].paging.totalCount : null;
    }

    getPageSize(orderId: any) {
        return this.itemLevelReportPager[orderId] ? this.itemLevelReportPager[orderId].paging.pageSize : 10;
    }

    setPageVisibility(orderId: any) {

        if (this.itemLevelReportPager[orderId] && this.itemLevelReportPager[orderId].paging.totalCount > 10) {
            return true;
        } else {
            return false;
        }
    }

    getItemLeveLData(orderId: any) {
        return this.itemLevelReport[orderId] ? this.itemLevelReport[orderId].data : [];
    }

    getItemLeveLHead(orderId: any) {

        return this.itemLevelReport[orderId] ? difference(this.itemLevelReport[orderId].head, this.scheduledReports.head) : [];
    }

    clickTrackingNo(carrierName: any, trackingNo: any) {

        if (carrierName === 'UPSN') {
            window.open("https://wwwapps.ups.com/WebTracking/track?track=yes&trackNums=" + trackingNo.replace(/,/g, "%0a"));
        } else if (carrierName === 'FDEG') {
            window.open("https://www.fedex.com/apps/fedextrack/?tracknumbers=" + trackingNo);
        }
    }

    mounted() {
        this.init();
        this.searchTrackingNumbers.debounceTime(constants.debounceTime).subscribe(
            this.searchTrackingNumber,
            err => {
                errorHanlder.handle(err);
            }
        );
    }

    searchTrackingNumber() {
        this.resetScheduledParamAndsearchReport();
    }

    exportItemLevelExcel() {
        this.exportLoading = true;
        reportService.outboundScheduleDownLoadByItemLineLevel(this.scheduledSearchParam, this.scheduledSearchParam.facility.accessUrl).then((res => {
            this.exportLoading = false;
            util.exportFile(res, "outbound-itemLevel-Scheduled.xlsx");
        })).catch(err => {
            this.exportLoading = false;
            errorHandler.handle(err);
        });
    }

     exportOrderLevelExcel() {
        this.exportLoading = true;
        reportService.outboundScheduleDownLoadByOrderLevel(this.scheduledSearchParam, this.scheduledSearchParam.facility.accessUrl).then((res => {
            this.exportLoading = false;
            util.exportFile(res, "outbound-orderLevel-Scheduled.xlsx");
        })).catch(err => {
            this.exportLoading = false;
            errorHandler.handle(err);
        });
    }
}