
import BaseService from "./_base-service";
import ax from '@shared/axios';

class ReportService extends BaseService {

    searchAgingReportByPaging(searchParam: any) {
        return this.resource$.post<any>(`/report-center/inventory/aging-report/search-by-paging`, searchParam);
    }

    agingReportDownLoad(searchParam: any) {

        return ax.post(`/report-center/inventory/aging-report/download`, searchParam, {
            responseType: 'arraybuffer'
        });
    }
    searchActivityReportByPaging(searchParam: any) {
        return this.resource$.post<any>(`/report-center/inventory/balance-report/search-by-paging`, searchParam);
    }

    activityDownLoad(searchParam: any) {
        return ax.post(`/report-center/inventory/balance-report/download`, searchParam, {
            responseType: 'arraybuffer'
        });
    }
    activityDetailLevelDownLoad(searchParam: any) {
        return ax.post(`/report-center/inventory/balance-report/activities/download`, searchParam, {
            responseType: 'arraybuffer'
        });
    }
    searchAdjustmentReportByPaging(searchParam: any) {
        return this.resource$.post<any>(`/report-center/inventory/adjustment-report/search-by-paging`, searchParam);
    }

    adjustmentDownLoad(searchParam: any) {
        return ax.post(`/report-center/inventory/adjustment-report/download`, searchParam, {
            responseType: 'arraybuffer'
        });
    }

    searchStatusReportByPaging(searchParam: any) {
        return this.resource$.post<any>(`/report-center/inventory/status-report/search-by-paging`, searchParam);
    }

    statusReportDownLoad(searchParam: any) {
        return ax.post(`/report-center/inventory/status-report/download`, searchParam, {
            responseType: 'arraybuffer'
        });
    }

    searchReceiptLevelReportByPaging(searchParam: any) {
        return this.resource$.post<any>(`/report-center/inbound/inbound-report/receipt-level/search-by-paging`, searchParam);
    }

    receiptLevelDownLoad(searchParam: any) {
        return ax.post(`/report-center/inbound/inbound-report/receipt-level/download`, searchParam, {
            responseType: 'arraybuffer'
        });
    }

    searchItemLevelReportByPaging(searchParam: any) {
        return this.resource$.post<any>(`/report-center/inbound/inbound-report/item-level/search-by-paging`, searchParam);
    }

    itemLevelDownLoad(searchParam: any) {
        return ax.post(`/report-center/inbound/inbound-report/item-level/download`, searchParam, {
            responseType: 'arraybuffer'
        });
    }

    searchOutboundScheduleReportByPaging(searchParam: any) {
        return this.resource$.post<any>(`/report-center/outbound/schedule-report/order-level/search-by-paging`, searchParam);
    }

    searchOutboundScheduleItemLineByPaging(searchParam: any) {
        return this.resource$.post<any>(`/report-center/outbound/schedule-report/itemline-level/search-by-paging`, searchParam);
    }

    outboundScheduleDownLoadByOrderLevel(searchParam: any) {
        return ax.post(`/report-center/outbound/schedule-report/order-level/download`, searchParam, {
            responseType: 'arraybuffer'
        });
    }

    outboundScheduleDownLoadByItemLineLevel(searchParam: any) {
        return ax.post(`/report-center/outbound/schedule-report/itemline-level/download`, searchParam, {
            responseType: 'arraybuffer'
        });
    }

    searchOutboundShippingReportByPaging(searchParam: any) {
        return this.resource$.post<any>(`/report-center/outbound/shipping-report/order-level/search-by-paging`, searchParam);
    }
    searchOutboundShippingItemLineByPaging(searchParam: any) {
        return this.resource$.post<any>(`/report-center/outbound/shipping-report/itemline-level/search-by-paging`, searchParam);
    }

    searchOutboundShippingReportItemlineLevelByPaging(searchParam: any) {
        return this.resource$.post<any>(`/report-center/outbound/shipping-report/itemline-level/search-by-paging`, searchParam);
    }

    searchOutboundShippingOrderLevelByPaging(searchParam: any) {
        return this.resource$.post<any>(`/outbound/shipping-report/order-level/search-by-paging`, searchParam);
    }

    outboundShippingDownLoadByOrderLevel(searchParam: any) {
        return ax.post(`/report-center/outbound/shipping-report/order-level/download`, searchParam, {
            responseType: 'arraybuffer'
        });
    }

    outboundShippingDownLoadByItemLineLevel(searchParam: any) {
        return ax.post(`/report-center/outbound/shipping-report/itemline-level/download`, searchParam, {
            responseType: 'arraybuffer'
        });
    }

    searchInventoryByPaging(searchParam: any) {
        return this.resource$.post<any>(`/bam/wms-app/inventories/search-by-paging`, searchParam);
    }

    inventoryExport(searchParam: any) {
        return ax.post(`/wms-app/inventory/export`, searchParam, {
            responseType: 'arraybuffer'
        });
    }

    overallReportExport(searchParam: any) {
        return ax.post(`/report-center/inventory/overall-report/download`, searchParam, {
            responseType: 'arraybuffer'
        });
    }

    searchOverallReport(searchParam: any) {
        return this.resource$.post<any>(`/report-center/inventory/overall-report/search-by-paging`, searchParam);
    }

    searchPutawayReportByPaging(param: any) {
        return this.resource$.post<any>(`/report-center/inbound/receive-putaway-report/search-by-paging`, param);
    }

    putAwayReportDownLoad(searchParam: any) {
        return ax.post(`/report-center/inbound/receive-putaway-report/download`, searchParam, {
            responseType: 'arraybuffer'
        });
    }

    itemSpecDownLoad(searchParam: any) {
        return ax.post(`/report-center/item-spec/export`, searchParam, {
            responseType: 'arraybuffer'
        });
    }
    /* new report api */
    searchGenericTransload(param: any) {
        return this.resource$.post<any>(`/report-center/transload/search-by-paging`, param);
    }

    downloadGenericTransload(searchParam: any) {
        return ax.post(`/report-center/transload/download`, searchParam, {
            responseType: 'arraybuffer'
        });
    }

    multipleActivityDownLoad(searchParam: any) {
        return ax.post(`/report-center/inventory/balance-report/multiple-facility-download`, searchParam, {
            responseType: 'arraybuffer'
        });
    }

    multipleActivityDetailLevelDownLoad(searchParam: any) {
        return ax.post(`/report-center/inventory/balance-report/activities/multiple-facility-download`, searchParam, {
            responseType: 'arraybuffer'
        });
    }

}

export default new ReportService();

