
import BaseService from "./_base-service";
import ax from '../shared/axios';

class InventoryService extends BaseService {

    searchInventoryDetailByPaging(searchParam: any, accessUrl: string) {
        return this.resource$.post<any>(`/${accessUrl}/bam/wms-app/inventories/search-by-paging`, searchParam);
    }

    searchInventoryDetail(searchParam: any, accessUrl: string) {
        return this.resource$.post<any>(`/${accessUrl}/bam/wms-app/inventories/search`, searchParam);
    }

}

export default new InventoryService();

