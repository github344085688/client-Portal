
import BaseService from "./_base-service";

class OrganizationService extends BaseService {

    get(organizationId: string) {
        return this.resource$.get<any>(`/fd-app/organization/${organizationId}`);
    }

    notMaintainByRelationshipTags: Array<string> = ["Facility", "Company", "Carrier", "Retailer", "Organization", "Title"];
    tagUrlMap: any = {
        Facility: "/fd-app/facility/search",
        Company: "/idm-app/company/search",
        Carrier: "/bam/carrier/search-around-customerId",
        Retailer: "/bam/organization/search-around-customerId",
        Organization: "/fd-app/organization/search",
        Title: "/bam/organization/search-around-customerId"
    };

    getOrganizationByTagAndCustomerId(searchParam: any) {
        if (searchParam.relationship) {
            if (this.notMaintainByRelationshipTags.indexOf(searchParam.relationship) > -1) {
                return this.resource$.post<any>(this.tagUrlMap[searchParam.relationship], searchParam);
            } else {
                return this.resource$.post<any>("/bam/organization/search-not-contain-all-customer", searchParam);
            }
        } else {
            return this.search(searchParam);
        }
    }


    search(params: any) {
        return this.resource$.post<any>("/shared/bam/organization/search", params);
    }

    searchCustomer(param: any) {
        return this.resource$.post<any>("/fd-app/customer/search", param);
    }

    getCarrierByOrgId(id: string) {
      return this.resource$.get(`/fd-app/carrier/${id}`);
    }

    getCustomerByOrgId(orgId: any) {
      return this.resource$.get(`/fd-app/customer/${orgId}`);
    }

}

export default new OrganizationService();

