
import BaseService from "./_base-service";

class ItemUnitService extends BaseService {

    searchItemUnit(params: any) {
        return this.resource$.post<any>("/fd-app/item-unit/search", params);
    }

}

export default new ItemUnitService();

