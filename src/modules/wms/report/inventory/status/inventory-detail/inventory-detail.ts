
import WaittingBtn from "@components/waitting-button/waitting-btn";
import Pager from "@components/pager/pager";
import errorHandler from "@shared/error-handler";
import CustomerWiseVue from "@shared/customer-wise-vue";
import inventoryService from "@services/inventory-service";
import { Component, Prop, Provide } from "vue-property-decorator";
import tlp from "./inventory-detail.vue";
@Component({
    mixins: [tlp],
    components: {
        Pager,
        WaittingBtn
    }
})
export default class InventoryDetail extends CustomerWiseVue {

    inventorySearchParam: any = { paging: { pageNo: 1, limit: 10 } };
    currentInfo: any = {};
    inventories: any = [];
    searchResultPaging: any = {};

    loading = false;
    exportLoading: boolean = false;
    searchInventoryDetailByPaging() {

        this.inventories = [];
        this.searchResultPaging = [];
        this.loading = true;
        let searchParam = this.inventorySearchParam;
        inventoryService.searchInventoryStatusItemDetail(searchParam).subscribe(
            res => {
                this.inventories = res.results;
                this.searchResultPaging = res.paging;
                this.loading = false;
            },
            err => {
                this.loading = false;
                errorHandler.handle(err);
            }
        );
    }

    private searchReport() {
        this.inventorySearchParam.statuses = [this.currentInfo.status];
        if (this.currentInfo.status === 'Damaged') {
            this.inventorySearchParam.statuses =  ['Damage'];
        }
        if (this.currentInfo.status === 'Hold') {
            this.inventorySearchParam.statuses = ['OnHold'];
        }
        this.inventorySearchParam.paging = { pageNo: 1, limit: 10 };
        this.inventorySearchParam.customerId = this.getCustomerIdByUserSelect();
        this.inventorySearchParam.titleId = this.currentInfo.titleId;
        this.inventorySearchParam.itemSpecId = this.currentInfo.itemSpecId;
        this.inventorySearchParam.reportCategory = "INVENTORY_STATUS_ITEM_DETAIL";
        this.searchInventoryDetailByPaging();
    }



    triggerSearchFromPager(pager: any) {
        this.inventorySearchParam.paging.limit = pager.pageSize;
        this.inventorySearchParam.paging.pageNo = pager.currentPage;
        this.searchInventoryDetailByPaging();
    }

    mounted() {
        this.currentInfo = this.$route.query;
        this.searchReport();
    }

    exportExcel() {
        //     this.exportLoading = true;
        //     reportService.statusReportDownLoad(this.inventorySearchParam).then((res => {
        //         this.exportLoading = false;
        //         util.exportFile(res, ".xlsx");
        //     })).catch(err => {
        //         this.exportLoading = false;
        //         errorHandler.handle(err);
        //     });
    }
}