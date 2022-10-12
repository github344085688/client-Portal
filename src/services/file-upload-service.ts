import BaseService from "./_base-service";

class FileUploadService extends BaseService {

  fileUpload(url: any, params: any) {
    return this.resource$.post<any>(url, params);
  }

}
let fileUploadService = new FileUploadService();
export default fileUploadService;

