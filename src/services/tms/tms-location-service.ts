import BaseService from "./_tms-base-service";


class TmsLocationService extends BaseService {
    search(params: any) {
        return this.resource$.post<any>(`/get_location_list.php`, params);
    }
}

export default new TmsLocationService();