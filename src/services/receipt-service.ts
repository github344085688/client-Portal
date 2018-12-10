
import BaseService from "./_base-service";

class ReceiptService extends BaseService {

    searchByPaging(searchParam: any) {

        return this.resource$.post<any>(`/bam/inbound/receipt/search-by-paging`, searchParam);
    }

    searchReceiptByPaging(searchParam: any, accessUrl: string) {
        return this.resource$.post<any>(`/${accessUrl}/wms-app/inbound/receipt/search-by-paging`, searchParam);
    }

    get(receiptId: string, accessUrl: string) {
        return this.resource$.get<any>(`/${accessUrl}/wms-app/inbound/receipt/${receiptId}`);
    }

}

export default new ReceiptService();