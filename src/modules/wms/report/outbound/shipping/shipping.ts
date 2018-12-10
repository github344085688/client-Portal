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
import { map, compact, find, cloneDeep, difference, join } from "lodash-es";
import tlp from "./shipping.vue";
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
        OrganizationAutoComplete,
        PredefinedExportBtn,
        FacilitySelect,
        ElementSelect,
        OrderAutoComplete,
        DateRange,
        SimplifiedPager,
        CustomizeTable,
        Pager,
        WaittingBtn
    }
})
export default class Shipping extends WiseVue {

    shippingSearchParam: any = { paging: { pageNo: 1, limit: 10 } };
    shippingReports: any = {};
    shippingStatus: Array<any> = [{ name: 'All' }, { name: 'Shipped', dbName: 'SHIPPED' }, { name: 'Short Shipped', dbName: 'SHORT_SHIPPED' }, { name: 'Partial Shipped', dbName: 'PARTIAL_SHIPPED' }];
    tableFileds: Array<any> = [];
    facilities: Array<any> = [];
    tableHead: any;
    searchByInput: Subject<void> = new Subject();

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

    onSelectShippedDateRange(payload: any) {
        this.shippingSearchParam.shippedTimeFrom = payload.timeFrom;
        this.shippingSearchParam.shippedTimeTo = payload.timeTo;
        this.resetShippingParamAndsearchReport();
    }

    onSelectOrderDateRange(payload: any) {
        this.shippingSearchParam.orderedDateFrom = payload.timeFrom;
        this.shippingSearchParam.orderedDateTo = payload.timeTo;
        this.resetShippingParamAndsearchReport();
    }

    onSelectOrderStatus(payload: any) {
        if (payload === "All") {
            this.shippingSearchParam.statuses = compact(map(this.shippingStatus, 'dbName'));
        } else {
            let data: any = find(this.shippingStatus, { name: payload });
            this.shippingSearchParam.statuses = [data.dbName];
        }
        this.resetShippingParamAndsearchReport();
    }

    onSelectCustomizeTable(payload: any) {
        let head = map(payload, "fieldName");
        this.tableHead = head;
        this.shippingReports.head = head;
    }

    onOrderSelectChange(payload: any) {
        this.resetShippingParamAndsearchReport();
    }

    onSelectFacilityChange(payload: any) {
        if (this.shippingSearchParam.orderId) {
            delete this.shippingSearchParam.orderId;
        }
        this.resetShippingParamAndsearchReport();
    }

    onselectCustomerChange(payload: any) {
        this.resetShippingParamAndsearchReport();
    }

