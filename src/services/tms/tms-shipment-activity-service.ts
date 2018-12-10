import BaseService from "./_tms-base-service";


class TmsShipmentActivityService extends BaseService {

    search(params: any) {
        return this.resource$.post<any>(`/get_shipment_activity_list.php`, params);
    }
    downLoadExcel(params: any) {
        return this.resource$.post<any>(`/get_shipment_activity_as_excel.php`, params);
    }
}

export default new TmsShipmentActivityService();