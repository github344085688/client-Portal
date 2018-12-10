
import PredefinedCustomerSelect from "../../../../../components/predefined-customer-select/predefined-customer-select";
import PredefinedExportBtn from "../../../../../components/predefined-export-btn/predefined-export-btn";
import ReceiptAutoComplete from "../../../../../components/receipt-auto-complete/receipt-auto-complete";
import SimplifiedPager from "../../../../../components/simplified-pager/simplified-pager";
import CustomizeTable from "../../../../../components/customize-table/customize-table";
import FacilitySelect from "../../../../../components/facility-select/facility-select";
import ElementSelect from "../../../../../components/element-select/element-select";
import WaittingBtn from "../../../../../components/waitting-button/waitting-btn";
import DateRange from "../../../../../components/date-range/date-range";
import Pager from "../../../../../components/pager/pager";
import errorHandler from "../../../../../shared/error-handler";
import WiseVue from "../../../../../shared/wise-vue";
import session from "../../../../../shared/session";
import util from "../../../../../shared/util";
import reportService from "../../../../../services/report-service";
import { Component } from "vue-property-decorator";
import { map, compact, find, cloneDeep, difference, forEach, join } from "lodash-es";
import tlp from "./receipt.vue";
import { Subject } from "rxjs/Subject";
import "rxjs/add/operator/debounceTime";
import errorHanlder from '../../../../../shared/error-handler';
import constants from '../../../../../shared/constants';
import itemService from "../../../../../services/item-service";
import itemUnitService from "../../../../../services/itemUnit-service";
import inventoryService from "../../../../../services/inventory-service";
@Component({
    mixins: [tlp],
    components: {
        PredefinedCustomerSelect,
        PredefinedExportBtn,
        ElementSelect,
        ReceiptAutoComplete,
        FacilitySelect,
        DateRange,
        CustomizeTable,
        Pager,
        WaittingBtn,
        SimplifiedPager
    }
})
export default class Received extends WiseVue {

    receiptedSearchParam: any = { paging: { pageNo: 1, limit: 10 } };
    receiptedReports: any = {};
    receiptStatus: Array<any> = [{ name: 'All' }, { name: 'In Yard', dbName: 'IN_YARD' }, { name: 'In Progress', dbName: 'IN_PROGRESS' }, { name: 'Task Completed', dbName: 'TASK_COMPLETED' }, { name: 'Exception', dbName: 'EXCEPTION' }, { name: 'Closed', dbName: 'CLOSED' }, { name: 'Force Closed', dbName: 'FORCE_CLOSED' }, { name: 'Cancelled', dbName: 'CANCELLED' }, { name: 'Reopened', dbName: 'REOPENED' }];
    tableFileds: Array<any> = [];
    facilities: Array<any> = [];
    tableHead: any;

    searchResultPaging: any = {};

    loading = false;
    initTableHead = false;
    customerIds: Array<string> = [];
    exportLoading: boolean = false;
    searchByInput: Subject<void> = new Subject();
    itemSNDetails: any = {};
    ItemShowSNDetais: any = {};
    ItemSNDetailoading: any = {};
    exportDates: Array<any> = ['Receipt Level (.xls)', 'Item Level (.xls)'];
    onSelectExportName(payload: any) {

        if (payload === 'Receipt Level (.xls)') {
            this.exportReceiptLevelExcel();
        }
        else if (payload === 'Item Level (.xls)') {
            this.exportItemLevelExcel();
        }
    }

    onSelectDateRange(payload: any) {
        this.receiptedSearchParam.startTime = payload.timeFrom;
        this.receiptedSearchParam.endTime = payload.timeTo;
        this.searchReport();
    }

    onSelectReceiptStatus(payload: any) {
        if (payload === "All") {
            this.receiptedSearchParam.receiptStatuses = compact(map(this.receiptStatus, 'dbName'));
        } else {
            let data: any = find(this.receiptStatus, { name: payload });
            this.receiptedSearchParam.receiptStatuses = [data.dbName];
        }
        this.searchReport();
    }

    onSelectCustomizeTable(payload: any) {
        let head = map(payload, "fieldName");
        this.tableHead = head;
        this.receiptedReports.head = head;
    }

    onReceiptSelectChange(payload: any) {
        if (!payload) {
            if (this.receiptedSearchParam.receiptId) {
                delete this.receiptedSearchParam.receiptId;
            }
        } else {
            this.receiptedSearchParam.receiptIds = [payload.id];
        }

        this.searchReport();
    }

    onSelectFacilityChange(payload: any) {
        let name = payload;
        if (this.receiptedSearchParam.receiptIds) {
            delete this.receiptedSearchParam.receiptIds;
        }
        this.searchReport();
    }

    onselectCustomerChange(payload: any) {
        this.searchReport();
    }

