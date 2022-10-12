import PredefinedCustomerSelect from "@components/predefined-customer-select/predefined-customer-select";
import PredefinedExportBtn from "@components/predefined-export-btn/predefined-export-btn";
import MultipleOrganizationAutoComplete from "@components/multiple-organization-auto-complete/multiple-organization-auto-complete";
import ItemAutoComplete from "@components/itemspec-auto-complete/itemspec-auto-complete";
import SimplifiedPager from "@components/simplified-pager/simplified-pager";
import CustomizeTable from "@components/customize-table/customize-table";
import FacilitySelect from "@components/facility-select/facility-select";
import ElementSelect from "@components/element-select/element-select";
import MultipleItemAutoComplete from "@components/multiple-item-auto-complete/multiple-item-auto-complete";
import WaittingBtn from "@components/waitting-button/waitting-btn";
import DateRange from "@components/date-range/date-range";
import Pager from "@components/pager/pager";
import errorHandler from "@shared/error-handler";
import CustomerWiseVue from "@shared/customer-wise-vue";
import util from "@shared/util";
import reportService from "@services/report-service";
import inventoryService from "@services/inventory-service";
import { Component } from "vue-property-decorator";
import { map, indexOf, cloneDeep, keyBy, forEach, concat } from "lodash-es";
import tlp from "./activity.vue";

@Component({
    mixins: [tlp],
    components: {
        PredefinedCustomerSelect,
        PredefinedExportBtn,
        MultipleOrganizationAutoComplete,
        ElementSelect,
        SimplifiedPager,
        ItemAutoComplete,
        FacilitySelect,
        DateRange,
        CustomizeTable,
        Pager,
        WaittingBtn,
        MultipleItemAutoComplete,
    }
})
export default class Activity extends CustomerWiseVue {

    activitySearchParam: any = { paging: { pageNo: 1, limit: 10, pageSize: 10 } };
    activityReports: any = {};

    tableFileds: Array<any> = [];
    facilities: Array<any> = [];
    tableHead: any;

    searchResultPaging: any = {};
    loading = false;
    initload = false;
    exportLoading: boolean = false;

    itemLoading: any = {};
    childrenShow: any = {};
    childrenReport: any = {};
    childrenReportPager: any = {};
    itemExcelLoading: boolean = false;

    exportDates: Array<any> = ['Summary Level (.xls)', 'Detail Level(.xls)'];
    onSelectExportName(payload: any) {
        if (this.activitySearchParam.facility.name == "All") {
            let facilities = this.getfacilitiesBySelectedCustomer();
            let facilityIds = map(facilities, "id");
            this.activitySearchParam.facilityIds = facilityIds;
            this.activitySearchParam.facilityName = "valleyview";
            if (payload === 'Summary Level (.xls)') {
                this.exportMultipleSummaryLevelExcel();
            }
            else if (payload === 'Detail Level(.xls)') {
                this.multipleExportDetailLevelExcel();
            }
        } else {
            if (payload === 'Summary Level (.xls)') {
                this.exportSummaryLevelExcel();
            }
            else if (payload === 'Detail Level(.xls)') {
                this.exportDetailLevelExcel();
            }
        }
    }

    showItemLevelTable(key: any, activity: any) {
        this.initChildrenSearch(key);
        if (!this.childrenShow[key]) return;
        let param: any = {};
        param.paging = { pageNo: 1, limit: 10 };
        param.itemSpecId = activity.itemSpecId;
        param.timeFrom = this.activitySearchParam.timeFrom;
        param.timeTo = this.activitySearchParam.timeTo;
        param.customerId = this.activitySearchParam.customerId;
        param.currentQty = activity.currentQty;
        param.titleId = activity.titleId;
        param.supplierId = activity.supplierId;
        if (activity.facilityName) {
            let facilities = this.getfacilitiesBySelectedCustomer();
            facilities = keyBy(facilities, "name");
            param.facilityId = facilities[activity.facilityName].id;
            param.facilityName = facilities[activity.facilityName].accessUrl;
        }
        this.searchInventoryItemActivityReport(key, param);
    }

