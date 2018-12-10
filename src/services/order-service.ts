
import BaseService from "./_base-service";

class ReceiptService extends BaseService {

    searchByPaging(searchParam: any, accessUrl: string) {
        return this.resource$.post<any>(`/bam/outbound/order/search-by-paging`, searchParam);
    }

    searchReceiptByPaging(searchParam: any, accessUrl: string) {
        return this.resource$.post<any>(`/${accessUrl}/wms-app/outbound/order/search-by-paging`, searchParam);
    }

    get(receiptId: string, accessUrl: string) {
        return this.resource$.get<any>(`/${accessUrl}/wms-app/outbound/order/${receiptId}`);
    }

}

export default new ReceiptService();