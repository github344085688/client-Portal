
import BaseService from "./_base-service";
import ax from '../shared/axios';

class ReportService extends BaseService {

    searchAgingReportByPaging(searchParam: any, accessUrl: string) {
        return this.resource$.post<any>(`/${accessUrl}/report-center/inventory/aging-report/search-by-paging`, searchParam);
    }

    agingReportDownLoad(searchParam: any, accessUrl: string) {

        return ax.post(`/${accessUrl}/report-center/inventory/aging-report/download`, searchParam, {
            responseType: 'arraybuffer'
        });
    }
    searchActivityReportByPaging(searchParam: any, accessUrl: string) {
        return this.resource$.post<any>(`/${accessUrl}/report-center/inventory/balance-report/search-by-paging`, searchParam);
    }

    activityDownLoad(searchParam: any, accessUrl: string) {
        return ax.post(`/${accessUrl}/report-center/inventory/balance-report/download`, searchParam, {
            responseType: 'arraybuffer'
        });
    }

    searchAdjustmentReportByPaging(searchParam: any, accessUrl: string) {
        return this.resource$.post<any>(`/${accessUrl}/report-center/inventory/adjustment-report/search-by-paging`, searchParam);
    }

    adjustmentDownLoad(searchParam: any, accessUrl: string) {
        return ax.post(`/${accessUrl}/report-center/inventory/adjustment-report/download`, searchParam, {
            responseType: 'arraybuffer'
        });
    }

    searchStatusReportByPaging(searchParam: any, accessUrl: string) {
        return this.resource$.post<any>(`/${accessUrl}/report-center/inventory/status-report/search-by-paging`, searchParam);
    }

    statusReportDownLoad(searchParam: any, accessUrl: string) {
        return ax.post(`/${accessUrl}/report-center/inventory/status-report/download`, searchParam, {
            responseType: 'arraybuffer'
        });
    }

    searchReceiptLevelReportByPaging(searchParam: any, accessUrl: string) {
        return this.resource$.post<any>(`/${accessUrl}/report-center/inbound/inbound-report/receipt-level/search-by-paging`, searchParam);
    }

    receiptLevelDownLoad(searchParam: any, accessUrl: string) {
        return ax.post(`/${accessUrl}/report-center/inbound/inbound-report/receipt-level/download`, searchParam, {
            responseType: 'arraybuffer'
        });
    }

    searchItemLevelReportByPaging(searchParam: any, accessUrl: string) {
        return this.resource$.post<any>(`/${accessUrl}/report-center/inbound/inbound-report/item-level/search-by-paging`, searchParam);
    }

    itemLevelDownLoad(searchParam: any, accessUrl: string) {
        return ax.post(`/${accessUrl}/report-center/inbound/inbound-report/item-level/download`, searchParam, {
            responseType: 'arraybuffer'
        });
    }

    searchOutboundScheduleReportByPaging(searchParam: any, accessUrl: string) {
        return this.resource$.post<any>(`/${accessUrl}/report-center/outbound/schedule-report/order-level/search-by-paging`, searchParam);
    }

    searchOutboundScheduleItemLineByPaging(searchParam: any, accessUrl: string) {
        return this.resource$.post<any>(`/${accessUrl}/report-center/outbound/schedule-report/itemline-level/search-by-paging`, searchParam);
    }

    outboundScheduleDownLoadByOrderLevel(searchParam: any, accessUrl: string) {
        return ax.post(`/${accessUrl}/report-center/outbound/schedule-report/order-level/download`, searchParam, {
            responseType: 'arraybuffer'
        });
    }

    outboundScheduleDownLoadByItemLineLevel(searchParam: any, accessUrl: string) {
        return ax.post(`/${accessUrl}/report-center/outbound/schedule-report/itemline-level/download`, searchParam, {
            responseType: 'arraybuffer'
        });
    }

    searchOutboundShippingReportByPaging(searchParam: any, accessUrl: string) {
        return this.resource$.post<any>(`/${accessUrl}/report-center/outbound/shipping-report/order-level/search-by-paging`, searchParam);
    }
    searchOutboundShippingItemLineByPaging(searchParam: any, accessUrl: string) {
        return this.resource$.post<any>(`/${accessUrl}/report-center/outbound/shipping-report/itemline-level/search-by-paging`, searchParam);
    }

    searchOutboundShippingReportItemlineLevelByPaging(searchParam: any, accessUrl: string) {
        return this.resource$.post<any>(`/${accessUrl}/report-center/outbound/shipping-report/itemline-level/search-by-paging`, searchParam);
    }

    searchOutboundShippingOrderLevelByPaging(searchParam: any, accessUrl: string) {
        return this.resource$.post<any>(`/${accessUrl}/outbound/shipping-report/order-level/search-by-paging`, searchParam);
    }

    outboundShippingDownLoadByOrderLevel(searchParam: any, accessUrl: string) {
        return ax.post(`/${accessUrl}/report-center/outbound/shipping-report/order-level/download`, searchParam, {
            responseType: 'arraybuffer'
        });
    }

    outboundShippingDownLoadByItemLineLevel(searchParam: any, accessUrl: string) {
        return ax.post(`/${accessUrl}/report-center/outbound/shipping-report/itemline-level/download`, searchParam, {
            responseType: 'arraybuffer'
        });
    }

    searchInventoryByPaging(searchParam: any, accessUrl: string) {
        return this.resource$.post<any>(`/${accessUrl}/bam/wms-app/inventories/search-by-paging`, searchParam);
    }

    inventoryExport(searchParam: any, accessUrl: string) {
        return ax.post(`/${accessUrl}/wms-app/inventory/export`, searchParam, {
            responseType: 'arraybuffer'
        });
    }

    overallReportExport(searchParam: any, accessUrl: string) {
        return ax.post(`/${accessUrl}/report-center/inventory/overall-report/download`, searchParam, {
            responseType: 'arraybuffer'
        });
    }

    searchOverallReport(searchParam: any, accessUrl: string) {
        return this.resource$.post<any>(`/${accessUrl}/report-center/inventory/overall-report/search-by-paging`, searchParam);
    }

}

export default new ReportService();

