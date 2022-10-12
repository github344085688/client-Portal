
import BaseService from "./_base-service";
import ax from '@shared/axios';
class InboundService extends BaseService {

    searchByPaging(searchParam: any) {

        return this.resource$.post<any>("/bam/inbound/receipt/search-by-paging", searchParam);
    }

    searchInquiryReceiptLevelReportByPaging(searchParam: any) {
        return this.resource$.post<any>(`/report-center/inbound/inbound-inquiry-report/receipt-level/search-by-paging`, searchParam);
    }

    searchInquiryExpandingReportByPaging(searchParam: any) {
        return this.resource$.post<any>(`/report-center/inbound/inbound-inquiry-report/expanding/search-by-paging`, searchParam);
    }

    searchInquiryItemLevelReportByPaging(searchParam: any) {
        return this.resource$.post<any>(`/report-center/inbound/inbound-inquiry-report/item-level/search-by-paging`, searchParam);
    }

    searchInquiryIdLevelReportByPaging(searchParam: any) {
        return this.resource$.post<any>(`/report-center/inbound/inbound-inquiry-report/id-level/search`, searchParam);
    }

    searchInquiryCartonLevelReportByPaging(searchParam: any) {
        return this.resource$.post<any>(`/report-center/inbound/inbound-inquiry-report/carton-level/search`, searchParam);
    }


    expandingLevelDownLoad(searchParam: any) {
        return ax.post(`/report-center/inbound/inbound-inquiry-report/expanding/download`, searchParam, {
            responseType: 'arraybuffer'
        });
    }

    receiptLevelDownLoad(searchParam: any) {
        return ax.post(`/report-center/inbound/inbound-inquiry-report/receipt-level/download`, searchParam, {
            responseType: 'arraybuffer'
        });
    }

    itemLevelDownLoad(searchParam: any) {
        return ax.post(`/report-center/inbound/inbound-inquiry-report/item-level/download`, searchParam, {
            responseType: 'arraybuffer'
        });
    }

    idLevelDownLoad(searchParam: any) {
        return ax.post(`/report-center/inbound/inbound-inquiry-report/id-level/download`, searchParam, {
            responseType: 'arraybuffer'
        });
    }

    cartonLevelDownLoad(searchParam: any) {
        return ax.post(`/report-center/inbound/inbound-inquiry-report/carton-level/download`, searchParam, {
            responseType: 'arraybuffer'
        });
    }

    searchScheduleSummaryReportByPaging(searchParam: any) {
        return this.resource$.post<any>(`/report-center/inbound/inbound-inquiry-report/schedule-summary/search`, searchParam);
    }

    searchReceivingSummaryReportByPaging(searchParam: any) {
        return this.resource$.post<any>(`/report-center/inbound/inbound-inquiry-report/receiving-summary/search`, searchParam);
    }

    receivingSummaryDownLoad(searchParam: any) {
        return ax.post(`/report-center/inbound/inbound-inquiry-report/receiving-summary/download`, searchParam, {
            responseType: 'arraybuffer'
        });
    }

    scheduleSummaryDownLoad(searchParam: any) {
        return ax.post(`/report-center/inbound/inbound-inquiry-report/schedule-summary/download`, searchParam, {
            responseType: 'arraybuffer'
        });
    }

    downLoad(searchParam: any) {
        return ax.post(`/report-center/download/json-to-xlsx`, searchParam, {
            responseType: 'arraybuffer'
        });
    }

    expandingLevelFetchData(searchParam: any) {
        return this.resource$.post<any>(`/report-center/inbound/inbound-inquiry-report/expanding/fetch-data`, searchParam);
    }

    multipleFacilityDownload(searchParam: any) {
        return ax.post(`/report-center/inbound/inbound-inquiry-report/expanding/multiple-facility-download`, searchParam, {
            responseType: 'arraybuffer'
        });
    }

    searchDocumentReturnLabel(searchParam: any) {
        return this.resource$.post<any>(`/report-center/document/return-label/trackingno-report/search-by-paging`, searchParam);
    }

    batchDownloadDocumentReturnLabel(searchParam: any) {
        return ax.post(`/report-center/document/return-label/batch-download`, searchParam, {
            responseType: 'arraybuffer'
        });
    }

    downloadDocumentReturnLabel(trackingNo: any) {
        return ax.get(`/bam/outbound/small-parcel-shipment/label/download/${trackingNo}`, {
            responseType: 'arraybuffer'
        });
    }


    cancelReceipt(params: any) {
        const { receiptId, reason } = params;
        return this.resource$.put(`/wms-app/inbound/receipt/${receiptId}/cancel`, reason);
    }

    printWithPicturesByReceiptId(receiptId: any ) {
        return this.resource$.get<any>(`/wms-app/outbound/tally-sheet/${receiptId}/print-with-pictures-by-receiptId`);
    }

}

export default new InboundService();

