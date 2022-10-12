import BaseService from '../_base-service';

class CustomizationService extends BaseService {

    searchDefaultCustomization(param: any) {
        return this.resource$.post<any>(`/fd-app/report-field-customization-mapping/search`, param);
    }

    searchUserCustomization(param: any) {
        return this.resource$.post<any>(`/fd-app/report-customization/view/search`, param);
    }

    searchCustomization(param: any) {
        return this.resource$.post<any>(`/bam/report-customization/search`, param);
    }

    createUserCustomization(param: any) {
        return this.resource$.post<any>(`/fd-app/report-customization/view`, param);

    }

    updateUserCustomization(id: string, param: any) {
        return this.resource$.put<any>(`/fd-app/report-customization/view/${id}`, param);

    }

    searchCustomizationGroupView(param: any) {
        return this.resource$.post<any>(`/fd-app/report-customization/group-view/search`, param);
    }

    createCustomizationGroupView(param: any) {
        return this.resource$.post<any>(`/fd-app/report-customization/group-view`, param);

    }
    deleteCustomizationGroupView(id: string) {
        return this.resource$.delete(`/fd-app/report-customization/group-view/${id}`);

    }

}

export default new CustomizationService();
