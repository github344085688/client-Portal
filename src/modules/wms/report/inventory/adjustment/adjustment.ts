
import PredefinedCustomerSelect from "@components/predefined-customer-select/predefined-customer-select";
import MultipleOrganizationAutoComplete from "@components/multiple-organization-auto-complete/multiple-organization-auto-complete";
import PredefinedTableLayout from "@components/predefined-table-layout/predefined-table-layout";
import ItemAutoComplete from "@components/itemspec-auto-complete/itemspec-auto-complete";
import SimplifiedPager from "@components/simplified-pager/simplified-pager";
import CustomizeTable from "@components/customize-table/customize-table";
import FacilitySelect from "@components/facility-select/facility-select";
import ElementSelect from "@components/element-select/element-select";
import MultipleItemAutoComplete from "@components/multiple-item-auto-complete/multiple-item-auto-complete";
import WaittingBtn from "@components/waitting-button/waitting-btn";
import TagsInput from "@components/tags-input/tags-input";
import DateRange from "@components/date-range/date-range";
import errorHandler from "@shared/error-handler";
import Pager from "@components/pager/pager";
import CustomerWiseVue from "@shared/customer-wise-vue";
import { Component } from "vue-property-decorator";
import { remove, cloneDeep, forEach, groupBy, isEmpty } from "lodash-es";
import inventoryService from "@services/inventory-service";
import reportUtil from "@shared/report-util";
import errorHanlder from '@shared/error-handler';
import constants from '@shared/constants';
import { Subject } from "rxjs/Subject";
import util from "@shared/util";
import "rxjs/add/operator/debounceTime";
import tlp from "./adjustment.vue";
@Component({
    mixins: [tlp],
    components: {
        PredefinedCustomerSelect,
        MultipleOrganizationAutoComplete,
        PredefinedTableLayout,
        ElementSelect,
        FacilitySelect,
        ItemAutoComplete,
        DateRange,
        CustomizeTable,
        Pager,
        WaittingBtn,
        SimplifiedPager,
        MultipleItemAutoComplete,
        TagsInput
    }
})
export default class Adjustment extends CustomerWiseVue {

    searchParam: any = {
        paging: { pageNo: 1, limit: 10 },
        reportCategory: 'INVENTORY_ADJUSTMENT',
        adjustEffect: ''
    };
    adjustmentReports: any = {};
    facilities: Array<any> = [];
    searchResultPaging: any = {};
    loading = false;
    customizeComplete = false;
    exportLoading: boolean = false;
    searchByInput: Subject<void> = new Subject();
    customizitionTableView: any = {};
    // adjustmentTypes: Array<any> = ['Adjust Location', 'Adjust Status', 'Adjust QTY', 'Add Inventory', 'Adjust Title', 'Adjust LotNo'];

    adjustmentTypes: Array<any> = ["All", "Adjust Location", "Adjust LP", "Adjust Status",
        "Adjust QTY", "Adjust Item", "Adjust UOM", "Adjust Customer", "Adjust Title",
        "Add Inventory", "Adjust LotNo", "Adjust ExpirationDate", "Adjust MfgDate", "Adjust ShelfLifeDays", "Adjust SN"];

    adjustEffects: Array<any> = ["AdjustOut", "AdjustIn"];
    onSelectDateRange(payload: any) {
        this.searchParam.timeFrom = payload.timeFrom;
        this.searchParam.timeTo = payload.timeTo;
        this.searchReport();
    }

    onSelectAdjustmentTypes(payload: any) {
        // this.searchReport();
    }

    onSelectCustomizeTable(payload: any) {
        this.customizitionTableView = payload;
        let query = this.$route.query;
        if (!isEmpty(query)) {
            this.searchReport();
        } else {
            if (!this.customizitionTableView.isFirstInit) {
                this.searchReport();
            }
        }
        this.customizeComplete = true;
        // this.searchReport();
    }

    onSelectFacilityChange(payload: any) {
        // this.searchReport();
    }