    private searchInventoryItemActivityReport(key: any, param: any) {

        this.itemLoading[key] = true;
        this.$forceUpdate();
        inventoryService.searchInventoryItemActivityReport(param).subscribe(
            res => {
                this.childrenReport[key] = res.results;
                this.childrenReportPager[key] = { paging: { pageNo: 1, totalCount: res.results.data.length, limit: 10 } };
                this.loadContent(1, key);
                this.itemLoading[key] = false;
                this.$forceUpdate();
            },
            err => {
                errorHandler.handle(err);
            }
        );
    }

    itemActivityCurrentPageDate: any = {};
    private loadContent(currentPage: number, key: string) {
        this.itemActivityCurrentPageDate[key] = this.childrenReport[key].data.slice((currentPage - 1) * this.childrenReportPager[key].paging.limit,
            currentPage * this.childrenReportPager[key].paging.limit > this.childrenReport[key].data.length ? this.childrenReport[key].data.length : currentPage * this.childrenReportPager[key].paging.limit);
        this.$forceUpdate();
    }


    getActivityItemLevelKey(activity: any) {
        return activity.itemSpecId + activity.titleId + activity.supplierId + activity.facilityName;
    }

    searchActivityItemLevelReportFromPager(pager: any) {
        let key = pager.currentDate['itemSpecId'] + pager.currentDate['titleId'] + pager.currentDate['supplierId'];
        let pageNo = pager.currentPage;
        this.childrenReportPager[key].paging.pageNo = pageNo;
        this.childrenReportPager[key].paging.limit = pager.pageSize;
        this.loadContent(pageNo, key);
    }

    getToTalCount(key: any) {
        return this.childrenReportPager[key] ? this.childrenReportPager[key].paging.totalCount : null;
    }

    getPageSize(key: any) {
        return this.childrenReportPager[key] ? this.childrenReportPager[key].paging.limit : 10;
    }

    setPageVisibility(key: any) {
        if (this.childrenReportPager[key] && this.childrenReportPager[key].paging.totalCount > 10) {
            return true;
        } else {
            return false;
        }
    }

    private initChildrenSearch(key: any) {
        this.childrenShow[key] = !this.childrenShow[key];
        this.childrenReport[key] = null;
        this.childrenReportPager[key] = null;
        this.$forceUpdate();
    }

    private initChildren() {
        this.childrenShow = {};
        this.childrenReport = {};
        this.childrenReportPager = {};
        this.itemLoading = {};
    }

    getLeveLData(key: any) {
        return this.childrenReport[key] ? this.childrenReport[key].data : [];
    }

    getLeveLHead(key: any) {
        return this.childrenReport[key] ? this.childrenReport[key].head : [];
    }

    onSelectDateRange(payload: any) {
        this.activitySearchParam.timeFrom = payload.timeFrom;
        this.activitySearchParam.timeTo = payload.timeTo;
        this.searchReport();
    }

    onSelectCustomizeTable(payload: any) {
        let head = map(payload, "fieldName");
        this.tableHead = head;
        this.activityReports.head = head;
    }


    onSelectFacilityChange() {
    }

    onselectCustomerChange(payload: any) {
        this.activitySearchParam.itemSpecId = null;
        this.activitySearchParam.titleIds = [];

    }

    private searchReport() {
        this.activitySearchParam.paging.pageNo = 1;
        this.searchActivityReportByPaging();
    }

    excelByFacilityAll: any = {};

