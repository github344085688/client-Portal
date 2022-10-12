
import BaseService from "./_base-service";

class ReceiptService extends BaseService {

    searchByPaging(searchParam: any) {

        return this.resource$.post<any>(`/bam/inbound/receipt/search-by-paging`, searchParam);
    }

    searchReceiptByPaging(searchParam: any) {
        return this.resource$.post<any>(`/wms-app/inbound/receipt/search-by-paging`, searchParam);
    }

    get(receiptId: string) {
        return this.resource$.get<any>(`/wms-app/inbound/receipt/${receiptId}`);
    }

    createdReceipt(params: any) {
        return this.resource$.post<any>(`/wms-app/inbound/receipt`, params);
    }

    upDataReceipt(receiptId: string, params: any) {
        return this.resource$.put<any>(`/wms-app/inbound/receipt/${receiptId}`, params);
    }

    getBamReceipt(receiptId: string) {
        return this.resource$.get<any>(`/bam/inbound/receipt/${receiptId}`);
    }

    updateReceipt(params: any) {
        return this.resource$.put<any>(`/wms-app/inbound/receipt/${params.id}`, params);
    }

    searchReceipt(params: object) {
        return this.resource$.post<any>(`/bam/inbound/receipt/search`, params);
    }
}

export default new ReceiptService();