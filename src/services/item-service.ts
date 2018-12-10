
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


}

export default new ItemService();

