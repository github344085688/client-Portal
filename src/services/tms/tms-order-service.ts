import BaseService from "./_tms-base-service";


class TmsOrderService extends BaseService {

    search(params: string) {
        return this.resource$.get<any>(`/tms_order_query.php`);
    }
}

export default new TmsOrderService();