import session from './session';
import errorHanlder from './error-handler';

import companyService from "../services/company-service";
import facilityService from "../services/facility-service";
import userService from "../services/user-service";
import { map, uniq, concat, keyBy, forEach } from 'lodash-es';

export class Auth {

    isSignIn() {
        return session.getUserId();
    }



    async initialRequiredUserInfo() {
        await this.fetchCurrentCompanyFacility(),
        await this.setUserRelatedCustomerId(),
        await this.AssignedCompanyFacilities();
    }

    async AssignedCompanyFacilities() {
        if (session.getAssignedCompanyFacilities()) {
            return session.getAssignedCompanyFacilities();
        } {
            let userInfo = await session.fetchUserInfo();
            let companyIds = uniq(map(userInfo.assignedCompanyFacilities, "companyId"));
            let facililtyIds = uniq(map(userInfo.assignedCompanyFacilities, "facilityId"));
            let [assignedCompanys, assignedFacilitys] = await Promise.all([
                companyService.search({ ids: companyIds }).toPromise(),
                facilityService.search({ ids: facililtyIds }).toPromise()]);
            let assignedCompanyFacilities = concat(assignedCompanys, assignedFacilitys);
            let orgsMap = keyBy(assignedCompanyFacilities, function (o) { return o.id; });
            let ctx = this;
            forEach(userInfo.assignedCompanyFacilities, function (companyFacility) {
                ctx.fillCompanyFacilityObjInfoById(companyFacility, orgsMap);
            });
            session.setAssignedCompanyFacilities(userInfo.assignedCompanyFacilities);
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
            let [currentCompany, currentFacility] = await Promise.all([
                companyService.get(userInfo.defaultCompanyFacility.companyId).toPromise(),
                facilityService.get(userInfo.defaultCompanyFacility.facilityId).toPromise()]);
            session.setCurrentCompanyFacility({ company: currentCompany, facility: currentFacility });
            return session.getCurrentCompanyFacility();
        }
    }

    async setUserRelatedCustomerId() {
        if (!session.getUserRelatedCustomerId()) {
            let userInfo = await session.fetchUserInfo();
            session.setUserRelatedCustomerId(userInfo.relatedCustomerId);
            return session.getUserRelatedCustomerId();
        }
    }


}

export default new Auth();