    searchReceiptLevelReportByPaging() {
        this.receiptedReports = [];
        this.searchResultPaging = [];
        this.initReceiptChildItem();
        this.loading = true;
        let searchParam = cloneDeep(this.receiptedSearchParam);
        if (searchParam.useless) {
            delete searchParam.useless;
        }

        reportService.searchReceiptLevelReportByPaging(searchParam, this.receiptedSearchParam.facility.accessUrl).subscribe(
            res => {
                this.receiptedReports = res.results;
                this.searchResultPaging = res.paging;
                this.loading = false;
                this.initTableBySelectedHead();
                this.initTableHead = true;
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
        this.receiptedSearchParam.endTime = util.fomateEndDate(new Date());
        this.receiptedSearchParam.startTime = util.fomateStartDate(currentDate);
        this.receiptedSearchParam.receiptStatuses = compact(map(this.receiptStatus, 'dbName'));
        this.receiptedSearchParam.reportType = "INBOUND_FINISHED";
        this.receiptedSearchParam.useless = 'All';
        this.customerIds  = this.getCustomerIds();
        this.searchReceiptLevelReportByPaging();
    }

    private searchReport() {
        this.receiptedSearchParam.paging = { pageNo: 1, limit: 10 };
        this.searchReceiptLevelReportByPaging();
    }

    private initTableBySelectedHead() {

        if (this.initTableHead) {
            if (this.tableHead) {
                this.receiptedReports.head = this.tableHead;
            }

        } else {
            this.receiptedReports.head.forEach((head: any) => {
                let field = { fieldId: head, fieldName: head, checked: true };
                this.tableFileds.push(field);
            });
        }
    }

    triggerSearchFromPager(pager: any) {
        this.receiptedSearchParam.paging.limit = pager.pageSize;
        this.receiptedSearchParam.paging.pageNo = pager.currentPage;
        this.searchReceiptLevelReportByPaging();
    }

    private initReceiptChildItem() {
        this.itemLoading = {};
        this.childItemShow = {};
        this.itemLevelReport = {};
        this.itemLevelReportPager = {};
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
        param.reportType = "INBOUND_FINISHED";
        reportService.searchItemLevelReportByPaging(param, this.receiptedSearchParam.facility.accessUrl).subscribe(
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
        return this.itemLevelReport[receiptId] ? difference(this.itemLevelReport[receiptId].head, this.receiptedReports.head) : [];
    }

    mounted() {
        this.init();
        this.searchByInput.debounceTime(constants.debounceTime).subscribe(
            this.searchByInputReport,
            err => {
                errorHanlder.handle(err);
            }
        );
    }

    searchByInputReport() {
        this.searchReport();
    }

    getItemSNShowName(...arg: any[]) {
        let names = [...arg];
        return join(names, '');

    }

    async showSNListTable(item: any, recieptId: any) {
        let itemSpecId: any = '';
        let unitId: any = '';
        let _this = this;
        let itemfilterName = `${item['Item ID']}${item['Title']}${item['Received UOM']}`;
        if (this.ItemShowSNDetais[itemfilterName]) {
            this.ItemShowSNDetais[itemfilterName] = false;
            this.$forceUpdate();
            return;
        }
        this.ItemShowSNDetais[itemfilterName] = true;
        this.ItemSNDetailoading[itemfilterName] = true;
        this.$forceUpdate();
        if (this.itemSNDetails[itemfilterName]) {
            this.ItemSNDetailoading[itemfilterName] = false;
            return;
        }
        await itemService.search({ name: item['Item ID'] }).toPromise().then(function (res) {
            let basicItem: any = find(res, { name: item['Item ID'] });
            if (basicItem) {
                itemSpecId = basicItem.id;
            }
        }, function (error) {
            errorHandler.handle(error);
        });
        await itemUnitService.searchItemUnit({ itemSpecId: itemSpecId, name: item['Expected UOM'] }).toPromise().then(function (res) {
            let unit: any = find(res, { name: item['Expected UOM'] });
            if (unit) {
                unitId = unit.id;
            }
        }, function (error) {
            errorHandler.handle(error);
        });
        await inventoryService.searchInventoryDetail({ itemSpecId: itemSpecId, receiptId: recieptId, unitId: unitId }, this.receiptedSearchParam.facility.accessUrl).toPromise().then(function (res) {
            let itemSnList = map(res.inventories, 'sn');
            _this.ItemSNDetailoading[itemfilterName] = false;
            _this.itemSNDetails[itemfilterName] = itemSnList;
            _this.$forceUpdate();
        }, function (error) {
            errorHandler.handle(error);
        });
    }



    private exportReceiptLevelExcel() {
        this.exportLoading = true;
        reportService.receiptLevelDownLoad(this.receiptedSearchParam, this.receiptedSearchParam.facility.accessUrl).then((res => {
            this.exportLoading = false;
            util.exportFile(res, "Inbound-Receipt-Level-Received.xlsx");
        })).catch(err => {
            this.exportLoading = false;
            errorHandler.handle(err);
        });
    }

    private exportItemLevelExcel() {
        this.exportLoading = true;
        reportService.itemLevelDownLoad(this.receiptedSearchParam, this.receiptedSearchParam.facility.accessUrl).then((res => {
            this.exportLoading = false;
            util.exportFile(res, "Inbound-Item-Level-Received.xlsx");
        })).catch(err => {
            this.exportLoading = false;
            errorHandler.handle(err);
        });
    }
}