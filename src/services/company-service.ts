import BaseService from "./_base-service";


class CompanyService extends BaseService {


    get(companyId: string) {
        return this.resource$.get<any>(`/fd-app/company/${companyId}`);
    }
    search(params: any) {
        return this.resource$.post<any>(`/fd-app/facility/search`, params);
    }
}

export default new CompanyService();