    private searchOutboundShippingReportByPaging() {
        this.shippingReports = [];
        this.searchResultPaging = [];
        this.initReceiptChildItem();
        this.loading = true;
        let searchParam = cloneDeep(this.shippingSearchParam);
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

        reportService.searchOutboundShippingReportByPaging(searchParam, this.shippingSearchParam.facility.accessUrl).subscribe(
            res => {
                this.shippingReports = res.results;
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
        this.shippingSearchParam.shippedTimeTo = util.fomateEndDate(new Date());
        this.shippingSearchParam.shippedTimeFrom = util.fomateStartDate(currentDate);
        this.shippingSearchParam.statuses = compact(map(this.shippingStatus, 'dbName'));
        this.shippingSearchParam.useless = 'All';
        this.customerIds = this.getCustomerIds();
        this.searchOutboundShippingReportByPaging();
    }

    private resetShippingParamAndsearchReport() {
        this.shippingSearchParam.paging = { pageNo: 1, limit: 10 };
        this.searchOutboundShippingReportByPaging();
    }

    private initTableBySelectedHead() {

        if (this.initload) {
            if (this.tableHead) {
                this.shippingReports.head = this.tableHead;
            }

        } else {
            this.shippingReports.head.forEach((head: any) => {
                let field = { fieldId: head, fieldName: head, checked: true };
                this.tableFileds.push(field);
            });
        }
    }

    triggerSearchFromPager(pager: any) {
        this.shippingSearchParam.paging.limit = pager.pageSize;
        this.shippingSearchParam.paging.pageNo = pager.currentPage;
        this.searchOutboundShippingReportByPaging();
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
        this.searchOutboundShippingItemLineByPaging(param);
    }

    searchItemLevelReportFromPager(pager: any) {
        let param: any = { paging: { pageNo: 1, limit: 10 } };
        if (pager.keyId && this.itemLevelReportPager[pager.keyId]) {
            param = this.itemLevelReportPager[pager.keyId];
            param.paging.limit = pager.pageSize;
            param.paging.pageNo = pager.currentPage;
            param.orderId = pager.keyId;
            this.searchOutboundShippingItemLineByPaging(param);
        }

    }

    private initReceiptChildItem() {
        this.itemLoading = {};
        this.childItemShow = {};
        this.itemLevelReport = {};
        this.itemLevelReportPager = {};
    }

    private searchOutboundShippingItemLineByPaging(param: any) {
        this.itemLoading[param.orderId] = true;
        reportService.searchOutboundShippingItemLineByPaging(param, this.shippingSearchParam.facility.accessUrl).subscribe(
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

    clickTrackingNo(carrierName: any, trackingNo: any) {

        if (carrierName === 'UPSN') {
            window.open("https://wwwapps.ups.com/WebTracking/track?track=yes&trackNums=" + trackingNo.replace(/,/g, "%0a"));
        } else if (carrierName === 'FDEG') {
            window.open("https://www.fedex.com/apps/fedextrack/?tracknumbers=" + trackingNo);
        }
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

        return this.itemLevelReport[orderId] ? difference(this.itemLevelReport[orderId].head, this.shippingReports.head) : [];
    }


    mounted() {
        this.searchTrackingNumbers.debounceTime(constants.debounceTime).subscribe(
            this.searchTrackingNumber,
            err => {
                errorHanlder.handle(err);
            }
        );
        this.$nextTick(function () {
            this.init();
        });
        this.searchByInput.debounceTime(constants.debounceTime).subscribe(
            this.searchByInputReport,
            err => {
                errorHanlder.handle(err);
            }
        );
    }

    searchByInputReport() {
        this.resetShippingParamAndsearchReport();
    }

    searchTrackingNumber() {
        this.resetShippingParamAndsearchReport();
    }

    getItemSNShowName(...arg: any[]) {
        let names = [...arg];
        return join(names, '');

    }

    itemSNDetails: any = {};
    ItemShowSNDetais: any = {};
    ItemSNDetailoading: any = {};

    async showSNListTable(item: any, orderId: any) {
        let itemSpecId: any = '';
        let unitId: any = '';
        let _this = this;
        let itemfilterName = `${item['Item ID']}${item['Title']}${item['UOM']}${orderId}`;
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
        await itemUnitService.searchItemUnit({ itemSpecId: itemSpecId, name: item['UOM'] }).toPromise().then(function (res) {
            let unit: any = find(res, { name: item['UOM'] });
            if (unit) {
                unitId = unit.id;
            }
        }, function (error) {
            errorHandler.handle(error);
        });
        await inventoryService.searchInventoryDetail({ itemSpecId: itemSpecId, orderId: orderId, unitId: unitId }, this.shippingSearchParam.facility.accessUrl).toPromise().then(function (res) {
            let itemSnList = map(res.inventories, 'sn');
            _this.ItemSNDetailoading[itemfilterName] = false;
            _this.itemSNDetails[itemfilterName] = itemSnList;
            _this.$forceUpdate();
        }, function (error) {
            _this.ItemSNDetailoading[itemfilterName] = false;
            errorHandler.handle(error);
        });
    }


    exportItemLevelExcel() {
        this.exportLoading = true;
        reportService.outboundShippingDownLoadByItemLineLevel(this.shippingSearchParam, this.shippingSearchParam.facility.accessUrl).then((res => {
            this.exportLoading = false;
            util.exportFile(res, "outbound-Item-Level-Shipping.xlsx");
        })).catch(err => {
            this.exportLoading = false;
            errorHandler.handle(err);
        });
    }
    exportOrderLevelExcel() {
        this.exportLoading = true;
        reportService.outboundShippingDownLoadByOrderLevel(this.shippingSearchParam, this.shippingSearchParam.facility.accessUrl).then((res => {
            this.exportLoading = false;
            util.exportFile(res, "outbound-order-Level-Shipping.xlsx");
        })).catch(err => {
            this.exportLoading = false;
            errorHandler.handle(err);
        });
    }
}