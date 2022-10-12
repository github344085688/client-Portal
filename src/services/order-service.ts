
import BaseService from "./_base-service";

class ReceiptService extends BaseService {

    searchByPaging(searchParam: any) {
        return this.resource$.post<any>(`/bam/outbound/order/search-by-paging`, searchParam);
    }

    searchReceiptByPaging(searchParam: any) {
        return this.resource$.post<any>(`/wms-app/outbound/order/search-by-paging`, searchParam);
    }

    get(receiptId: string) {
        return this.resource$.get<any>(`/wms-app/outbound/order/${receiptId}`);
    }

    batchUpdateOrder(Param: any) {
      return this.resource$.put<any>(`/wms-app/outbound/order/batch/update`, Param);
    }

    createOrder(params: any) {
        return this.resource$.post<any>(`/wms-app/outbound/order`, params);
    }


    upDataOrder(orderId: string, params: any, accessUrl?: String) {
        return this.resource$.put<any>(`/wms-app/outbound/order/${orderId}`, params, {}, {accessUrl: accessUrl});
    }

    getBamOrder(orderId: string, accessUrl?: String) {
        return this.resource$.get<any>(`/bam/outbound/order/${orderId}`, {}, { accessUrl: accessUrl });
    }

    searchByPagingClientDocument(params: any) {
        return this.resource$.post<any>(`/wms-app/client-document/search-by-paging`, params);
    }

    createClientDocument(params: any) {
        return this.resource$.post<any>(`/wms-app/client-document`, params);
    }

    importClientDocumentFromExcel(fileId: string) {
        return this.resource$.get<any>(`/wms-app/client-document/import-from-excel/${fileId}`);
    }

    deleteClientDocument(id: any) {
        return this.resource$.delete<any>(`/wms-app/client-document/delete/${id}`);
    }

}

export default new ReceiptService();
