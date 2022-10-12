
import PredefinedCustomerSelect from "@components/predefined-customer-select/predefined-customer-select";
import MultipleOrganizationAutoComplete from "@components/multiple-organization-auto-complete/multiple-organization-auto-complete";
import PredefinedTableLayout from "@components/predefined-table-layout/predefined-table-layout";
import ItemAutoComplete from "@components/itemspec-auto-complete/itemspec-auto-complete";
import PredefinedExportBtn from "@components/predefined-export-btn/predefined-export-btn";
import ReceiptAutoComplete from "@components/receipt-auto-complete/receipt-auto-complete";
import SimplifiedPager from "@components/simplified-pager/simplified-pager";
import CustomizeTable from "@components/customize-table/customize-table";
import FacilitySelect from "@components/facility-select/facility-select";
import ElementSelect from "@components/element-select/element-select";
import WaittingBtn from "@components/waitting-button/waitting-btn";
import DateRange from "@components/date-range/date-range";
import TagsInput from "@components/tags-input/tags-input";
import errorHandler from "@shared/error-handler";
import Pager from "@components/pager/pager";
import CustomerWiseVue from "@shared/customer-wise-vue";
import { Component } from "vue-property-decorator";
import util from "@shared/util";
import { cloneDeep, remove, forEach, groupBy, find, filter, keyBy, concat, indexOf, isEmpty } from "lodash-es";
import outboundService from "@services/outbound-service";
import fileService from "@services/file-service";
import { Subject, Observable } from "rxjs";
import "rxjs/add/operator/debounceTime";
import tlp from "./inquiry.vue";
import reportUtil from "@shared/report-util";
import PopUpWindows from "@components/pop-up-windows/pop-up-windows";
import TableDragDrop from "@components/table-drag-drop/table-drag-drop";

@Component({
    mixins: [tlp],
    components: {
        PredefinedCustomerSelect,
        PredefinedTableLayout,
        PredefinedExportBtn,
        ElementSelect,
        ReceiptAutoComplete,
        FacilitySelect,
        DateRange,
        CustomizeTable,
        Pager,
        TagsInput,
        WaittingBtn,
        SimplifiedPager,
        ItemAutoComplete,
        MultipleOrganizationAutoComplete,
        PopUpWindows,
        TableDragDrop
    }
})
export default class OutboundInqury extends CustomerWiseVue {

    searchParam: any = {
        paging: {pageNo: 1, limit: 10},
        reportCategory: 'OUTBOUND_INQUIRY',
        loadStatuses: []
    };
    inquiryReports: any = {};
    statues: Array<any> = ['Imported', 'Open', 'Committed', 'Partial Committed', 'Commit Blocked', 'Commit Failed', 'Pending', 'On Hold', 'Planning', 'Planned', 'Picking', 'Picked', 'Packing', 'Packed', 'Staged', 'Loading', 'Loaded', 'Partial Shipped', 'Short Shipped', 'Shipped', 'Closed', 'Cancelled', 'Reopen', 'Exception'];
    loadStatues: Array<any> = ['New', 'Window Checkin Done', 'Loading', 'Loaded', 'Shipped', 'Cancelled'];
    facilities: Array<any> = [];
    searchResultPaging: any = {};
    modeType: string = "";
    loading = false;
    customizeComplete = false;
    customerIds: Array<string> = [];
    exportLoading: boolean = false;
    searchByInput: Subject<void> = new Subject();
    itemSNDetails: any = {};
    ItemShowSNDetais: any = {};
    ItemSNDetailoading: any = {};
    exportDates: Array<any> = ['Expanding Level(.xls)'];
    itemExcelLoadingObj: any = {};
    excelByFacilityAll: any = {};
    attachmentOrder: any = {};
    customizitionTableView: any = {};
    cancelNote: String = '';
    orderId: String = '';
    sortingField: any = {};
    popUpConfig: any = {
        isShow: false,
        submitFunc: () => {},
        height: 0,
        title: '',
        isSubmit: false,
        cancelFunc: function() {
            this.isShow = false;
        },
        modal: ''
    };
    onSelectExportName(payload: any) {
        this.exportLoading = true;
        if (this.searchParam.facility.name == "All") {
            let param = this.getParamWithFillRelatedTitleIds(cloneDeep(this.searchParam));
            this.deleteParams(param);
            param.headerList = reportUtil.getExcelColumnList(this.customizitionTableView);
            let facilities = this.getfacilitiesBySelectedCustomer();
            facilities = keyBy(facilities, "id");
            let facilityIds = param.facility.id.split(",");
            param.facilityName = "valleyview";
            param.facilityIds = facilityIds;
            if (indexOf(param.headerList, "Facility") == -1) {
                param.headerList.unshift("Facility");
            }
            param = this.addOrderIds(param);
            outboundService.multipleFacilityDownload(param).then(res => {
                this.exportLoading = false;
                util.exportFile(res, "Outbound-Inquiry-Expanding.xlsx");
            }, err => {
                this.exportLoading = false;
                errorHandler.handle(err);
            });
        }
        else {
        this.exportExcel(payload).then((res => {
            this.exportLoading = false;
            if (payload === 'Order Level (.xls)') {
                util.exportFile(res, "Outbound-Inquiry-Order-Level.xlsx");
            }
            else if (payload === 'Item Level (.xls)') {
                util.exportFile(res, "Outbound-Inquiry-Item-Level.xlsx");
            }
            else if (payload === 'ID Level (.xls)') {
                util.exportFile(res, "Outbound-Inquiry-ID-Level.xlsx");
            }
            else if (payload === 'Carton Level (.xls)') {
                util.exportFile(res, "Outbound-Inquiry-Carton-Level.xlsx");
            }
            else if (payload === 'Expanding Level(.xls)') {
                util.exportFile(res, "Outbound-Inquiry-Expanding.xlsx");
            }
        })).catch(err => {
            this.exportLoading = false;
            errorHandler.handle(err);
        });
    }
    }

