
import BaseService from "./_base-service";

class InboundService extends BaseService {

    searchByPaging(searchParam: any) {

        return this.resource$.post<any>("/bam/inbound/receipt/search-by-paging", searchParam);
    }
}

export default new InboundService();

