import BaseService from "./_base-service";
import ax from '@shared/axios';

class MarketplaceService extends BaseService {
   searchList(params: object) {
      return this.resource$.post<any>(`/report-center/marketplace/item-list`, params);
   }

   updateList(params: object) {
      return this.resource$.post<any>(`/report-center/marketplace/item-batch-update`, params);
   }

   export(params: object) {
      return ax.post(`/wms-app/report/export`, params, {
         responseType: 'arraybuffer'
      });
   }
}

let marketplaceService =  new MarketplaceService();
export default marketplaceService;