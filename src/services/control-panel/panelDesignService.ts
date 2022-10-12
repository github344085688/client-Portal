import BaseService from "../_base-service";

class PanelDesiginService extends BaseService {

    getUserPanelData() {
        return this.resource$.post<any>('/cpapi/panel-setting-etc/search', {});
    }

    dateUserPanelData(id: any) {
        return this.resource$.post<any>('/cpapi/panel-setting-etc/delete', {id: id});
    }

    saveUserPanelData(name: any, data: any) {
        return this.resource$.post<any>('/cpapi/panel-setting-etc/create', {name: name, data: data});
    }

    updateUserPanelData(id: any, name: any, data: any) {
        return this.resource$.post<any>('/cpapi/panel-setting-etc/update', {id: id, name: name, data: data});
    }
}

export default new PanelDesiginService();