    addOrderIds(params: any) {
        if (this.selectedInquirys.length) {
            params.orderIds = [];
            forEach(this.selectedInquirys, (item) => {
                params.orderIds.push(item.orderId);
            });
        }
        return params;
    }

    onSelectCreateDateRange(payload: any) {
        this.searchParam.createdWhenFrom = payload.timeFrom;
        this.searchParam.createdWhenTo = payload.timeTo;
        // this.searchReport();
    }

    onSelectAppointmentDateRange(payload: any) {
        this.searchParam.appointmentTimeFrom = payload.timeFrom;
        this.searchParam.appointmentTimeTo = payload.timeTo;
        // this.searchReport();
    }

    onSelectMabdDateRange(payload: any) {
        this.searchParam.mabdFrom = payload.timeFrom;
        this.searchParam.mabdTo = payload.timeTo;
        // this.searchReport();
    }

    onSelectLoadCompleteDateRange(payload: any) {
        this.searchParam.shippedTimeFrom = payload.timeFrom;
        this.searchParam.shippedTimeTo = payload.timeTo;
        // this.searchReport();
    }

    onSelectStatus(payload: any) {
        // this.searchReport();
    }

    onSelectCustomizeTable(payload: any) {
        this.customizitionTableView = payload;
        let querys = this.$route.query;
        if (querys) {
            if (querys.orderIds) {
                this.searchParam.orderIds = querys.orderIds;
                if (typeof querys.orderIds === 'string') {
                    this.searchParam.orderIds = [querys.orderIds];
                }
            }
            if (querys.itemSpecId) {
                this.searchParam.itemSpecIds = [querys.itemSpecId];
                this.searchParam.itemSpecId = querys.itemSpecId;
            }
            if (querys.titleId) {
                this.searchParam.titleIds = [querys.titleId];
            }
            this.searchReport();
        } else {
            if (!this.customizitionTableView.isFirstInit) {
                this.searchReport();
            }
        }
        this.customizeComplete = true;

    }

    onSelectFacilityChange(payload: any) {
        // this.searchReport();
    }

    isSelectItem: boolean = false;
    onselectCustomerChange(payload: any) {
        // this.searchReport();
        this.searchParam.titleIds = [];
        this.searchParam.itemSpecId = null;
        this.isSelectItem = true;
        this.customizeComplete = false;
    }

    selectedLayout: any = null;
    onGroupViewLayoutChange(layout: any) {
        this.selectedLayout = layout;
        if (!layout || !layout.groupColumns || layout.groupColumns.length === 0) {
            this.setInitGroupReport();
        } else {
            this.inquiryReports.data = reportUtil.getReOrgGroupTableSource(this.orginInquiryReports.data, layout);
        }
    }

    tableModeName: string = 'Nested Layout';
    onViewModeChange(viewModeName: any) {
        this.tableModeName = viewModeName;
        this.searchReport();
    }

    dragStart(event: any) {
        event.dataTransfer.setData("Text", event.target.innerText);
    }

