
import WaittingBtn from "../../../../../../components/waitting-button/waitting-btn";
import Pager from "../../../../../../components/pager/pager";
import errorHandler from "../../../../../../shared/error-handler";
import WiseVue from "../../../../../../shared/wise-vue";
import inventoryService from "../../../../../../services/inventory-service";
import { Component, Prop, Provide } from "vue-property-decorator";
import tlp from "./inventory-detail.vue";
import itemService from "../../../../../../services/item-service";
import organizationService from "../../../../../../services/organization-service";
import { find } from "lodash-es";
@Component({
    mixins: [tlp],
    components: {
        Pager,
        WaittingBtn
    }
})
export default class InventoryDetail extends WiseVue {

    inventorySearchParam: any = { paging: { pageNo: 1, limit: 10 } };
    currentItem: any = {};
    currentTitle: any = { basic: {} };
    inventories: any = [];

    facility: any = {};
    itemSpecMap: any = {};
    diverseMap: any = {};
    unitMap: any = {};
    lpMap: any = {};
    searchResultPaging: any = {};

    loading = false;
    exportLoading: boolean = false;
    path: string = '';
    backPath: string = '';
    searchInventoryDetailByPaging() {

        this.inventories = [];
        this.searchResultPaging = [];
        this.loading = true;
        let searchParam = this.inventorySearchParam;
        searchParam.customerId = this.$route.params.customerId;
        this.path = this.$route.params.path;
        this.backPath = `Back To ${this.$route.params.path}` ;
        searchParam = this.addStatusToObject(searchParam);
        inventoryService.searchInventoryDetailByPaging(searchParam, this.$route.params.accessUrl).subscribe(
            res => {
                this.inventories = res.inventories;
                this.searchResultPaging = res.paging;
                this.itemSpecMap = res.itemSpecMap;
                this.diverseMap = res.diverseMap;
                this.unitMap = res.unitMap;
                this.lpMap = res.lpMap;
                this.loading = false;
            },
            err => {
                this.loading = false;
                errorHandler.handle(err);
            }
        );
    }

    private searchReport() {
        this.inventorySearchParam.paging = { pageNo: 1, limit: 10 };
        this.searchInventoryDetailByPaging();
    }

    triggerSearchFromPager(pager: any) {
        this.inventorySearchParam.paging.limit = pager.pageSize;
        this.inventorySearchParam.paging.pageNo = pager.currentPage;
        this.searchInventoryDetailByPaging();
    }

    mounted() {

        this.fillTitleIdAndItemSpecId(function (ctx: any) {
            ctx.searchInventoryDetailByPaging();
        });
    }
    async fillTitleIdAndItemSpecId(callback: any) {
        let cxt = this;
        await Promise.all([
            itemService.search({ name: this.$route.params.itemSpecId }).toPromise(),
            organizationService.search({ name: this.$route.params.title }).toPromise()]).then(function (res) {
                let items: any = find(res[0], { name: cxt.$route.params.itemSpecId });
                let orgs: any = find(res[1], { basic: { name: cxt.$route.params.title } });
                if (items) {
                    cxt.inventorySearchParam.itemSpecId = items.id;
                }
                if (orgs) {
                    cxt.inventorySearchParam.titleId = orgs.basic.id;
                }
                callback(cxt);
            }, function (error) {
                errorHandler.handle(error);
            });
    }

    private addStatusToObject(object: any) {
        if (!object) {
            object = {};
        }
        const status = this.$route.params.status;
        if (status === 'Damaged') {
            object.statuses = ['Damage'];
        }
        if (status === 'Hold') {
            object.statuses = ['OnHold'];
        }

        if (status === 'Available') {
            object.statuses = ['Available'];
        }

        if (status === 'Total') {
            object.statuses = ['Damage', 'OnHold', 'Available'];
        }
        return object;

    }

    backToStatus() {
        this.$router.replace({ name: this.path, params: { customerId: this.$route.params.customerId, accessUrl: this.$route.params.accessUrl, searchItemSpecId: this.$route.params.searchItemSpecId } });
    }

    exportExcel() {
        //     this.exportLoading = true;
        //     reportService.statusReportDownLoad(this.inventorySearchParam, this.facility.accessUrl).then((res => {
        //         this.exportLoading = false;
        //         util.exportFile(res, "inventoryStatus.xlsx");
        //     })).catch(err => {
        //         this.exportLoading = false;
        //         errorHandler.handle(err);
        //     });
    }
}