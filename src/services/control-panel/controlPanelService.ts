import BaseService from "@services/_base-service";

class ControlPanelService extends BaseService {

    getOrderPanelData(param: any) {
        return this.resource$.post<any>('/cpapi/tms/order/infos/control/panel', param);
    }

    getDispatchOrderData(param: any) {
        return this.resource$.post<any>('/cpapi/tms/order/infos/dispatch/panel', param);
    }

    goTmsOrderEditPage(puId: any) {
        return this.resource$.get<any>(`/cpapi/tms/order/${puId}/edit`, {});
    }

    getOrderDeatilById(id: any) {
        return this.resource$.post<any>(`/cpapi/tms/order/${id}/detail`, {orderId: id});
    }

    getOrderHistory(id: any) {
        return this.resource$.get<any>(`/cpapi/tms/order/${id}/log/list`);
    }

    getTripPanelData(param: any) {
        return this.resource$.post<any>('/cpapi/tms/trip/infos/control/panel', param);
    }

    getTripDetail(tripId: any) {
        return this.resource$.get<any>(`/cpapi/tms/trip/${tripId}/detail`);
    }

    getCarrierList(params: any) {
        return this.resource$.post<any>(`/cpapi/tms/carrier/list`, {
            carrier_only: 1,
            search_term: params.text || '',
            location_id: params.id || ''
        });
    }

    getTerminal() {
        return this.resource$.post<any>('/cpapi/tms/dispatch/terminal', {});
    }

    validateOrder(params: any) {
        return this.resource$.post<any>(`/cpapi/tms/trip-order/${params.orderId}/validate`, params);
    }

    validateLineHaul(params: any) {
        return this.resource$.post<any>(`/cpapi/tms/trip-linehaul/${params.linehaulId}/validate`, params);
    }

    validateOrderLines(params: any) {
        return this.resource$.post<any>(`/cpapi/tms/trip/lines/validate`, {add_line_array: params});
    }

    validateTrailer(trailerId: any) {
        return this.resource$.get<any>(`/cpapi/tms/equipment/trailer/${trailerId}/validate`, {});
    }

    createNewTrip(param: any) {
        return this.resource$.post<any>('/cpapi/tms/new-trip/create', param);
    }

    mergeTrip(params: any) {
        return this.resource$.post<any>(`/cpapi/tms/trip/${params.tripNo}/mergeto`, {targetTripId: params.targetTripId});
    }

    transferTrip(params: any) {
        return this.resource$.post<any>(`/cpapi/tms/trip/${params.currentTripId}/transfer/to/${params.targetTripId}`, params);
    }

    moveTaskStop(tripId: any, params: any) {
        return this.resource$.post<any>(`/cpapi/tms/trip/${tripId}/move/stops`, params);
    }

    searchTerminal() {
        return this.resource$.post<any>('/cpapi/tms/dispatch/terminal', {});
    }

    getDriverData(param: any) {
        return this.resource$.post<any>('/cpapi/tms/driver/infos', param);
    }

    getTmsDriverCompany() {
        return this.resource$.get<any>(`/cpapi//tms/company/getDriverCompanyList`);
    }

    goTmsDriverPage(driverId: any, driverUserId: any, eldAccountId: any) {
        return this.resource$.post<any>(`/cpapi/tms/driver/detail/${driverId}/${driverUserId}/${eldAccountId}`, {});
    }

    getEquipmentData(param: any) {
        return this.resource$.post<any>(`/cpapi/tms/equipment/infos`, param);
    }

    getEquipmentGroups() {
        return this.resource$.get<any>(`/cpapi/tms/equipment/vehicleGroupList`);
    }

    getNotificationData(param: any) {
        return this.resource$.post<any>('/cpapi/tms/notification/infos', param);
    }

    getTripLog(tripId: any) {
        return this.resource$.post<any>(`/cpapi/tms/trip/${tripId}/log/list`, {});
    }


    // trip tools
    getTripSummaryPdf(tripId: any) {
        return this.resource$.get<any>(`/cpapi/tms/trip/${tripId}/summary`);
    }

    getTripSummaryPdfWithManifest(tripId: any) {
        return this.resource$.get<any>(`/cpapi/tms/trip/${tripId}/manifest2`);
    }