    orginInquiryReports: any = [];
    private searchOutboundInquiryOrderLevelReportByPaging() {
        if (!this.searchParam.headerList.length) {
            errorHandler.handle('Please Select at least one criteria for each customize column.');
            return;
        }
        this.inquiryReports = [];
        this.searchResultPaging = [];
        this.initOrderChildItem();
        this.loading = true;
        if (this.searchParam.facility.name == "All") {
            let searchParam = this.getParamWithFillRelatedTitleIds(cloneDeep(this.searchParam));
            this.deleteParams(searchParam);
            let facilities = this.getfacilitiesBySelectedCustomer();
            facilities = keyBy(facilities, "id");
            let facilityIds = searchParam.facility.id.split(",");
            let length = facilityIds.length;
            searchParam.paging.limit = Math.round(1000 / length);
            let promise: Array<any> = [];
            forEach(facilityIds, function (id) {
                searchParam.facilityId = id;
                searchParam.facilityName = facilities[id].accessUrl.toLowerCase();
                let param = cloneDeep(searchParam);
                promise.push(outboundService.searchOutboundInquiryOrderLevelReportByPaging(param).toPromise());
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
                this.orginInquiryReports = orginInquiryReports;
                this.inquiryReports = this.addHeadOption(cloneDeep(orginInquiryReports));
                this.excelByFacilityAll = cloneDeep(orginInquiryReports);
                this.isSelectedAll = false;
                this.selectedInquirys = [];

                // facility为All 前端分页
                this.searchResultPaging.totalCount = this.excelByFacilityAll.data.length;
                this.searchParam.paging.limit = 10;
                this.loadContentFacilityAll(1);

                this.loading = false;
            }, err => {
                errorHandler.handle(err);
                this.loading = false;
            });
        } else {
        let searchParam = this.removeFacilityParamAndFillTitleIdsWhenSearch(cloneDeep(this.searchParam));
        this.deleteParams(searchParam);
        outboundService.searchOutboundInquiryOrderLevelReportByPaging(searchParam).subscribe(
            res => {
                this.orginInquiryReports = cloneDeep(res.results);
                this.selectedInquirys = [];
                this.isSelectedAll = false;
                this.inquiryReports = this.addHeadOption(res.results);
                this.searchResultPaging = res.paging;
                this.setInitGroupReport();
                this.loading = false;
            },
            err => {
                this.loading = false;
                errorHandler.handle(err);
            }
        );
    }
    }

    addHeadOption = function (params: Object) {
        for (let[ key, value ] of Object.entries(params)) {
            if ( key === 'head' ) {
                value = Array.prototype.concat.apply(['Action', ''], value );
            }
            Object.assign(params, {[key]: value});
        }
        return params;
    };

    private searchInquiryExpandingReportByPaging() {
        if (!this.searchParam.headerList.length) {
            errorHandler.handle('Please Select at least one criteria for each customize column.');
            return;
        }
        this.inquiryReports = [];
        this.searchResultPaging = [];
        this.initOrderChildItem();
        this.loading = true;
        if (this.searchParam.facility.name == "All") {
            let searchParam = this.getParamWithFillRelatedTitleIds(cloneDeep(this.searchParam));
            this.deleteParams(searchParam);
            let facilities = this.getfacilitiesBySelectedCustomer();
            facilities = keyBy(facilities, "id");
            let facilityIds = searchParam.facility.id.split(",");
            let length = facilityIds.length;
            searchParam.paging.limit = Math.round(1000 / length);
            let promise: Array<any> = [];
            forEach(facilityIds, function (id) {
                searchParam.facilityId = id;
                searchParam.facilityName = facilities[id].accessUrl.toLowerCase();
                let param = cloneDeep(searchParam);
                promise.push(outboundService.searchOutboundInquiryExpandingReportByPaging(param).toPromise());
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
                this.orginInquiryReports = orginInquiryReports;
                this.inquiryReports = this.addHeadOption(cloneDeep(orginInquiryReports));
                this.excelByFacilityAll = cloneDeep(orginInquiryReports);
                this.isSelectedAll = false;
                this.selectedInquirys = [];

                // facility为All 前端分页
                this.searchResultPaging.totalCount = this.excelByFacilityAll.data.length;
                this.searchParam.paging.limit = 10;
                this.loadContentFacilityAll(1);

                this.loading = false;
            }, err => {
                errorHandler.handle(err);
                this.loading = false;
            });
        } else {
        let searchParam = this.removeFacilityParamAndFillTitleIdsWhenSearch(cloneDeep(this.searchParam));
        this.deleteParams(searchParam);
        outboundService.searchOutboundInquiryExpandingReportByPaging(searchParam).subscribe(
            res => {
                this.orginInquiryReports = cloneDeep(res.results);
                this.selectedInquirys = [];
                this.isSelectedAll = false;
                this.inquiryReports = this.addHeadOption(res.results);
                this.searchResultPaging = res.paging;
                this.setInitGroupReport();
                this.loading = false;
            },
            err => {
                this.loading = false;
                errorHandler.handle(err);
            }
        );
        }
    }

    private setInitGroupReport() {
        let reports = cloneDeep(this.orginInquiryReports.data);
        forEach(reports, (dt) => {
            dt.source = 'dbSource';
        });
        this.inquiryReports.data = groupBy(reports, 'source');
        // when customize change and has been selected layout
        if (this.selectedLayout && this.selectedLayout.groupColumns.length > 0) {
            this.inquiryReports.data = reportUtil.getReOrgGroupTableSource(this.orginInquiryReports.data, this.selectedLayout);
        }
    }

    statusByTabName: any = {
        // 'All': ['Imported', 'Open', 'Committed', 'Partial Committed', 'Commit Blocked', 'Commit Failed', 'Pending', 'On Hold', 'Planning', 'Planned', 'Picking', 'Picked', 'Packing', 'Packed', 'Staged', 'Loading', 'Loaded', 'Partial Shipped', 'Short Shipped', 'Shipped', 'Closed', 'Cancelled', 'Reopened'],
        'All': [],
        'Open': ['Imported', 'Open'],
        'Scheduled': ['Imported', 'Open', 'Picking', 'Picked', 'Staging'],
        'Daily Shipped': ['Shipped'],
        'MTD Shipped': ['Shipped']

    };

