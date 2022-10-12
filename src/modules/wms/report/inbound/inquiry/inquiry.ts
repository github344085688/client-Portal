
import PredefinedCustomerSelect from "@components/predefined-customer-select/predefined-customer-select";
import MultipleOrganizationAutoComplete from "@components/multiple-organization-auto-complete/multiple-organization-auto-complete";
import PredefinedTableLayout from "@components/predefined-table-layout/predefined-table-layout";
import PredefinedExportBtn from "@components/predefined-export-btn/predefined-export-btn";
import ItemAutoComplete from "@components/itemspec-auto-complete/itemspec-auto-complete";
import ReceiptAutoComplete from "@components/receipt-auto-complete/receipt-auto-complete";
import SimplifiedPager from "@components/simplified-pager/simplified-pager";
import CustomizeTable from "@components/customize-table/customize-table";
import FacilitySelect from "@components/facility-select/facility-select";
import ElementSelect from "@components/element-select/element-select";
import WaittingBtn from "@components/waitting-button/waitting-btn";
import TagsInput from "@components/tags-input/tags-input";
import DateRange from "@components/date-range/date-range";
import errorHandler from "@shared/error-handler";
import reportUtil from "@shared/report-util";
import Pager from "@components/pager/pager";
import CustomerWiseVue from "@shared/customer-wise-vue";
import util from "@shared/util";
import { cloneDeep, forEach, groupBy, keyBy , concat, filter, assign , find, remove, indexOf } from "lodash-es";
import InboundService from "@services/inbound-service";
import { Component } from "vue-property-decorator";
import { Subject , Observable } from "rxjs";
import "rxjs/add/operator/debounceTime";
import fileService from "@services/file-service";
import PopUpWindows from "@components/pop-up-windows/pop-up-windows";
import TableDragDrop from "@components/table-drag-drop/table-drag-drop";
import tlp from "./inquiry.vue";
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
export default class Inquiry extends CustomerWiseVue {

