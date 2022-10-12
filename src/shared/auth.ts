import session from './session';
import errorHanlder from './error-handler';

import companyService from "@services/company-service";
import facilityService from "@services/facility-service";
import userService from "@services/user-service";
import { map, uniq, concat, keyBy, forEach } from 'lodash-es';
import organizationService from "@services/organization-service";
import { flatMap, isEmpty } from 'lodash-es';
export class Auth {

    isSignIn() {
        return session.getUserId();
    }



    async initialRequiredUserInfo() {
        await this.fetchCurrentCompanyFacility(),
            await this.setUserRelatedCustomerIds(),
            await this.setUserRelatedCustomers(),
            await this.AssignedCompanyFacilities();
        await this.AssignedInvoiceAppCompanyIds();
        await this.AssignedInvoiceCustomerIds();
        await this.setFacilityAndCustomerRelation();
    }

    async AssignedCompanyFacilities() {
        if (session.getAssignedCompanyFacilities()) {
            return session.getAssignedCompanyFacilities();
        } else {
            let userInfo = await session.fetchUserInfo();
            let companyIds = uniq(map(userInfo.assignedCompanyFacilities, "companyId"));
            let facililtyIds = uniq(map(userInfo.assignedCompanyFacilities, "facilityId"));
            let [assignedCompanys, assignedFacilitys] = await Promise.all([
                companyService.search({ ids: companyIds, excludeFacility: true  }).toPromise(),
                facilityService.search({ ids: facililtyIds, excludeFacility: true }).toPromise()]);
            let assignedCompanyFacilities = concat(assignedCompanys, assignedFacilitys);
            let orgsMap = keyBy(assignedCompanyFacilities, function (o) { return o.id; });
            let ctx = this;
            forEach(userInfo.assignedCompanyFacilities, function (companyFacility) {
                ctx.fillCompanyFacilityObjInfoById(companyFacility, orgsMap);
            });
            session.setAssignedCompanyFacilities(userInfo.assignedCompanyFacilities);
        }
    }

    private async AssignedInvoiceAppCompanyIds() {
        let userInfo = await session.fetchUserInfo();
        if (userInfo.invoiceAppCompanyIdsMappings) {
            session.setAssignedInvoiceAppCompanyIds(userInfo.invoiceAppCompanyIdsMappings);
        }
    }

    private async AssignedInvoiceCustomerIds() {
        let userInfo = await session.fetchUserInfo();
        if (userInfo.invoiceCustomerIds) {
            session.setAssignedInvoiceCustomerIds(userInfo.invoiceCustomerIds);
        }
    }

    private async fillCompanyFacilityObjInfoById(companyFacility: any, orgsMap: any) {
        if (!companyFacility) return;
        if (companyFacility.companyId) {
            companyFacility.company = orgsMap[companyFacility.companyId];
            if (orgsMap[companyFacility.companyId] && orgsMap[companyFacility.companyId].basic) {
                companyFacility.company.name = orgsMap[companyFacility.companyId].basic.name;
            }

        }
        if (companyFacility.facilityId) {
            companyFacility.facility = orgsMap[companyFacility.facilityId];
            if (orgsMap[companyFacility.facilityId] && orgsMap[companyFacility.facilityId].basic) {
                companyFacility.facility.name = orgsMap[companyFacility.facilityId].basic.name;
            }

        }
    }

    private async fetchCurrentCompanyFacility() {
        if (session.getCurrentCompanyFacility()) {
            return session.getCurrentCompanyFacility();
        } else {
            let userInfo = await session.fetchUserInfo();
            if (!userInfo.defaultCompanyFacility) {
                if (userInfo.assignedCompanyFacilities.length === 0 && !session.getSsoMark()) {
                    errorHanlder.handle('Please contact IT to configure the user related company and facility.');
                    throw new Error('Please contact IT to configure the user related company and facility.');
                } else {
                    userInfo.defaultCompanyFacility = userInfo.assignedCompanyFacilities[0] || {};
                }
            }
            if (!isEmpty(userInfo.defaultCompanyFacility)) {
                session.setCurrentCompanyFacility(userInfo.defaultCompanyFacility);
                let [currentCompany, currentFacility] = await Promise.all([
                    companyService.get(userInfo.defaultCompanyFacility.companyId).toPromise(),
                    facilityService.get(userInfo.defaultCompanyFacility.facilityId).toPromise()]);
                session.setFacilityByUserSelect(currentFacility);
            }
            return session.getCurrentCompanyFacility();
        }
    }

    async setUserRelatedCustomerIds() {
        if (!session.getUserRelatedCustomerIds()) {
            let userInfo = await session.fetchUserInfo();
            if (userInfo.relatedOrganizations.length > 0) {
                let relatedCustomerIds = map(userInfo.relatedOrganizations, 'relatedCustomerId');
                session.setUserRelatedCustomerIds(relatedCustomerIds);
            }
            return session.getUserRelatedCustomerIds();
        }
    }

    async setUserRelatedCustomers() {
        if (!session.getUserRelatedCustomers()) {
            let customerIds = session.getUserRelatedCustomerIds();
            if (customerIds && customerIds.length > 0) {
                let res = await organizationService.search({ ids: customerIds }).toPromise();
                let orgs: any = flatMap(res, "basic");
                return session.setUserRelatedCustomers(orgs);
            }
        }
    }

    async setFacilityAndCustomerRelation() {
        let userInfo = await session.fetchUserInfo();
        if (userInfo.relatedOrganizations.length > 0) {
            let relatedCustomerIds = map(userInfo.relatedOrganizations, 'relatedCustomerId');
            if (relatedCustomerIds && relatedCustomerIds.length > 0) {
                let res = await organizationService.searchCustomer({ orgIds: relatedCustomerIds, excludeFacility: true  }).toPromise();
                let list = res.map((customer: any) => { return { orgId: customer.orgId, activatedFacilityIds: customer.activatedFacilityIds }; });
                session.setFacilityAndCustomerRelation(list);
            }
        }
    }

}

export default new Auth();