    currentTagName: string = 'All';
    onClickStatuTab(tabName: string) {
        this.searchParam.statuses = this.statusByTabName[tabName];
        if (tabName === this.currentTagName) return;
        this.modeType = '';
        this.selectedLayout = null;
        this.currentTagName = tabName;
        delete this.searchParam.shippedTimeTo;
        delete this.searchParam.shippedTimeFrom;
        this.searchParam.reportCategory = 'OUTBOUND_INQUIRY';
        if (tabName === 'Daily Shipped') {
            this.searchParam.shippedTimeTo = util.fomateEndDate(new Date());
            this.searchParam.shippedTimeFrom = util.fomateStartDate(new Date());
        } else if (tabName === 'MTD Shipped') {
            this.modeType = 'MTD';
            this.searchParam.shippedTimeTo = util.fomateEndDate(new Date());
            this.searchParam.shippedTimeFrom = util.fomateCurrentMMFirstDay(new Date());

        }
        this.searchReport();
    }

    private init() {
        this.customerIds = this.getCustomerIds();
    }

    searchReport() {
        this.searchParam.paging = { pageNo: 1, limit: 10 };
        this.search();
    }

    onselectChange(payload: any) {
        if (!payload) {
            this.searchParam.itemSpecIds = [];
        } else {
            this.searchParam.itemSpecIds = [payload.id];
        }
    }

    private search() {

        if (this.$route.query.statuses && this.currentTagName === "All") {
            this.searchParam.statuses = this.$route.query.statuses;
        }
        if (this.sortingField.sortingFields && this.sortingField.sortingFields.length > 0) {
            this.searchParam.sortingFields = this.sortingField.sortingFields;
            this.searchParam.sortingOrder = this.sortingField.sortingOrder;
        }
        this.searchParam.generalDynFields = reportUtil.getGeneralDynFields(this.customizitionTableView);
        this.searchParam.detailDynFields = reportUtil.getDetailDynFields(this.customizitionTableView);
        if (this.tableModeName === 'Nested Layout') {
            this.searchParam.headerList = reportUtil.getNestedColumnList(this.customizitionTableView);
            this.searchOutboundInquiryOrderLevelReportByPaging();
        } else {
            this.searchParam.headerList = reportUtil.getFlatColumnList(this.customizitionTableView);
            this.searchInquiryExpandingReportByPaging();
        }
    }

    private sortingFields(head: any, sortingOrder: any) {
        this.sortingField[head] = sortingOrder;
        this.sortingField.sortingOrder = sortingOrder;
        if (head == 'Rush') this.sortingField.sortingFields = ["isRush", "createdWhen"];
        else  this.sortingField.sortingFields = [head, "createdWhen"];
        this.searchReport();
    }

    triggerSearchFromPager(pager: any) {
        this.searchParam.paging.limit = pager.pageSize;
        this.searchParam.paging.pageNo = pager.currentPage;
        if (this.searchParam.facility.name == "All") {
            this.loadContentFacilityAll(this.searchParam.paging.pageNo);
        } else {
            this.search();
        }
    }

    // facility为All 前端分页使用
    private loadContentFacilityAll(currentPage: number) {
        this.orginInquiryReports.data = this.excelByFacilityAll.data.slice((currentPage - 1) * this.searchParam.paging.limit, currentPage * this.searchParam.paging.limit > this.excelByFacilityAll.data.length ? this.excelByFacilityAll.data.length : currentPage * this.searchParam.paging.limit);
        this.setInitGroupReport();
        this.$forceUpdate();
    }

    private initOrderChildItem() {
        this.itemLoading = {};
        this.childrenShow = {};
        this.childrenReport = {};
        this.childrenReportPager = {};
    }

    itemLoading: any = {};
    childrenShow: any = {};
    childrenReport: any = {};
    childrenReportPager: any = {};

    showChildItemTable(orderId: any, facilityName?: any) {

        this.initChildrenSearch(orderId);
        if (!this.childrenShow[orderId]) return;
        let param = this.removeFacilityParamAndFillTitleIdsWhenSearch(cloneDeep(this.searchParam));
        this.deleteParams(param);
        param.paging = { pageNo: 1, limit: 10 };
        if (facilityName) {
            let facilities = this.getfacilitiesBySelectedCustomer();
            facilities = keyBy(facilities, "name");
            param.facilityId = facilities[facilityName].id;
            param.facilityName = facilities[facilityName].accessUrl;
            orderId = orderId.replace(facilityName, "");
        }
        param.orderIds = [orderId];
        if (param.itemKeywords) {
            delete param.itemKeywords;
        }
        if (param.keywords) {
            delete param.keywords;
        }
        this.searchItemLevelReportByPaging(param, facilityName);
    }