    searchParam: any = {
        paging: {pageNo: 1, limit: 10},
        reportCategory: 'INBOUND_INQUIRY'
    };
    inquiryReports: any = {};
    receiptStatus: Array<any> = ['Imported', 'Open', 'Appointment Made', 'In Yard', 'In Progress', 'Task Completed', 'Exception', 'Closed', 'Force Closed', 'Cancelled', 'Reopened'];
    facilities: Array<any> = [];
    searchResultPaging: any = {};
    modeType: string = "";
    loading = false;
    showReceiptTags = false;
    customizeComplete = false;
    exportLoading: boolean = false;
    searchByInput: Subject<void> = new Subject();
    exportDates: Array<any> = ['Expanding Level(.xls)'];
    itemExcelLoadingObj: any = {};
    excelByFacilityAll: any = {};
    sortingField: any = {};
    isEditPermissionReceiptEntry: boolean = false;
    // exportDates: Array<any> = ['Expanding Level(.xls)', 'Receipt Level (.xls)', 'Item Level (.xls)', 'ID Level (.xls)', 'Carton Level (.xls)'];
    customizitionTableView: any = {};
    isAttachment: boolean = false;
    reportFileInfo: Array<any> = [];
    attachmentReceipt: any = {};
    reason: String = '';
    receiptId: String = '';
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
            param = this.addReceiptIds(param);
            InboundService.multipleFacilityDownload(param).then(res => {
                this.exportLoading = false;
                util.exportFile(res, "Inbound-Inquiry-Expanding.xlsx");
            }, err => {
                this.exportLoading = false;
                errorHandler.handle(err);
            });
        }
        else {
        this.exportExcel(payload).then((res => {
            this.exportLoading = false;
            if (payload === 'Receipt Level (.xls)') {
                util.exportFile(res, "Inbound-Inquiry-Receipt-Level.xlsx");
            }
            else if (payload === 'Item Level (.xls)') {
                util.exportFile(res, "Inbound-Inquiry-Item-Level.xlsx");
            }
            else if (payload === 'ID Level (.xls)') {
                util.exportFile(res, "Inbound-Inquiry-ID-Level.xlsx");
            }
            else if (payload === 'Carton Level (.xls)') {
                util.exportFile(res, "Inbound-Inquiry-Carton-Level.xlsx");
            }
            else if (payload === 'Expanding Level(.xls)') {
                util.exportFile(res, "Inbound-Inquiry-Expanding.xlsx");
            }
        })).catch(err => {
            this.exportLoading = false;
            errorHandler.handle(err);
        });
    }
    }

    addReceiptIds(params: any) {
        if (this.selectedInquirys.length) {
            params.receiptIds = [];
            forEach(this.selectedInquirys, (item) => {
                params.receiptIds.push(item.receiptId);
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

    onSelectInYardDateRange(payload: any) {
        this.searchParam.inYardTimeFrom = payload.timeFrom;
        this.searchParam.inYardTimeTo = payload.timeTo;
        // this.searchReport();
    }

    onSelectCloseDateRange(payload: any) {
        this.searchParam.receivedTimeFrom = payload.timeFrom;
        this.searchParam.receivedTimeTo = payload.timeTo;
        // this.searchReport();
    }

    onSelectReceiptStatus(payload: any) {
        // this.searchReport();
    }

    onSelectCustomizeTable(payload: any) {
        this.customizitionTableView = payload;
        this.showReceiptTags = false;
        let querys = this.$route.query;
        if (querys) {
            if (querys.receiptIds) {
                this.showReceiptTags = true;
                this.searchParam.receiptIds = querys.receiptIds;
                if (typeof querys.receiptIds === 'string') {
                    this.searchParam.receiptIds = [querys.receiptIds];
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
        this.customizeComplete = false;
        this.searchParam.itemSpecId = null;
        this.isSelectItem = true;
        this.searchParam.titleIds = [];
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
    private searchInquiryReceiptLevelReportByPaging() {
        if (!this.searchParam.headerList.length) {
            errorHandler.handle('Please Select at least one criteria for each customize column.');
            return;
        }
        this.inquiryReports = [];
        this.searchResultPaging = [];
        this.initReceiptChildItem();
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
                promise.push(InboundService.searchInquiryReceiptLevelReportByPaging(param).toPromise());
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
             InboundService.searchInquiryReceiptLevelReportByPaging(searchParam).subscribe(
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
        this.initReceiptChildItem();
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
                promise.push(InboundService.searchInquiryExpandingReportByPaging(param).toPromise());
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
        InboundService.searchInquiryExpandingReportByPaging(searchParam).subscribe(
            res => {
                this.orginInquiryReports = cloneDeep(res.results);
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
        // 'All': ['Imported', 'Open', 'Appointment Made', 'In Yard', 'In Progress', 'Task Completed', 'Exception', 'Closed', 'Force Closed', 'Cancelled', 'Reopened'],
        'All': [],
        'Open': ['Imported', 'Open'],
        'Scheduled': ['Appointment Made'],
        'Daily Received': ['In Yard', 'In Progress', 'Task Completed', 'Exception', 'Closed', 'Force Closed', 'Cancelled', 'Reopened'],
        'MTD Received': ['In Yard', 'In Progress', 'Task Completed', 'Exception', 'Closed', 'Force Closed', 'Cancelled', 'Reopened']

    };

    currentTagName: string = 'All';
    onClickStatuTab(tabName: string) {
        this.searchParam.statuses = this.statusByTabName[tabName];
        if (tabName === this.currentTagName) return;
        this.modeType = '';
        this.selectedLayout = null;
        this.currentTagName = tabName;
        delete this.searchParam.receivedTimeTo;
        delete this.searchParam.receivedTimeFrom;
        if (tabName === 'Daily Received') {
            this.searchParam.receivedTimeTo = util.fomateEndDate(new Date());
            this.searchParam.receivedTimeFrom = util.fomateStartDate(new Date());
        } else if (tabName === 'MTD Received') {
            this.modeType = 'MTD';
            this.searchParam.receivedTimeTo = util.fomateEndDate(new Date());
            this.searchParam.receivedTimeFrom = util.fomateCurrentMMFirstDay(new Date());
        }
        this.searchReport();
    }

    private init() {

    }

    searchReport() {
        this.searchParam.paging.pageNo = 1;
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
            this.searchInquiryReceiptLevelReportByPaging();
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

    private initReceiptChildItem() {
        this.itemLoading = {};
        this.childrenShow = {};
        this.childrenReport = {};
        this.childrenReportPager = {};
    }

    itemLoading: any = {};
    childrenShow: any = {};
    childrenReport: any = {};
    childrenReportPager: any = {};

    showItemLevelTable(receiptId: any, facilityName?: any) {

        this.initChildrenSearch(receiptId);
        if (!this.childrenShow[receiptId]) return;
        let param = this.removeFacilityParamAndFillTitleIdsWhenSearch(cloneDeep(this.searchParam));
        this.deleteParams(param);
        if (facilityName) {
            let facilities = this.getfacilitiesBySelectedCustomer();
            facilities = keyBy(facilities, "name");
            param.facilityId = facilities[facilityName].id;
            param.facilityName = facilities[facilityName].accessUrl;
            receiptId = receiptId.replace(facilityName, "");
        }
        if (param.itemKeywords) {
            delete param.itemKeywords;
        }
        if (param.keywords) {
            delete param.keywords;
        }
        param.paging = { pageNo: 1, limit: 10 };
        param.receiptIds = [receiptId];
        this.searchItemLevelReportByPaging(param, facilityName);
    }

    showIDLevelAndCartonLevel(itemLevel: any , facilityName?: any) {
        let idLevelKey = 'idLevel-' + itemLevel['receiptId'] + itemLevel['itemSpecId'] + itemLevel['unitId'];
        let cartonLevelKey = 'cartonLevel-' + itemLevel['receiptId'] + itemLevel['itemSpecId'] + itemLevel['unitId'];
        this.initChildrenSearch(idLevelKey);
        this.initChildrenSearch(cartonLevelKey);
        if (!this.childrenShow[idLevelKey]) return;
        let idParam: any = { paging: { pageNo: 1, limit: 10 }, receiptIds: [itemLevel['receiptId']], itemSpecId: itemLevel['itemSpecId'], lotNos: itemLevel['lotNo'] ? [itemLevel['lotNo']] : [] };
        let cartonParam: any = { receiptIds: [itemLevel['receiptId']], itemSpecId: itemLevel['itemSpecId'], lotNos: itemLevel['lotNo'] ? [itemLevel['lotNo']] : [] };
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

    searchItemLevelReportFromPager(pager: any) {
        let receiptId = pager.currentDate['receiptId'];
        if (receiptId && this.childrenReportPager[receiptId]) {
            let param = this.removeFacilityParamAndFillTitleIdsWhenSearch(cloneDeep(this.searchParam));
            this.deleteParams(param);
            param.paging.limit = pager.pageSize;
            param.paging.pageNo = pager.currentPage;
            param.receiptIds = [receiptId];
            this.searchItemLevelReportByPaging(param);
        }

    }

    idLevelCurrentPageDate: any = {};
    searchIDLevelReportFromPager(pager: any) {
        let idLevelKey = 'idLevel-' + pager.currentDate['receiptId'] + pager.currentDate['itemSpecId'] + pager.currentDate['unitId'];
        let pageNo = pager.currentPage;
        this.childrenReportPager[idLevelKey].paging.pageNo = pageNo;
        this.childrenReportPager[idLevelKey].paging.limit = pager.pageSize;
        this.loadIdContent(pageNo, idLevelKey);
    }

    private loadIdContent(currentPage: number, idKey: string) {
        this.idLevelCurrentPageDate[idKey] = this.childrenReport[idKey].data.slice((currentPage - 1) * this.childrenReportPager[idKey].paging.limit,
            currentPage * this.childrenReportPager[idKey].paging.limit > this.childrenReport[idKey].data.length ? this.childrenReport[idKey].data.length : currentPage * this.childrenReportPager[idKey].paging.limit);
        this.$forceUpdate();
    }

    private searchItemLevelReportByPaging(param: any, facilityName?: any) {
        if (!facilityName) { facilityName = ""; }
        let DetailColumns = reportUtil.getDetailColumnList(this.customizitionTableView);
        param.headerList = DetailColumns;
        if (!param.headerList.length) {
            errorHandler.handle('Please Select at least one criteria for each customize column.');
            return;
        }
        this.itemLoading[(param.receiptIds).toString() + facilityName] = true;
        this.$forceUpdate();
        InboundService.searchInquiryItemLevelReportByPaging(param).subscribe(
            res => {
                this.childrenReport[(param.receiptIds).toString() + facilityName] = res.results;
                this.childrenReportPager[(param.receiptIds).toString() + facilityName] = { paging: res.paging };
                this.itemLoading[(param.receiptIds).toString() + facilityName] = false;
                this.$forceUpdate();
            },
            err => {
                this.itemLoading[(param.receiptIds).toString() + facilityName] = false;
                errorHandler.handle(err);
            }
        );
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
        InboundService.searchInquiryIdLevelReportByPaging(param).subscribe(
            res => {
                this.childrenReport[idLevelkey] = res.results;
                this.childrenReportPager[idLevelkey] = { paging: { pageNo: 1, totalCount: res.results.data.length, limit: 10 } };
                this.loadIdContent(1, idLevelkey);
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
        InboundService.searchInquiryCartonLevelReportByPaging(param).subscribe(
            res => {
                this.childrenReport[cartonLevelKey] = res.results;
                this.childrenReportPager[cartonLevelKey] = { paging: { pageNo: 1, totalCount: res.results.data.length, limit: 10 } };
                this.loadContent(1, cartonLevelKey);
                this.itemLoading[cartonLevelKey] = false;
                this.$forceUpdate();
            },
            err => {
                this.itemLoading[cartonLevelKey] = true;
                errorHandler.handle(err);
            }
        );
    }

    cartonCurrentPageDate: any = {};
    searchCartonLevelReportFromPager(pager: any) {
        let cartonLevelKey = 'cartonLevel-' + pager.currentDate['receiptId'] + pager.currentDate['itemSpecId'];
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
        return inquiry['receiptId'] + inquiry["facilityName"];
    }

    getIdLevelKey(itemLevel: any) {
        return 'idLevel-' + itemLevel['receiptId'] + itemLevel['itemSpecId'] + itemLevel['unitId'];
    }

    getCartonLevelKey(itemLevel: any) {
        return 'cartonLevel-' + itemLevel['receiptId'] + itemLevel['itemSpecId'] + itemLevel['unitId'];
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

    getLeveLData(key: any) {
        return this.childrenReport[key] ? this.childrenReport[key].data : [];
    }

    getLeveLHead(key: any) {
        return this.childrenReport[key] ? this.childrenReport[key].head : [];
    }


    mounted() {
        this.init();
    }


    private exportExcel(selectedExcelName: string) {
        let param = this.addReceiptIds(this.removeFacilityParamAndFillTitleIdsWhenSearch(cloneDeep(this.searchParam)));
        this.deleteParams(param);
        if (selectedExcelName === 'Receipt Level (.xls)') {
            param.headerList = reportUtil.getNestedColumnList(this.customizitionTableView);
            return InboundService.receiptLevelDownLoad(param);
        }
        else if (selectedExcelName === 'Item Level (.xls)') {
            param.headerList = reportUtil.getDetailColumnList(this.customizitionTableView);
            return InboundService.itemLevelDownLoad(param);
        }
        else if (selectedExcelName === 'ID Level (.xls)') {
            param.headerList = reportUtil.getIDLevelColumnList(this.customizitionTableView);
            return InboundService.idLevelDownLoad(param);
        } else if (selectedExcelName === 'Carton Level (.xls)') {
            param.headerList = reportUtil.getCartonLevelColumnList(this.customizitionTableView);
            return InboundService.cartonLevelDownLoad(param);
        } else if (selectedExcelName === 'Expanding Level(.xls)') {
            param.headerList = reportUtil.getExcelColumnList(this.customizitionTableView);
            return InboundService.expandingLevelDownLoad(param);
        }
        return (new Promise(() => null));
    }


    isDynTxt(head: string) {
        if (head === 'ReceiptDynTxtProperty' || head === 'ReceiptItemLineDynTxtProperty') {
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

    private deleteParams(searchParam: any) {
        delete searchParam.itemSpecId;
        if (searchParam.itemSpecIds && searchParam.itemSpecIds.length === 0) {
            delete searchParam.itemSpecIds;
        }
        if (searchParam.statuses && searchParam.statuses.length === 0) {
            delete searchParam.statuses;
        }
    }

    downLoadIdLevelItemLevel(itemLevel: any, facilityName?: any) {
        let idLevelKey = this.getIdLevelKey(itemLevel);
        let param: any = { paging: { pageNo: 1, limit: 10 }, receiptIds: [itemLevel['receiptId']], itemSpecId: itemLevel['itemSpecId'], lotNos: itemLevel['lotNo'] ? [itemLevel['lotNo']] : [] };
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
        InboundService.idLevelDownLoad(param).then((res => {
            this.$set(this.itemExcelLoadingObj, idLevelKey, false);
            util.exportFile(res, `Inbound-ID-Level-Detail-${itemLevel['receiptId']}.xlsx`);
        })).catch((err: any) => {
            this.$set(this.itemExcelLoadingObj, idLevelKey, false);
            errorHandler.handle(err);
        });
    }

    downLoadCartonLevelItemLevel(itemLevel: any, facilityName?: any) {
        let cartonLevelKey = this.getCartonLevelKey(itemLevel);
        let param: any = { receiptIds: [itemLevel['receiptId']], itemSpecId: itemLevel['itemSpecId'], lotNos: itemLevel['lotNo'] ? [itemLevel['lotNo']] : [] };
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
        InboundService.cartonLevelDownLoad(param).then((res => {
            this.$set(this.itemExcelLoadingObj, cartonLevelKey, false);
            util.exportFile(res, `Inbound-Carton-Level-Detail-${itemLevel['receiptId']}.xlsx`);
        })).catch((err: any) => {
            this.$set(this.itemExcelLoadingObj, cartonLevelKey, false);
            errorHandler.handle(err);
        });
    }

    exportPdfLoading: boolean = false;
    isSelectedAll: boolean = false;
    selectedInquirys: Array<any> = [];
    selectAll() {
        this.isSelectedAll = !this.isSelectedAll;
        if (this.isSelectedAll) {
            forEach(this.orginInquiryReports.data, inquiry => {
                if (inquiry['Status'] == 'Closed' || inquiry['Status'] == 'Force Closed') this.selectedInquirys.push(inquiry);
            });
        } else {
            this.selectedInquirys = [];
        }
    }

    selectSingle(receivedInquiry: any) {
      let isContain = find(this.selectedInquirys, { "receiptId": receivedInquiry.receiptId});
      if (!isContain) {
        this.selectedInquirys.push(receivedInquiry);
        let orginDate = [];
          forEach(this.orginInquiryReports.data, inquiry => {
              if (inquiry['Status'] == 'Closed' || inquiry['Status'] == 'Force Closed') orginDate.push(inquiry);
          });
          if (this.selectedInquirys.length > 0 && this.selectedInquirys.length === orginDate.length) {
              this.isSelectedAll = true;
          }
      } else {
        remove(this.selectedInquirys, (select: any) => select.receiptId == receivedInquiry.receiptId);
        this.isSelectedAll = false;
      }
      this.$forceUpdate();
    }

    isChecked(receivedInquiry: any) {
      let isContain = find(this.selectedInquirys, { "receiptId": receivedInquiry.receiptId});
      if (!isContain) {
        return false;
      }
      return true;
    }

    batchDownloadPdf() {
        if (this.selectedInquirys.length == 0) {
            util.popUpWarningMessage('Please Select at least one valid record.');
            return;
        }

        this.exportPdfLoading = true;
        let downloadPdfNumber = 0;
        forEach(this.selectedInquirys, selectedInquirys => {
            this.downloadPdf(selectedInquirys).then(
                 (res: any) => {
                     downloadPdfNumber ++;
                     if (downloadPdfNumber == this.selectedInquirys.length) this.exportPdfLoading = false;
                 }
             );
        });
    }

    async downloadPdf(receivedInquiry: any) {
        return new Promise((resolve, reject) => {
            InboundService.printWithPicturesByReceiptId(receivedInquiry['Receipt #']).subscribe(
                res => {
                    if (res.fileId) this.getCombinedPdf(res.fileId, receivedInquiry['Receipt #']).then(
                        (res: any) => {
                            resolve(true);
                        }
                    );
                    else resolve(true);

                },
                err => {
                    errorHandler.handle(err);
                    resolve(true);
                }
            );
        });

    }

    private  getCombinedPdf(fileId: any, setFileName: any) {
        let fileDownloadUrl = util.buildItemDownloadUrl(fileId);
        return new Promise((resolve, reject) => {
            fileService.getCombinedPdf(fileDownloadUrl, {responseType: 'arraybuffer'}).then(
                res => {
                    let fileName = `${ setFileName }_document`;
                    util.exportFile(res, fileName + '.pdf');
                    resolve(true);
                }).catch(err => {
                errorHandler.handle(err);
                resolve(true);
            });
        });
    }

    editReport(reportId: any) {
        this.$router.replace({name: 'ReceiptEntry', query: {reportId: reportId}});
    }

    attachmentUpload(report: any) {
      this.$validator.errors.clear();
      Object.assign(this.popUpConfig, {
        isShow: true,
        height: 500,
        title: `Attachment Upload`,
        isSubmit: false,
        modal: 'Attachment'
      });
      this.attachmentReceipt = report;
      if (this.attachmentReceipt['Facility']) {
            let facilities = this.getfacilitiesBySelectedCustomer();
            facilities = keyBy(facilities, "name");
            this.attachmentReceipt['accessUrl'] = facilities[this.attachmentReceipt['Facility']].accessUrl;
        }

    }

    cancel(item: any) {
        this.$validator.errors.clear();
        this.receiptId = item.receiptId;
        Object.assign(this.popUpConfig, {
            submitFunc: this.submitCancelReason,
            isShow: true,
            height: 100,
            title: 'Reason for Canceling',
            isSubmit: true,
            modal: 'cancel'
        });
    }

    submitCancelReason() {
        this.$validator.validate().then( valid => {
                if (valid) {
                    this.loading = true;
                    const { receiptId, reason } = this;
                    const params = {
                        receiptId,
                        reason: {
                            reason
                        }
                    };
                    InboundService.cancelReceipt( params ).subscribe(
                        res => {
                            this.loading = false;
                            this.popUpConfig.isShow = false;
                            this.reason = '';
                            this.searchReport();
                        },
                        err => {
                            this.loading = false;
                            this.popUpConfig.isShow = false;
                            this.reason = '';
                            errorHandler.handle(err);
                        }
                    );
                }
        });
    }
}
