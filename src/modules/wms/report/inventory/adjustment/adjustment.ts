import PredefinedCustomerSelect from "../../../../../components/predefined-customer-select/predefined-customer-select";
import ItemAutoComplete from "../../../../../components/itemspec-auto-complete/itemspec-auto-complete";
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
import { map, compact, find, cloneDeep } from "lodash-es";
import tlp from "./adjustment.vue";

@Component({
    mixins: [tlp],
    components: {
        PredefinedCustomerSelect,
        ElementSelect,
        ItemAutoComplete,
        FacilitySelect,
        DateRange,
        CustomizeTable,
        Pager,
        WaittingBtn
    }
})

export default class Adjustment extends WiseVue {
    adjustTypes: Array<any> = [{ name: 'All' }, { name: 'Location', dbName: 'ADJUST_LOCATION' }, { name: 'LP', dbName: 'ADJUST_LP' }, { name: 'Status', dbName: 'ADJUST_STATUS' }
        , { name: 'QTY', dbName: 'ADJUST_QTY' }, { name: 'Item', dbName: 'ADJUST_ITEM' }, { name: 'UOM', dbName: 'ADJUST_UOM' }, { name: 'Customer', dbName: 'ADJUST_CUSTOMER' }
        , { name: 'Title', dbName: 'ADJUST_TITLE' }, { name: 'Pallet', dbName: 'ADJUST_PALLET' }, { name: 'Material', dbName: 'ADJUST_MATERIAL' }, { name: 'Add Inventory', dbName: 'ADD_INVENTORY' }
        , { name: 'Lot No', dbName: 'ADJUST_LOTNO' }, { name: 'Expiration Date', dbName: 'ADJUST_EXPIRATIONDATE' }, { name: 'Mfg  Date', dbName: 'ADJUST_MFGDATE' }, { name: 'Shelf Life Days', dbName: 'ADJUST_SHELFLIFEDAYS' }
        , { name: 'SN', dbName: 'ADJUST_SN' }];

    adjustmentSearchInfo: any = { paging: { pageNo: 1, limit: 10 } };
    adjustmentReports: any = {};

    tableFileds: Array<any> = [];
    facilities: Array<any> = [];
    tableHead: any;

    searchResultPaging: any = {};

    loading = false;
    initload = false;
    customerIds: Array<string> = [];
    exportLoading: boolean = false;
    onSelectDateRange(payload: any) {
        this.adjustmentSearchInfo.timeFrom = payload.timeFrom;
        this.adjustmentSearchInfo.timeTo = payload.timeTo;
        this.searchReport();
    }

    onItemSelectChange(payload: any) {
        if (!payload) {
            delete this.adjustmentSearchInfo.itemSpecId;
            delete this.adjustmentSearchInfo.itemSpecIds;
        } else {
            this.adjustmentSearchInfo.itemSpecIds = [payload.id];
        }
        this.searchReport();
    }

    onSelectCustomizeTable(payload: any) {
        let head = map(payload, "fieldName");
        this.tableHead = head;
        this.adjustmentReports.head = head;
    }


    onSelectFacilityChange() {
        this.searchReport();
    }

    onSelectAdjustTypes(payload: any) {
        if (payload === "All") {
            this.adjustmentSearchInfo.types = compact(map(this.adjustTypes, 'dbName'));
        } else {
            let data: any = find(this.adjustTypes, { name: payload });
            this.adjustmentSearchInfo.types = [data.dbName];
        }
        this.searchReport();

    }
    onselectCustomerChange(payload: any) {
        this.searchReport();
    }

    private searchReport() {
        this.adjustmentSearchInfo.paging = { pageNo: 1, limit: 10 };
        this.searchAdjustmentReportByPaging();
    }

    searchAdjustmentReportByPaging() {
        this.adjustmentReports = [];
        this.searchResultPaging = [];
        this.loading = true;
        let searchParam = cloneDeep(this.adjustmentSearchInfo);
        if (searchParam.useless) {
            delete searchParam.useless;
        }
        reportService.searchAdjustmentReportByPaging(searchParam, this.adjustmentSearchInfo.facility.accessUrl).subscribe(
            res => {
                this.adjustmentReports = res.results;
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

    private init() {

        this.customerIds =  this.getCustomerIds();
        let currentDate = new Date();
        currentDate.setTime(currentDate.getTime() - 24 * 60 * 60 * 1000 * 6);
        this.adjustmentSearchInfo.timeTo = util.fomateEndDate(new Date());
        this.adjustmentSearchInfo.timeFrom = util.fomateStartDate(currentDate);
        this.adjustmentSearchInfo.types = compact(map(this.adjustTypes, 'dbName'));
        this.adjustmentSearchInfo.useless = 'All';
        this.searchAdjustmentReportByPaging();
    }

    private initTable() {

        if (this.initload) {
            if (this.tableHead) {
                this.adjustmentReports.head = this.tableHead;
            }

        } else {
            this.adjustmentReports.head.forEach((head: any) => {
                let field = { fieldId: head, fieldName: head, checked: true };
                this.tableFileds.push(field);
            });
        }
    }

    triggerSearchFromPager(pager: any) {
        this.adjustmentSearchInfo.paging.limit = pager.pageSize;
        this.adjustmentSearchInfo.paging.pageNo = pager.currentPage;
        this.searchAdjustmentReportByPaging();
    }

    mounted() {
        this.init();
    }

    exportExcel() {
        this.exportLoading = true;
        reportService.adjustmentDownLoad(this.adjustmentSearchInfo, this.adjustmentSearchInfo.facility.accessUrl).then((res => {
            this.exportLoading = false;
            util.exportFile(res, "inventoryAdjustment.xlsx");
        })).catch((err: any) => {
            this.exportLoading = false;
            errorHandler.handle(err);
        });
    }


}