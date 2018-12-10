import BaseService from "./_tms-base-service";


class TmsTrackingService extends BaseService {
    search(params: any) {
        return this.resource$.post<any>(`/get_tracking_info.php`, params);
    }
}

export default new TmsTrackingService();