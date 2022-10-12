import Vue from "vue";
import { Component, Prop, Provide, Watch, Inject, } from "vue-property-decorator";
import template from "./orderHistory.vue";
import controlPanelService from "@services/control-panel/controlPanelService";
import errorHandler from "@shared/error-handler";

@Component({
    mixins: [template],
    name: 'orderHistory',
    components: {}
})
export default class OrderHistory extends Vue {
    orderHistoryArr: any = [];
    currentOrder: any = '';
    loadingHistory: Boolean = false;

    get watchOrderHistory() {
        return this.$store.state.currentOrder.orderId;
    }

    @Watch('watchOrderHistory', {
        deep: true
    })
    initOrderHistory() {
        this.currentOrder = this.$store.state.currentOrder.orderPro || "PU: " + this.$store.state.currentOrder.orderPu;
        this.getOrderHistoryById();
    }

    getOrderHistoryById() {
        this.loadingHistory = true;
        controlPanelService.getOrderHistory(this.$store.state.currentOrder.orderId).subscribe(
            (res: any) => {
                this.orderHistoryArr = res.logs;
                this.loadingHistory = false;
            },
            (err: any) => {
                this.loadingHistory = false;
                errorHandler.handle(err);
            }
        );
    }
}