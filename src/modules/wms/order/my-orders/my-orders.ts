import { Component, Prop, Provide } from "vue-property-decorator";
import WiseVue from "../../../../shared/wise-vue";
import tlp from "./my-orders.vue";
import { map, debounceTime } from "rxjs/operators";
import { Loading } from "element-ui";
import { Subscription } from 'rxjs/Subscription';
import inboundService from '../../../../services/inbound-service';
import outboundService from '../../../../services/outbound-service';
import addressService from '../../../../services/address-service';
import errorHandler from "../../../../shared/error-handler";
import Pager from "../../../../components/pager/pager";
import ScrollPager from "../../../../components/scroll-pager/scroll-pager";

WiseVue.use(Loading);

@Component({
    mixins: [tlp],
    components: {
        Pager,
        ScrollPager
    }
})
export default class MyOrders extends WiseVue {


    orderSearch = { keyword: '', orderType: 'inbound' };
    orders: Array<any> = [];
    searchResultPaging: any = {};

    searchPaging = { pageNo: 1, limit: 10 };
    loading = false;

    async search() {
        this.loading = true;
        let searchParam = { keyword: this.orderSearch.keyword, paging: this.searchPaging };
        if (this.orderSearch.orderType === 'outbound') {
            outboundService.searchByPaging(searchParam).subscribe(
                res => {
                    this.orders = res.orders;
                    this.searchResultPaging = res.paging;
                    this.loading = false;
                },
                err => {
                    errorHandler.handle(err);
                    this.loading = false;
                }
            );

        } else {
            inboundService.searchByPaging(searchParam).subscribe(
                res => {
                    this.orders = res.receipts;
                    this.searchResultPaging = res.paging;
                    this.loading = false;
                },
                err => {
                    errorHandler.handle(err);
                    this.loading = false;
                }
            );
        }
    }



    triggerSearchFromPager(pager: any) {
        this.searchPaging.limit = pager.pageSize;
        this.searchPaging.pageNo = pager.currentPage;
        this.search();
    }



}