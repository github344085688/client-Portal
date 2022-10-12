import BaseService from "./_base-service";


class CompanyService extends BaseService {


    get(companyId: string) {
        return this.resource$.get<any>(`/idm-app/company/${companyId}`);
    }
    search(params: any) {
        return this.resource$.post<any>(`/idm-app/company/search`, params);
    }
}

export default new CompanyService();