    onselectCustomerChange(payload: any) {
        this.customizeComplete = false;
        this.searchParam.itemSpecId = null;
        this.searchParam.titleIds = [];
        // this.searchReport();
    }

    onItemSelectChange(payload: any) {
        // this.searchReport();
    }


    selectedLayout: any = null;
    onGroupViewLayoutChange(layout: any) {
        this.selectedLayout = layout;
        if (!layout || !layout.groupColumns || layout.groupColumns.length === 0) {
            this.setInitGroupReport();
        } else {
            this.adjustmentReports.data = reportUtil.getReOrgGroupTableSource(this.orginInventoryStatus.data, layout);
        }
    }

    dragStart(event: any) {
        event.dataTransfer.setData("Text", event.target.innerText);
    }
    orginInventoryStatus: any = [];
    private searchInventoryAdjustmentByPaging() {
        if (!this.searchParam.headerList.length) {
            errorHandler.handle('Please Select at least one criteria for each customize column.');
            return;
        }
        this.adjustmentReports = [];
        this.searchResultPaging = [];
        this.loading = true;
        let searchParam = this.removeFacilityParamAndFillTitleIdsWhenSearch(cloneDeep(this.searchParam));
        if (!searchParam.types || searchParam.types.length === 0) {
            searchParam.types = this.adjustmentTypes;
        }
        inventoryService.searchInventoryAdjustmentByPaging(searchParam).subscribe(
            res => {
                this.orginInventoryStatus = cloneDeep(res.results);
                this.adjustmentReports = res.results;
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


    private setInitGroupReport() {
        let reports = cloneDeep(this.orginInventoryStatus.data);
        forEach(reports, (dt) => {
            dt.source = 'dbSource';
        });
        this.adjustmentReports.data = groupBy(reports, 'source');
        // when customize change and has been selected layout
        if (this.selectedLayout && this.selectedLayout.groupColumns.length > 0) {
            this.adjustmentReports.data = reportUtil.getReOrgGroupTableSource(this.orginInventoryStatus.data, this.selectedLayout);
        }
    }


    searchReport() {
        this.searchParam.paging = { pageNo: 1, limit: 10 };
        this.searchParam.headerList = reportUtil.getNestedColumnList(this.customizitionTableView);
        this.searchInventoryAdjustmentByPaging();
    }

    triggerSearchFromPager(pager: any) {
        this.searchParam.paging.limit = pager.pageSize;
        this.searchParam.paging.pageNo = pager.currentPage;
        this.searchInventoryAdjustmentByPaging();
    }


    mounted() {
        let query = this.$route.query;
        if (!isEmpty(query)) {
            this.searchParam.titleIds = query.titleId ? [query.titleId] : null;
            this.searchParam.itemSpecId = query.itemSpecId ? query.itemSpecId : null;
            this.searchParam.timeTo = query.timeTo ? query.timeTo : null;
            this.searchParam.timeFrom = query.timeFrom ? query.timeFrom : null;
            this.searchParam.adjustIds = query.adjustId ? [query.adjustId] : null;
            this.searchParam.adjustEffect = query.adjustEffect ? query.adjustEffect : '';
        } else {
            let currentDate = new Date();
            currentDate.setTime(currentDate.getTime() - 24 * 60 * 60 * 1000 * 2);
            this.searchParam.timeTo = util.fomateEndDate(new Date());
            this.searchParam.timeFrom = util.fomateStartDate(currentDate);
        }

    }

    exportExcel() {
        this.exportLoading = true;
        let searchParam = this.removeFacilityParamAndFillTitleIdsWhenSearch(cloneDeep(this.searchParam));
        inventoryService.adjustmentDownLoad(searchParam).then((res => {
            this.exportLoading = false;
            util.exportFile(res, "Inventory-Adjustment.xlsx");
        })).catch(err => {
            this.exportLoading = false;
            errorHandler.handle(err);
        });
    }
}