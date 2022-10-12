
import BaseService from "./_base-service";
import ax from '@shared/axios';
class OutboundService extends BaseService {

    searchByPaging(searchParam: any) {
        return this.resource$.post<any>("/bam/outbound/order/search-by-paging", searchParam);
    }

    searchOutboundInquiryOrderLevelReportByPaging(searchParam: any) {
        return this.resource$.post<any>(`/report-center/outbound/outbound-inquiry-report/order-level/search-by-paging`, searchParam);
    }

    searchOutboundInquiryExpandingReportByPaging(searchParam: any) {
        return this.resource$.post<any>(`/report-center/outbound/outbound-inquiry-report/expanding/search-by-paging`, searchParam);
    }

    searchOutboundInquiryItemLevelReportByPaging(searchParam: any) {
        return this.resource$.post<any>(`/report-center/outbound/outbound-inquiry-report/item-level/search-by-paging`, searchParam);
    }

    searchOutboundInquiryIdLevelReportByPaging(searchParam: any) {
        return this.resource$.post<any>(`/report-center/outbound/outbound-inquiry-report/id-level/search-by-paging`, searchParam);
    }

    searchOutboundInquiryCartonLevelReportByPaging(searchParam: any) {
        return this.resource$.post<any>(`/report-center/outbound/outbound-inquiry-report/carton-level/search-by-paging`, searchParam);
    }

    expandingLevelDownLoad(searchParam: any) {
        return ax.post(`/report-center/outbound/outbound-inquiry-report/expanding/download`, searchParam, {
            responseType: 'arraybuffer'
        });
    }

    orderLevelDownLoad(searchParam: any) {
        return ax.post(`/report-center/outbound/outbound-inquiry-report/order-level/download`, searchParam, {
            responseType: 'arraybuffer'
        });
    }

    itemLevelDownLoad(searchParam: any) {
        return ax.post(`/report-center/outbound/outbound-inquiry-report/item-level/download`, searchParam, {
            responseType: 'arraybuffer'
        });
    }

    cartonLevelDownLoad(searchParam: any) {
        return ax.post(`/report-center/outbound/outbound-inquiry-report/carton-level/download`, searchParam, {
            responseType: 'arraybuffer'
        });
    }

    idLevelDownLoad(searchParam: any) {
        return ax.post(`/report-center/outbound/outbound-inquiry-report/id-level/download`, searchParam, {
            responseType: 'arraybuffer'
        });
    }

    searchScheduleSummaryReportByPaging(searchParam: any) {
        return this.resource$.post<any>(`/report-center/outbound/outbound-inquiry-report/schedule-summary/search`, searchParam);
    }

    searchShippingSummaryReportByPaging(searchParam: any) {
        return this.resource$.post<any>(`/report-center/outbound/outbound-inquiry-report/shipping-summary/search`, searchParam);
    }

    shippingSummaryDownLoad(searchParam: any) {
        return ax.post(`/report-center/outbound/outbound-inquiry-report/shipping-summary/download`, searchParam, {
            responseType: 'arraybuffer'
        });
    }

    scheduleSummaryDownLoad(searchParam: any) {
        return ax.post(`/report-center/outbound/outbound-inquiry-report/schedule-summary/download`, searchParam, {
            responseType: 'arraybuffer'
        });
    }

    downLoad(searchParam: any) {
            return ax.post(`/report-center/download/json-to-xlsx`, searchParam, {
                responseType: 'arraybuffer'
            });
    }

    expandingLevelFetchData(searchParam: any) {
        return this.resource$.post<any>(`/report-center/outbound/outbound-inquiry-report/expanding/fetch-data`, searchParam);
    }

    multipleFacilityDownload(searchParam: any) {
        return ax.post(`/report-center/outbound/outbound-inquiry-report/expanding/multiple-facility-download`, searchParam, {
            responseType: 'arraybuffer'
        });
    }

    cancelOrder(params: any) {
        const { orderId } = params;
        return this.resource$.put<any>(`/wms-app/outbound/order/${orderId}/cancel`, {});
    }

    searchOrderOffTimeByAllFacility(searchParam: any) { // {customerId: "ORG-xx", facilityIds: ["ORG-xx", "ORG-xx"]}
        return this.resource$.post<any>("/bam/wms-app/order-cut-off-time/search/all-facility", searchParam);
    }

    searchDropshipOBO(searchParam: any) {
        return this.resource$.post<any>("/report-center/dropship-obo/report", searchParam);
    }

    dropshipOboDownLoad(searchParam: any) {
        return ax.post(`/report-center/dropship-obo/download`, searchParam, {
            responseType: 'arraybuffer'
        });
    }

    getGenericBolPdf(loadId: string) {
        return this.resource$.get<any>(`/wms-app/outbound/bol/${loadId}/generic-bol-pdf`, {}, {});
    }

    getGenericPackingListPdf(orderId: string) {
        return this.resource$.get<any>(`/wms-app/outbound/order/${orderId}/generic-packing-list/print`, {}, {});
    }

}

export default new OutboundService();

