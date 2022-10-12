import BaseService from "./_base-service";
import ax from '@shared/axios';

class IdManagementService extends BaseService {
   userDirectory(params: object) {
      return this.resource$.post<any>(`/shared/bam/wso2/user-directory`, params);
   }

   updateRoleListOfUser(params: any) {
      return this.resource$.post<any>(`/shared/bam/wso2/updateRoleListOfUser`, params);
   }

   platformList() {
      return this.resource$.post<any>(`/shared/bam/wso2/platform-list`, {});
   }

   platformUsers(params: any) {
      return this.resource$.post<any>(`/shared/bam/wso2/platform-users`, params);
   }

   downloadPlatformUsers(params: any) {
      return ax.post(`/shared/bam/wso2/download/platform-users`, params, {
          responseType: 'arraybuffer'
      });
  }

  downloadUserDirectory(params: any) {
   return ax.post(`/shared/bam/wso2/download/user-directory`, params, {
       responseType: 'arraybuffer'
   });
}
}

let idManagementService =  new IdManagementService();
export default idManagementService;