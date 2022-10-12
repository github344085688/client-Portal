import BaseService from "./_base-service";

class LoadService extends BaseService {
    searchLoad(searchParam: any) {
        return this.resource$.post<any>(`/bam/outbound/load/search`, searchParam);
    }
}

export default new LoadService();