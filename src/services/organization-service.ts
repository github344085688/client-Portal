
import BaseService from "./_base-service";

class OrganizationService extends BaseService {

    get(organizationId: string) {
        return this.resource$.get<any>(`/fd-app/organization/${organizationId}`);
    }

    notMaintainByRelationshipTags: Array<string> = ["Facility", "Company", "Carrier"];
    tagUrlMap: any = {
        Facility: "/fd-app/facility/search",
        Company: "/fd-app/company/search",
        Carrier: "/bam/carrier/search-around-customerId"
    };

    getOrganizationByTagAndCustomerId(searchParam: any) {
        if (searchParam.relationship) {
            if (this.notMaintainByRelationshipTags.indexOf(searchParam.relationship) > -1) {
                return this.resource$.post<any>(this.tagUrlMap[searchParam.relationship], searchParam);
            } else {
                return this.resource$.post<any>("/bam/organization/search-around-customerId", searchParam);
            }
        } else {
            return this.search(searchParam);
        }
    }

    search(params: any) {
        return this.resource$.post<any>("/fd-app/organization/search", params);
    }


}

export default new OrganizationService();

