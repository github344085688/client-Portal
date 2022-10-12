import CustomerWiseVue from '@shared/customer-wise-vue';
import { Component } from "vue-property-decorator";
import tlp from "./kpi.vue";
import DashboardService from '@services/dashboard-service';
import errorHandler from "@shared/error-handler";
import PredefinedCustomerSelect from "@components/predefined-customer-select/predefined-customer-select";
import FacilitySelect from "@components/facility-select/facility-select";

@Component({
    mixins: [tlp],
    components: {
        PredefinedCustomerSelect,
        FacilitySelect
    }
})
export default class Kpi extends CustomerWiseVue {

    customerId: string = '';
    customerIds: any = [];
    facilityId: string = '';
    regularOrder: Object = {};
    smallParcelOrder: Object = {};
    outboundPerformanceMetrics: any = {
        today: {},
        yesterday: {},
        lastSevenDays: {}
    };
    receiptSnapshot: any = {
        open: {},
        receiving: {},
        received: {}
    };
    inYardReceiptSnapshot: any = {
        today: {},
        yesterday: {},
        lastSevenDays: {}
    };

    mounted() {
        this.customerIds = this.getCustomerIds();
        this.customerId = this.getCustomerIdByUserSelect();
        this.init();
    }

    init() {
        this.getSmallParcelOrders();
        this.getRegularOrders();
        this.getOutboundPerformanceMetrics('Today');
        this.getOutboundPerformanceMetrics('Yesterday');
        this.getOutboundPerformanceMetrics('Last 7 Days');

        this.getReceiptSnapshot('Open');
        this.getReceiptSnapshot('In Progress');
        this.getReceiptSnapshot('Closed');

        this.getInYardReceiptSnapshot('Today');
        this.getInYardReceiptSnapshot('Yesterday');
        this.getInYardReceiptSnapshot('Last 7 Days');
    }

    changeCustomer() {
        this.init();
    }

    onSelectFacilityChange() {
        this.init();
    }

    getSmallParcelOrders() {
        let param = {
            customerId: this.customerId,
            orderType: 'DropShip Order'
        };
        DashboardService.searchSnapshot(param).subscribe(
            (res) => {
                this.smallParcelOrder = res;
            },
            (err) => {
                errorHandler.handle(err);
            }
        );
    }

    getRegularOrders() {
        let param = {
            customerId: this.customerId,
            orderType: 'Regular Order'
        };
        DashboardService.searchSnapshot(param).subscribe(
            (res) => {
                this.regularOrder = res;
            },
            (err) => {
                errorHandler.handle(err);
            }
        );
    }

    getOutboundPerformanceMetrics(daysType: string) {
        let param = {
            customerId: this.customerId,
            orderPerformanceMetricsDateType: daysType
        };
        DashboardService.searchPerformanceMetrics(param).subscribe(
            (res) => {
                if (daysType === 'Today') {
                    this.outboundPerformanceMetrics.today = res;
                } else if (daysType === 'Yesterday') {
                    this.outboundPerformanceMetrics.yesterday = res;
                } else {
                    this.outboundPerformanceMetrics.lastSevenDays = res;
                }
            },
            (err) => {
                errorHandler.handle(err);
            }
        );
    }

    getReceiptSnapshot(statuses: string) {
        let param = {
            customerId: this.customerId,
            statuses: [statuses]
        };
        DashboardService.searchReceiptSnapshot(param).subscribe(
            (res) => {
                if (statuses === 'Open') {
                    this.receiptSnapshot.open = res;
                } else if (statuses === 'In Progress') {
                    this.receiptSnapshot.receiving = res;
                } else {
                    this.receiptSnapshot.received = res;
                }
            },
            (err) => {
                errorHandler.handle(err);
            }
        );
    }

    getInYardReceiptSnapshot(daysType: string) {
        let param = {
            customerId: this.customerId,
            inYardReceiptSnapshotDateType: daysType
        };
        DashboardService.searchInYardReceiptSnapshot(param).subscribe(
            (res) => {
                if (daysType === 'Today') {
                    this.inYardReceiptSnapshot.today = res;
                } else if (daysType === 'Yesterday') {
                    this.inYardReceiptSnapshot.yesterday = res;
                } else {
                    this.inYardReceiptSnapshot.lastSevenDays = res;
                }
            },
            (err) => {
                errorHandler.handle(err);
            }
        );
    }
}