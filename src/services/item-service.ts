
import BaseService from "./_base-service";

class ItemService extends BaseService {

    get(itemSpecId: string) {
        return this.resource$.get<any>(`/bam/item-spec/${itemSpecId}`);
    }

    search(params: any) {
        return this.resource$.post<any>("/fd-app/item-spec/search", params);
    }

    itemSpec(params: any) {
        return this.resource$.post<any>("/bam/item-spec/search-by-paging", params);
    }
    searchBasicSearch(params: any) {
        let param = params;
        param.scenario = "Auto Complete";
        return this.resource$.post<any>("/bam/item-spec/basic-search", params);

    }

    getItemSpec(itemSpecId: string) {
        return this.resource$.get<any>(`/bam/item-spec/${itemSpecId}`);
    }

    searchItemUnit(params: any) {
        return this.resource$.post<any>(`/bam/item-unit/search`, params);
    }

    itemImportMappingSearch(params: any) {
        return this.resource$.post<any>(`/shared/fd-app/item-import/mapping/search`, params);
    }

    createOrderItemLine(orderId: any, params: any) {
        return this.resource$.post<any>(`/wms-app/outbound/order/${orderId}/item-line`, params);
    }

    upDataOrderItemLine(orderId: any, params: any) {
        return this.resource$.put<any>(`/wms-app/outbound/order/${orderId}/item-line/${params.id}`, params);
    }

    deleteOrderItemLine(orderId: any, itemId: any) {
        return this.resource$.delete<any>(`/wms-app/outbound/order/${orderId}/item-line/${itemId}`);
    }

    createReceiptItemLine(orderId: any, params: any) {
        return this.resource$.post<any>(`/wms-app/inbound/receipt/${orderId}/item-line`, params);
    }

    upDataReceiptItemLine(orderId: any, params: any) {
        return this.resource$.put<any>(`/wms-app/inbound/receipt/${orderId}/item-line/${params.id}`, params);
    }

    deleteReceiptItemLine(orderId: any, itemId: any) {
        return this.resource$.delete<any>(`/wms-app/inbound/receipt/${orderId}/item-line/${itemId}`);
    }

    searchGroupBasicInfo(params: any) {
        return this.resource$.post<any>(`/shared/fd-app/item-group/search`, params);
    }



}

export default new ItemService();

