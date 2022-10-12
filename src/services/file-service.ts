
import BaseService from "./_base-service";
import ax from '@shared/axios';
class FileService extends BaseService {

    getCombinedPdf(url: string, param: any) {
      return ax.get<any>(url, param);
    }

    searchFile(params: any, accessUrl?: String) {
        return this.resource$.post<any>(`/base-app/file-entry/search`, params, {}, { accessUrl: accessUrl });
    }

    searchFileInfo( params: any) {
        return this.resource$.post<any>('/shared/file-app/file-info/search', params);
    }

    disableFile(fileId: any, accessUrl?: String) {
        return this.resource$.put<any>(`/base-app/file-entry/${fileId}/disable`, {}, {}, { accessUrl: accessUrl });
    }

    fileRntry( params: any, accessUrl?: String) {
        params.fileType = "Photo";
        params.fileScenario = "Other";
        params.fileCategory = "Receipt";
        return this.resource$.post<any>('/base-app/file-entry', params, {}, { accessUrl: accessUrl });
    }




}

export default new FileService();