    getTripManifestPdf(tripId: any) {
        return this.resource$.get<any>(`/cpapi/tms/trip/${tripId}/manifest`);
    }

    getTripMarginPdf(tripId: any) {
        return this.resource$.get<any>(`/cpapi/tms/trip/${tripId}/margin`);
    }

    getTripMarginExcel(tripId: any) {
        return this.resource$.get<any>(`/cpapi/tms/trip/${tripId}/download/margin/excel`);
    }

    getTripLoadSheetPdf(tripId: any) {
        return this.resource$.get<any>(`/cpapi/tms/trip/${tripId}/load/sheet`);
    }

    getTripDailyManifestPdf(tripId: any) {
        return this.resource$.get<any>(`/cpapi/tms/trip/${tripId}/daily/manifest`);
    }

    getTripDrPdf(tripId: any, delivery: any, doubleSide: any) {
        // is double side print = 1, is DR delivery then delivery = 1
        return this.resource$.get<any>(`/cpapi/tms/trip/${tripId}/dr/${delivery}/${doubleSide}`);
    }

    getTripCarrierBolPdf(tripId: any) {
        return this.resource$.get<any>(`/cpapi/tms/trip/${tripId}/carrier/bol`);
    }

    makeTripComplete(tripId: any) {
        return this.resource$.get<any>(`/cpapi/tms/trip/${tripId}/complete`);
    }

    makeTripIncomplete(tripId: any) {
        return this.resource$.get<any>(`/cpapi/tms/trip/${tripId}/incomplete`);
    }

    searchTrailer(trailer: any, companyId: string | number) {
        return this.resource$.get<any>(`/cpapi/tms/equipment/trailers?&search=${trailer}&companyId=${companyId}&limit=9999`);
    }


    // file
    linkFileToTask(fileId: any, param: any) {
        return this.resource$.post<any>(`/cpapi/tms/trip/file/${fileId}/link-to-task`, param);
    }

    linkFileToTrip(tripId: any, param: any) {
        return this.resource$.post<any>(`/cpapi/tms/trip/${tripId}/write/file`, param);
    }

    fileLinkToCatagory(fileId: any, param: any) {
        return this.resource$.post<any>(`/cpapi/tms/trip/file/${fileId}/update-category`, param);
    }

    fileCatagryList() {
        return this.resource$.post<any>('/cpapi/tms/files/category', {});
    }

    upLoadFile(params: any) {
        return this.resource$.post<any>('/cpapi/tms/trip/file/upload', params);
    }

    deleteFile(fileId: any) {
        return this.resource$.delete<any>(`/cpapi/tms/file/${fileId}`);
    }

    // WMS
    getWMSPanelData(params: any) {
        return this.resource$.post<any>('/cpapi/wms/order/search', params);
    }

    // message
    getTmsClientId() {
        return this.resource$.get<any>(`/cpapi/tms/message/clientId`);
    }

    createChannel(params: any) {
        return this.resource$.post<any>('/cpapi/tms/message/channel/create', params);
    }

    checkChannel(params: any) {
        return this.resource$.post<any>('/cpapi/tms/message/channel/check', params);
    }

    sendMessage(params: any) {
        return this.resource$.post<any>('/cpapi/tms/message/send', params);
    }

    // relationship
    getPanelRelationshipList() {
        return this.resource$.post<any>('/cpapi/panel-relationship/search', {});
    }

    getPanelRelationshipDetail(panelName: String) {
        return this.resource$.post<any>('/cpapi/panel-relationship-detail/search', {panelName: panelName});
    }

    getAllPanelApikeys() {
        return this.resource$.get<any>('/cpapi/panel-relationship-detail/get-api-keys');
    }

    updatePanelRelationship(params: any) {
        return this.resource$.post<any>('/cpapi/panel-relationship-detail/update', params);
    }

    getGisTractors(terminal: string) {
        let params = {
            url: `/controlPanel/gis/tractors?page_size=10000000&terminal=${terminal}`
        };
        return this.resource$.post<any>(`/cpapi/tms/getApinewApiTransform`, params);
    }


    getGisTrailers(terminal: string) {
        let params = {
            url: `/controlPanel/gis/trailers?page_size=10000000&terminal=${terminal}`
        };
        return this.resource$.post<any>(`/cpapi/tms/getApinewApiTransform`, params);
    }
}

export default new ControlPanelService();