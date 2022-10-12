
import WaittingBtn from "@components/waitting-button/waitting-btn";
import Pager from "@components/pager/pager";
import errorHandler from "@shared/error-handler";
import CustomerWiseVue from "@shared/customer-wise-vue";
import session from '@shared/session';
import outboundService from "@services/outbound-service";
import customizationService from "@services/wms/customization-service";
import reportUtil from "@shared/report-util";
import { Component } from "vue-property-decorator";
import tlp from "./itemLineLevel-report.vue";
@Component({
    mixins: [tlp],
    components: {
        Pager,
        WaittingBtn
    }
})
export default class ItemLineLevel extends CustomerWiseVue {

    searchParam: any = { paging: { pageNo: 1, limit: 10 } };
    currentInfo: any = {};
    itemLevelList: any = [];
    searchResultPaging: any = {};

    loading = false;
    exportLoading: boolean = false;
    searchOutboundInquiryItemLevelReportByPaging() {

        this.itemLevelList = [];
        this.searchResultPaging = [];
        outboundService.searchOutboundInquiryExpandingReportByPaging(this.searchParam).subscribe(
            res => {
                this.itemLevelList = res.results;
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
        if (this.$route.query.orderItemLineIds) {
            this.searchParam.orderItemLineIds = this.$route.query.orderItemLineIds;
            if (typeof this.$route.query.orderItemLineIds === 'string') {
                this.searchParam.orderItemLineIds = [this.$route.query.orderItemLineIds];
            }
        }
        this.searchParam.paging = { pageNo: 1, limit: 10 };
        this.searchParam.customerId = this.getCustomerIdByUserSelect();
        this.searchParam.reportCategory = "OUTBOUND_INQUIRY";
        this.searchOutboundInquiryItemLevelReportByPaging();
    }

    customizitionTableView: any = {};
    private searchDefaultCustomization() {
        let customerId = this.getCustomerIdByUserSelect();
        if (!customerId) return;
        this.loading = true;
        customizationService.searchCustomization({ userId: session.getUserId(), reportCategory: "OUTBOUND_INQUIRY", customerId: customerId }).subscribe((res) => {
            this.customizitionTableView = res.tableHeaderSetting;
            this.searchParam.detailDynFields = reportUtil.getDetailDynFields(this.customizitionTableView);
            this.searchParam.DetailColumns = reportUtil.getIDLevelColumnList(this.customizitionTableView);
            this.searchReport();
        }, err => {
            this.loading = false;
            errorHandler.handle(err);
        });
    }

    triggerSearchFromPager(pager: any) {
        this.searchParam.paging.limit = pager.pageSize;
        this.searchParam.paging.pageNo = pager.currentPage;
        this.searchOutboundInquiryItemLevelReportByPaging();
    }

    mounted() {
        this.currentInfo = this.$route.query;
         this.searchDefaultCustomization();
    }
}