    showIDLevelAndCartonLevel(itemLevel: any, facilityName?: any) {
        let idLevelKey = 'idLevel-' + itemLevel['orderId'] + itemLevel['itemSpecId'] + itemLevel['unitId'];
        let cartonLevelKey = 'cartonLevel-' + itemLevel['orderId'] + itemLevel['itemSpecId'] + itemLevel['unitId'];
        this.initChildrenSearch(idLevelKey);
        this.initChildrenSearch(cartonLevelKey);
        if (!this.childrenShow[idLevelKey]) return;
        let idParam: any = { paging: { pageNo: 1, limit: 10 }, orderIds: [itemLevel['orderId']], itemSpecId: itemLevel['itemSpecId'], lotNos: itemLevel['lotNo'] ? [itemLevel['lotNo']] : [] };
        let cartonParam: any = { orderIds: [itemLevel['orderId']], itemSpecId: itemLevel['itemSpecId'], lotNos: itemLevel['lotNo'] ? [itemLevel['lotNo']] : [] };
        if (facilityName) {
            let facilities = this.getfacilitiesBySelectedCustomer();
            facilities = keyBy(facilities, "name");
            idParam.facilityId = facilities[facilityName].id;
            idParam.facilityName = facilities[facilityName].accessUrl;
            cartonParam.facilityId = facilities[facilityName].id;
            cartonParam.facilityName = facilities[facilityName].accessUrl;
        }
        this.searchIDLevelReportByPaging(idParam, idLevelKey);
        this.searchCartonLevelReportByPaging(cartonParam, cartonLevelKey);
    }

    private initChildrenSearch(key: any) {
        this.childrenShow[key] = !this.childrenShow[key];
        this.childrenReport[key] = null;
        this.childrenReportPager[key] = null;
        this.$forceUpdate();
    }


    private searchItemLevelReportByPaging(param: any, facilityName?: any) {
        if (!facilityName) { facilityName = ""; }
        let DetailColumns = reportUtil.getDetailColumnList(this.customizitionTableView);
        if (DetailColumns.length > 0) {
            param.headerList = DetailColumns;
        }
        this.itemLoading[(param.orderIds).toString() + facilityName] = true;
        this.$forceUpdate();
        outboundService.searchOutboundInquiryItemLevelReportByPaging(param).subscribe(
            res => {
                this.childrenReport[(param.orderIds).toString() + facilityName] = res.results;
                this.childrenReportPager[(param.orderIds).toString() + facilityName] = { paging: res.paging };
                this.itemLoading[(param.orderIds).toString() + facilityName] = false;
                this.$forceUpdate();
            },
            err => {
                this.itemLoading[(param.orderIds).toString() + facilityName] = false;
                errorHandler.handle(err);
            }
        );
    }

    searchItemLevelReportFromPager(pager: any) {
        let orderId = pager.currentDate['orderId'];
        if (orderId && this.childrenReportPager[orderId]) {
            let param = this.removeFacilityParamAndFillTitleIdsWhenSearch(cloneDeep(this.searchParam));
            this.deleteParams(param);
            param.paging.limit = pager.pageSize;
            param.paging.pageNo = pager.currentPage;
            param.orderIds = [orderId];
            this.searchItemLevelReportByPaging(param);
        }

    }

    private searchIDLevelReportByPaging(param: any, idLevelkey: string) {
        let DetailColumns = reportUtil.getIDLevelColumnList(this.customizitionTableView);
        param.headerList = DetailColumns;
        if (!param.headerList.length) {
            errorHandler.handle('Please Select at least one criteria for each customize column.');
            return;
        }
        this.itemLoading[idLevelkey] = true;
        param.reportCategory = this.searchParam.reportCategory;
        param.customerId = this.searchParam.customerId;
        this.$forceUpdate();
        outboundService.searchOutboundInquiryIdLevelReportByPaging(param).subscribe(
            res => {
                this.childrenReport[idLevelkey] = res.results;
                this.childrenReportPager[idLevelkey] = { paging: res.paging };
                this.itemLoading[idLevelkey] = false;
                this.$forceUpdate();
            },
            err => {
                this.itemLoading[idLevelkey] = false;
                errorHandler.handle(err);
            }
        );
    }

    private searchCartonLevelReportByPaging(param: any, cartonLevelKey: string) {
        let cartonColumns = reportUtil.getCartonLevelColumnList(this.customizitionTableView);
        param.headerList = cartonColumns;
        if (!param.headerList.length) {
            errorHandler.handle('Please Select at least one criteria for each customize column.');
            return;
        }
        this.itemLoading[cartonLevelKey] = true;
        param.reportCategory = this.searchParam.reportCategory;
        param.customerId = this.searchParam.customerId;
        this.$forceUpdate();
        outboundService.searchOutboundInquiryCartonLevelReportByPaging(param).subscribe(
            res => {
                this.childrenReport[cartonLevelKey] = res.results;
                this.childrenReportPager[cartonLevelKey] = { paging: { pageNo: 1, totalCount: res.results.data.length, limit: 10 } };
                this.loadContent(1, cartonLevelKey);
                this.itemLoading[cartonLevelKey] = false;
                this.$forceUpdate();
            },
            err => {
                this.itemLoading[cartonLevelKey] = false;
                errorHandler.handle(err);
            }
        );
    }