    searchActivityReportByPaging() {
        this.activityReports = [];
        this.searchResultPaging = {};
        this.initChildren();
        this.loading = true;
        if (this.activitySearchParam.facility.name == "All") {
            let activitySearchParam = this.getParamWithFillRelatedTitleIds(cloneDeep(this.activitySearchParam));
            let facilities = this.getfacilitiesBySelectedCustomer();
            facilities = keyBy(facilities, "id");
            let facilityIds = activitySearchParam.facility.id.split(",");
            let length = facilityIds.length;
            activitySearchParam.paging.limit = Math.round(1000 / length);
            let promise: Array<any> = [];
            forEach(facilityIds, function (id) {
                activitySearchParam.facilityId = id;
                activitySearchParam.facilityName = facilities[id].accessUrl.toLowerCase();
                let param = cloneDeep(activitySearchParam);
                promise.push(reportService.searchActivityReportByPaging(param).toPromise());
            });
            let orginInquiryReports: any = { data: [] };
            Promise.all(promise).then(res => {
                for (let i = 0; i < res.length; i++) {
                    forEach(res[i].results.data, function (obj) {
                        obj.facilityId = facilityIds[i];
                        obj.facilityName = facilities[facilityIds[i]].name;
                    });
                }
                forEach(res, function (data) {
                    orginInquiryReports.data = concat(orginInquiryReports.data, data.results.data);
                    orginInquiryReports.head = data.results.head;
                });

                this.activityReports = orginInquiryReports;
                this.excelByFacilityAll = cloneDeep(orginInquiryReports);
                // facility为All 前端分页
                this.searchResultPaging.totalCount = this.excelByFacilityAll.data.length;
                this.activitySearchParam.paging.limit = 10;
                this.loadContentFacilityAll(1);
                this.loading = false;
                this.initTable();
                this.initload = true;
            }, err => {
                errorHandler.handle(err);
                this.loading = false;
            });
        } else {
            let activitySearchParam = this.removeFacilityParamAndFillTitleIdsWhenSearch(cloneDeep(this.activitySearchParam));
            reportService.searchActivityReportByPaging(activitySearchParam).subscribe(
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
    }

    // facility为All 前端分页使用
    private loadContentFacilityAll(currentPage: number) {
        this.activityReports.data = this.excelByFacilityAll.data.slice((currentPage - 1) * this.activitySearchParam.paging.limit, currentPage *
            this.activitySearchParam.paging.limit > this.excelByFacilityAll.data.length ? this.excelByFacilityAll.data.length : currentPage * this.activitySearchParam.paging.limit);
        this.$forceUpdate();
    }

    search() {
        this.activitySearchParam.paging.pageNo = 1;
        this.searchActivityReportByPaging();
    }

    private init() {

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
        if (this.activitySearchParam.facility.name == "All") {
            this.loadContentFacilityAll(this.activitySearchParam.paging.pageNo);
        } else {
            this.searchActivityReportByPaging();
        }
    }

    mounted() {
        this.init();
    }
    linkFields: any = ['Received', 'Shipped', 'Transfer In', 'Transfer Out', 'Adjust In', 'Adjust Out', 'Order/Receipt/Adjustment#'];
    isLinkField(reportDate: any, head: string) {
        if (indexOf(this.linkFields, head) > -1 && reportDate[head]) {
            if (head === 'Order/Receipt/Adjustment#') {
                if (reportDate['Order/Receipt/Adjustment#'].indexOf('ADJUST-') > -1) {
                    return true;
                }
            } else {
                return true;
            }
        }
        return false;
    }

    goInquiryDetail(reportDate: any, head: string) {
        let openNewRouter: any = null;
        if (head === 'Received') {
            openNewRouter = this.$router.resolve({ name: 'InboundInquiry', query: { receiptIds: reportDate.receiptIds, itemSpecId: reportDate.itemSpecId } });
        }
        if (head === 'Shipped') {
            openNewRouter = this.$router.resolve({ name: 'OutboundInquiry', query: { orderIds: reportDate.orderIds, itemSpecId: reportDate.itemSpecId } });
        }
        if (head === 'Transfer In') {
            openNewRouter = this.$router.resolve({ name: 'InboundInquiry', query: { receiptIds: reportDate.transferInReceiptIds, itemSpecId: reportDate.itemSpecId } });
        }
        if (head === 'Transfer Out') {
            openNewRouter = this.$router.resolve({ name: 'OutboundInquiry', query: { orderIds: reportDate.transferOutOrderIds, itemSpecId: reportDate.itemSpecId } });
        }
        if (head === 'Adjust In') {
            openNewRouter = this.$router.resolve({ name: 'Adjustment', query: { titleId: reportDate.titleId, itemSpecId: reportDate.itemSpecId, timeFrom: this.activitySearchParam.timeFrom, timeTo: this.activitySearchParam.timeTo, adjustEffect: 'AdjustIn' } });
        }
        if (head === 'Adjust Out') {
            openNewRouter = this.$router.resolve({ name: 'Adjustment', query: { titleId: reportDate.titleId, itemSpecId: reportDate.itemSpecId, timeFrom: this.activitySearchParam.timeFrom, timeTo: this.activitySearchParam.timeTo, adjustEffect: 'AdjustOut' } });
        }
        if (head === 'Order/Receipt/Adjustment#') {
            openNewRouter = this.$router.resolve({ name: 'Adjustment', query: { adjustId: reportDate['Order/Receipt/Adjustment#'] } });
        }
        window.open(openNewRouter.href, '_blank');
    }

    exportSummaryLevelExcel() {
        this.exportLoading = true;
        let activitySearchParam = this.removeFacilityParamAndFillTitleIdsWhenSearch(cloneDeep(this.activitySearchParam));
        reportService.activityDownLoad(activitySearchParam).then((res => {
            this.exportLoading = false;
            util.exportFile(res, "Inventory-Activity-Summary-Level.xlsx");
        })).catch((err: any) => {
            this.exportLoading = false;
            errorHandler.handle(err);
        });
    }

    exportMultipleSummaryLevelExcel() {
        this.exportLoading = true;
        let activitySearchParam = this.removeFacilityParamAndFillTitleIdsWhenSearch(cloneDeep(this.activitySearchParam));
        reportService.multipleActivityDownLoad(activitySearchParam).then((res => {
            this.exportLoading = false;
            util.exportFile(res, "Inventory-Activity-Summary-Level.xlsx");
        })).catch((err: any) => {
            this.exportLoading = false;
            errorHandler.handle(err);
        });
    }

    exportDetailLevelExcel() {
        this.exportLoading = true;
        let activitySearchParam = this.removeFacilityParamAndFillTitleIdsWhenSearch(cloneDeep(this.activitySearchParam));
        reportService.activityDetailLevelDownLoad(activitySearchParam).then((res => {
            this.exportLoading = false;
            util.exportFile(res, "Inventory-Activity-Detail-Level.xlsx");
        })).catch((err: any) => {
            this.exportLoading = false;
            errorHandler.handle(err);
        });
    }

    multipleExportDetailLevelExcel() {
        this.exportLoading = true;
        let activitySearchParam = this.removeFacilityParamAndFillTitleIdsWhenSearch(cloneDeep(this.activitySearchParam));
        reportService.multipleActivityDetailLevelDownLoad(activitySearchParam).then((res => {
            this.exportLoading = false;
            util.exportFile(res, "Inventory-Activity-Detail-Level.xlsx");
        })).catch((err: any) => {
            this.exportLoading = false;
            errorHandler.handle(err);
        });
    }

    downLoadActivityItemLevel(activity: any) {
        let param: any = {};
        param.paging = { pageNo: 1, limit: 10 };
        param.itemSpecId = activity.itemSpecId;
        param.timeFrom = this.activitySearchParam.timeFrom;
        param.timeTo = this.activitySearchParam.timeTo;
        param.customerId = this.activitySearchParam.customerId;
        param.currentQty = activity.currentQty;
        param.titleId = activity.titleId;
        if (activity.facilityName) {
            let facilities = this.getfacilitiesBySelectedCustomer();
            facilities = keyBy(facilities, "name");
            param.facilityId = facilities[activity.facilityName].id;
            param.facilityName = facilities[activity.facilityName].accessUrl;
        }
        this.itemExcelLoading = true;
        inventoryService.activityItemLevelDownLoad(param).then((res => {
            this.itemExcelLoading = false;
            util.exportFile(res, "Inventory-Activity-Level.xlsx");
        })).catch((err: any) => {
            this.itemExcelLoading = false;
            errorHandler.handle(err);
        });
    }
}