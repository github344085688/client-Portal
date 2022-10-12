import BaseService from "./_base-service";

class KpiService extends BaseService {

    searchSnapshot(params: any) {
        return this.resource$.post<any>("/wms-app/outbound/order/order-snapshot", params);
    }

    searchPerformanceMetrics(params: any) {
        return this.resource$.post<any>("/wms-app/outbound/order/performance-metrics", params);
    }

    searchReceiptSnapshot(params: any) {
        return this.resource$.post<any>("/wms-app/inbound/receipt/receipt-snapshot", params);
    }

    searchInYardReceiptSnapshot(params: any) {
        return this.resource$.post<any>("/wms-app/inbound/receipt/in-yard-receipt-snapshot", params);
    }
}

export default new KpiService();