    searchIDLevelReportFromPager(pager: any) {
        let orderId = pager.currentDate['orderId'];
        let idLevelKey = 'idLevel-' + pager.currentDate['orderId'] + pager.currentDate['itemSpecId'] + pager.currentDate['unitId'];
        if (orderId && this.childrenReportPager[idLevelKey]) {
            let param = this.removeFacilityParamAndFillTitleIdsWhenSearch(cloneDeep(this.searchParam));
            this.deleteParams(param);
            param.paging.limit = pager.pageSize;
            param.paging.pageNo = pager.currentPage;
            param.itemSpecId = pager.currentDate['itemSpecId'];
            param.lotNos = pager.currentDate['lotNo'] ? [pager.currentDate['lotNo']] : [];
            param.orderIds = [orderId];
            this.searchIDLevelReportByPaging(param, idLevelKey);
        }

    }

    cartonCurrentPageDate: any = {};
    searchCartonLevelReportFromPager(pager: any) {
        let cartonLevelKey = 'cartonLevel-' + pager.currentDate['orderId'] + pager.currentDate['itemSpecId'];
        let pageNo = pager.currentPage;
        this.childrenReportPager[cartonLevelKey].paging.pageNo = pageNo;
        this.childrenReportPager[cartonLevelKey].paging.limit = pager.pageSize;
        this.loadContent(pageNo, cartonLevelKey);
    }

    private loadContent(currentPage: number, cartonKey: string) {
        this.cartonCurrentPageDate[cartonKey] = this.childrenReport[cartonKey].data.slice((currentPage - 1) * this.childrenReportPager[cartonKey].paging.limit,
            currentPage * this.childrenReportPager[cartonKey].paging.limit > this.childrenReport[cartonKey].data.length ? this.childrenReport[cartonKey].data.length : currentPage * this.childrenReportPager[cartonKey].paging.limit);
        this.$forceUpdate();
    }

    getItemLevelKey(inquiry: any) {
        if (!inquiry["facilityName"]) {
            inquiry["facilityName"] = "";
        }
        return inquiry['orderId'] + inquiry["facilityName"];
    }

    getIdLevelKey(itemLevel: any) {
        return 'idLevel-' + itemLevel['orderId'] + itemLevel['itemSpecId'] + itemLevel['unitId'];
    }

    getCartonLevelKey(itemLevel: any) {
        return 'cartonLevel-' + itemLevel['orderId'] + itemLevel['itemSpecId'] + itemLevel['unitId'];
    }

    getLeveLData(key: any) {
        return this.childrenReport[key] ? this.childrenReport[key].data : [];
    }

    getLeveLHead(key: any) {
        return this.childrenReport[key] ? this.childrenReport[key].head : [];
    }

    getToTalCount(orderId: any) {
        return this.childrenReportPager[orderId] ? this.childrenReportPager[orderId].paging.totalCount : null;
    }

    getPageSize(orderId: any) {
        return this.childrenReportPager[orderId] ? this.childrenReportPager[orderId].paging.limit : 10;
    }

    setPageVisibility(orderId: any) {
        if (this.childrenReportPager[orderId] && this.childrenReportPager[orderId].paging.totalCount > 10) {
            return true;
        } else {
            return false;
        }
    }

    getItemLeveLData(orderId: any) {
        return this.childrenReport[orderId] ? this.childrenReport[orderId].data : [];
    }

    getItemLeveLHead(orderId: any) {
        return this.childrenReport[orderId] ? this.childrenReport[orderId].head : [];
    }

    mounted() {
        this.init();
    }

    private exportExcel(selectedExcelName: string) {
        let param = this.removeFacilityParamAndFillTitleIdsWhenSearch(cloneDeep(this.searchParam));
        this.deleteParams(param);
        param = this.addOrderIds(param);
        if (selectedExcelName === 'Order Level (.xls)') {
            param.headerList = reportUtil.getNestedColumnList(this.customizitionTableView);
            return outboundService.orderLevelDownLoad(param);
        } else if (selectedExcelName === 'Item Level (.xls)') {
            param.headerList = reportUtil.getDetailColumnList(this.customizitionTableView);
            return outboundService.itemLevelDownLoad(param);
        } else if (selectedExcelName === 'ID Level (.xls)') {
            param.headerList = reportUtil.getIDLevelColumnList(this.customizitionTableView);
            return outboundService.idLevelDownLoad(param);
        } else if (selectedExcelName === 'Carton Level (.xls)') {
            param.headerList = reportUtil.getCartonLevelColumnList(this.customizitionTableView);
            return outboundService.cartonLevelDownLoad(param);
        } else if (selectedExcelName === 'Expanding Level(.xls)') {
            param.headerList = reportUtil.getExcelColumnList(this.customizitionTableView);
            return outboundService.expandingLevelDownLoad(param);
        }
        return (new Promise(() => null));
    }

    isDynTxt(head: string) {
        if (head === 'OrderDynTxtProperty' || head === 'OrderItemLineDynTxtProperty') {
            return true;
        } else {
            return false;
        }
    }

