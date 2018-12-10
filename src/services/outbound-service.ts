
import BaseService from "./_base-service";

class OutboundService extends BaseService {

    searchByPaging(searchParam: any) {
        return this.resource$.post<any>("/bam/outbound/order/search-by-paging", searchParam);
    }
}

export default new OutboundService();

