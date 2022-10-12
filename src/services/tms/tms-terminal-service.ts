import { param } from "jquery";
import BaseService from "@services/_base-service";
import ax from '@shared/axios';
class TmsTerminalService extends BaseService {

    downLoadTerminalTemplate() {
        return ax.get(`/cpapi/tms/terminal/import/template`, {
            responseType: 'blob'
        });
    }

    getTerminal(params: any) {
        return this.resource$.post<any>('/cpapi/tms/terminal/list/paginate', params);
    }

    exportTerminal() {
        return ax.get<any>(`/cpapi/tms/terminal/export`, {
            responseType: 'blob'
        });
    }

    importTerminal(params: any) {
        return this.resource$.post<any>('/cpapi/tms/terminal/import', params);
    }

    saveTerminal(params: any) {
        return this.resource$.post<any>('/cpapi/tms/terminal', params);
    }

    getTerminalDetail(terminal_id: any) {
        return this.resource$.post<any>(`/cpapi/tms/terminal/${terminal_id}/detail`, {});
    }

    // Zone
    downLoadTerminalZoneTemplate() {
        return ax.get(`/cpapi/tms/terminal/zone/import/template`, {
            responseType: 'blob'
        });
    }

    getTerminalZone(params: any) {
        return this.resource$.post<any>('/cpapi/tms/terminal/zone/list', params);
    }

    importTerminalZone(terminal_id: any, params: any) {
        return this.resource$.post<any>(`/cpapi/tms/terminal/${terminal_id}/zone/import`, params);
    }

    exportTerminalZone(terminal_id: any) {
        return ax.get(`/cpapi/tms/terminal/${terminal_id}/zone/export`, {
            responseType: 'blob'
        });
    }

    updateZoneDetailList(terminal_id: string, params: any) {
        return this.resource$.post<any>(`/cpapi/tms/terminal/${terminal_id}/zone/update`, params);
    }

    getZoneCategory() {
        return this.resource$.get<any>(`/cpapi/tms/terminal/zone/category/list`);
    }

    // matrix
    exportTerminalmatrix(terminal_id: any) {
        return ax.get(`/cpapi/tms/terminal/matrix/export?terminal_id=${terminal_id}`, {
            responseType: 'blob'
        });
    }

    getTerminalMatrix(params: any) {
        return this.resource$.post<any>(`/cpapi/tms/terminal/matrix/list`, params);
    }

    updateTerminalMatrix(params: any) {
        return this.resource$.post<any>(`/cpapi/tms/terminal/matrix/update`, params);
    }

    downLoadMatrixTemplate() {
        return ax.get(`/cpapi/tms/terminal/matrix/import/template`, {
            responseType: 'blob'
        });
    }

    importMatrix(params: any) {
        return this.resource$.post<any>('/cpapi/tms/terminal/matrix/import', params);
    }
}

export default new TmsTerminalService();