    analysisDynTxt(value: any, head: string) {
        if (head === 'ReceiptDynTxtProperty' || head === 'ReceiptItemLineDynTxtProperty') {
            if (value) {
                return value.split(',');
            }
        }
    }

    isSelectedAll: boolean = false;
    selectedInquirys: Array<any> = [];
    selectAll() {
        this.isSelectedAll = !this.isSelectedAll;
        if (this.isSelectedAll) {
            this.selectedInquirys = this.orginInquiryReports.data;
        } else {
            this.selectedInquirys = [];
        }
    }

    selectSingle(orderInquiry: any) {
        let isContain = find(this.selectedInquirys, { "orderId": orderInquiry.orderId});
        if (!isContain) {
            this.selectedInquirys.push(orderInquiry);
            let orginDate =  filter(this.orginInquiryReports.data, 'allAssociatedFileId');
            if (this.selectedInquirys.length > 0 && this.selectedInquirys.length === orginDate.length) {
                this.isSelectedAll = true;
            }
        } else {
           remove(this.selectedInquirys, (select: any) => select.orderId == orderInquiry.orderId);
           this.isSelectedAll = false;
        }
        this.$forceUpdate();
    }

    isChecked(orderInquiry: any) {
        let isContain = find(this.selectedInquirys, { "orderId": orderInquiry.orderId});
        if (!isContain) {
            return false;
        }
        return true;
    }

    exportPdfLoading: boolean = false;
    batchDownloadPdf() {
        if (this.isSelectedAll) {
            this.selectedInquirys = filter(this.orginInquiryReports.data, 'allAssociatedFileId');
        }
        let selectedInquirys = filter(this.selectedInquirys, 'allAssociatedFileId');
        if (!selectedInquirys.length) {
            util.popUpWarningMessage('Please Select at least one valid record.');
            return;
        }
        if (selectedInquirys.length === 0 ) return;
        let obv: any = [];
        forEach(selectedInquirys, (orderInquiry) => {
            let fileDownloadUrl = util.buildItemDownloadUrl(orderInquiry.allAssociatedFileId);
            obv.push(fileService.getCombinedPdf(fileDownloadUrl, {
                responseType: 'arraybuffer',
                referenceNo: orderInquiry.referenceNo,
                orderId: orderInquiry.orderId
            }));
        });
        this.exportPdfLoading = true;
        Observable.forkJoin(...obv).subscribe(
        res => {
            forEach(res, (rs: any) => {
                let fileName = rs.config.referenceNo ? rs.config.referenceNo : rs.config.orderId;
                util.exportFile(rs, fileName + '.pdf');
            });
            this.exportPdfLoading = false;
        }, err => {
            this.exportPdfLoading = false;
            errorHandler.handle(err);
        });
    }

    downloadPdf(orderInquiry: any) {
        let fileDownloadUrl = util.buildItemDownloadUrl(orderInquiry.allAssociatedFileId);
      fileService.getCombinedPdf(fileDownloadUrl, {responseType: 'arraybuffer'}).then((res => {
            let fileName = orderInquiry.referenceNo ? orderInquiry.referenceNo : orderInquiry.orderId;
            util.exportFile(res, fileName + '.pdf');
        })).catch(err => {
            errorHandler.handle(err);
        });
    }

    downloadPackingListPdf(orderInquiry: any) {
        let fileDownloadUrl = util.buildPackingListDownloadUrl(orderInquiry.orderId);
        let accessUrl = "";
        if (this.searchParam.facility.name == "All" && orderInquiry.Facility) {
            let facilities = this.getfacilitiesBySelectedCustomer();
            facilities = keyBy(facilities, "name");
            accessUrl = facilities[orderInquiry.Facility].accessUrl;
        }
        fileService.getCombinedPdf(fileDownloadUrl, { responseType: 'arraybuffer', headers: {accessUrl: accessUrl} }).then((res => {
            let fileName = orderInquiry.orderId;
            util.exportFile(res, fileName + '.pdf');
        })).catch(err => {
            errorHandler.handle(err);
        });
    }

    downloadGenericPackingListPdf(orderInquiry: any) {
        if (isEmpty(orderInquiry.orderId)) {
            util.popUpWarningMessage('');
            return;
        }
        outboundService.getGenericPackingListPdf(orderInquiry.orderId).subscribe(
            res => {
                let fileId = res.fileId || "";
                let fileDownloadUrl = util.buildItemDownloadUrl(fileId);
                fileService.getCombinedPdf(fileDownloadUrl, { responseType: 'arraybuffer' }).then((res => {
                    let fileName = orderInquiry.orderId + " _GenericPackingList";
                    util.exportFile(res, fileName + '.pdf');
                })).catch(err => {
                    errorHandler.handle(err);
                });
            },
            err => {
                errorHandler.handle(err);
            }
        );
    }

    downloadMBOL(orderInquiry: any) {
        console.log(orderInquiry);
        if (isEmpty(orderInquiry['loadId'])) {
            util.popUpWarningMessage('');
            return;
        }
        outboundService.getGenericBolPdf(orderInquiry['loadId']).subscribe(
            res => {
                let fileIds = res.fileIds || [];
                let fileId = fileIds[0];
                let fileDownloadUrl = util.buildItemDownloadUrl(fileId);
                fileService.getCombinedPdf(fileDownloadUrl, { responseType: 'arraybuffer' }).then((res => {
                    let fileName = orderInquiry["mBol"] ? orderInquiry["mBol"] : (orderInquiry["bolNo"] ? orderInquiry["bolNo"] : orderInquiry["Load ID"]);
                    util.exportFile(res, fileName + '.pdf');
                })).catch(err => {
                    errorHandler.handle(err);
                });
            },
            err => {
                errorHandler.handle(err);
            }
        );
    }

    private deleteParams(searchParam: any) {
        delete searchParam.itemSpecId;
        if (searchParam.itemSpecIds && searchParam.itemSpecIds.length === 0 ) {
            delete searchParam.itemSpecIds;
        }
        if (searchParam.statuses && searchParam.statuses.length === 0 ) {
            delete searchParam.statuses;
        }
        if (searchParam.loadStatuses && searchParam.loadStatuses.length === 0 ) {
            delete searchParam.loadStatuses;
        }
    }

    downLoadIdLevelItemLevel(itemLevel: any, facilityName?: any) {
        let idLevelKey = this.getIdLevelKey(itemLevel);
        let param: any = { paging: { pageNo: 1, limit: 10 }, orderIds: [itemLevel['orderId']], itemSpecId: itemLevel['itemSpecId'], lotNos: itemLevel['lotNo'] ? [itemLevel['lotNo']] : [] };
        param.headerList = reportUtil.getIDLevelColumnList(this.customizitionTableView);
        param.reportCategory = this.searchParam.reportCategory;
        param.customerId = this.searchParam.customerId;
        this.$set(this.itemExcelLoadingObj, idLevelKey, true);
        if (facilityName) {
            let facilities = this.getfacilitiesBySelectedCustomer();
            facilities = keyBy(facilities, "name");
            param.facilityId = facilities[facilityName].id;
            param.facilityName = facilities[facilityName].accessUrl;
        }
        outboundService.idLevelDownLoad(param).then((res => {
            this.$set(this.itemExcelLoadingObj, idLevelKey, false);
            util.exportFile(res, `Outbound-ID-Level-Detail-${itemLevel['orderId']}.xlsx`);
        })).catch((err: any) => {
            this.$set(this.itemExcelLoadingObj, idLevelKey, false);
            errorHandler.handle(err);
        });
    }

    downLoadCartonLevelItemLevel(itemLevel: any, facilityName?: any) {
        let cartonLevelKey = this.getCartonLevelKey(itemLevel);
        let param: any = { orderIds: [itemLevel['orderId']], itemSpecId: itemLevel['itemSpecId'], lotNos: itemLevel['lotNo'] ? [itemLevel['lotNo']] : [] };
        param.headerList = reportUtil.getCartonLevelColumnList(this.customizitionTableView);
        param.reportCategory = this.searchParam.reportCategory;
        param.customerId = this.searchParam.customerId;
        this.$set(this.itemExcelLoadingObj, cartonLevelKey, true);
        if (facilityName) {
            let facilities = this.getfacilitiesBySelectedCustomer();
            facilities = keyBy(facilities, "name");
            param.facilityId = facilities[facilityName].id;
            param.facilityName = facilities[facilityName].accessUrl;
        }
        outboundService.cartonLevelDownLoad(param).then((res => {
            this.$set(this.itemExcelLoadingObj, cartonLevelKey, false);
            util.exportFile(res, `Outbound-Carton-Level-Detail-${itemLevel['orderId']}.xlsx`);
        })).catch((err: any) => {
            this.$set(this.itemExcelLoadingObj, cartonLevelKey, false);
            errorHandler.handle(err);
        });
    }

    editOrder(orderId: any) {
        this.$router.replace({name: 'OrderEntry', query: {orderId: orderId}});
    }


    attachmentUpload(orderInquiry: any) {
        this.$validator.errors.clear();
        Object.assign(this.popUpConfig, {
            isShow: true,
            height: 500,
            title: `Attachment Upload`,
            isSubmit: false,
            modal: 'Attachment'
        });
        this.attachmentOrder = orderInquiry;
        if (this.attachmentOrder['Facility']) {
            let facilities = this.getfacilitiesBySelectedCustomer();
            facilities = keyBy(facilities, "name");
            this.attachmentOrder['accessUrl'] = facilities[this.attachmentOrder['Facility']].accessUrl;
        }
    }

    cancel(item: any) {
        this.orderId = item.orderId;
        this.popups({
            title: 'Cancel Confirm',
            content: `Would you like to cancel this order?`,
            cancel: 'No',
            confirm: 'Yes'
        }).then(
            (res: any) => {
                outboundService.cancelOrder( {orderId: this.orderId} ).subscribe(
                    res => {
                        this.loading = false;
                        this.searchReport();
                    },
                    err => {
                        this.loading = false;
                        errorHandler.handle(err);
                    }
                );
            }
        );
    }
}
