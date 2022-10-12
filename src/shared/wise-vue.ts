import { Vue } from "vue-property-decorator";
import { Subscription } from "rxjs/Subscription";
import { map, keyBy, compact, forEach, flattenDeep, find } from "lodash-es";
import session from './session';

export default class WiseVue extends Vue {

    unsubcribers: Subscription[] = [];

    beforeDestroy() {
        this.unsubcribers.forEach(sb => sb.unsubscribe());
    }

    setCustomerIdByUserSelect(customerId: string) {
        session.setCustomerIdByUserSelect(customerId);
        // let facility = this.getfacilitiesBySelectedCustomer()[0];
        // if (facility) {
        //     this.setFacilityByUserSelect(facility);
        // }
    }

    getCustomerIdByUserSelect() {
        let customerId = session.getCustomerIdByUserSelect();
        if (!customerId) {
            customerId = this.getCustomerIds()[0];
            this.setCustomerIdByUserSelect(customerId);
        }
        return customerId;
    }

    setFacilityByUserSelect(facility: any) {
        let facilityId = facility.id;
        if (facilityId) {
            let afcs = session.getAssignedCompanyFacilities();
            let companyAndFacility = find(afcs, (fc: any) => fc.facilityId == facilityId);
            session.setCurrentCompanyFacility(companyAndFacility);

        }
        session.setFacilityByUserSelect(facility);
    }

    getFacilityByUserSelect() {
        let facility = session.getFacilityByUserSelect();
        if (!facility) {
            facility = this.getfacilitiesBySelectedCustomer()[0];
        }
        return facility;
    }

    getCustomerIds() {
        let customerIds = [];
        let relatedCustomerIds = session.getUserRelatedCustomerIds();
        if (relatedCustomerIds && relatedCustomerIds.length > 0) {
            customerIds = relatedCustomerIds;
        }
        return customerIds;
    }

    getAssignedCompanyFacilities() {
        let assignedCompanyFacilities = session.getAssignedCompanyFacilities();
        let facilities = map(assignedCompanyFacilities, "facility");
        return facilities;
    }
    getfacilitiesBySelectedCustomer() {
        let customerId = session.getCustomerIdByUserSelect();
        let fcs = session.getFacilityAndCustomerRelation();
        let assignedCompanyFacilities = session.getAssignedCompanyFacilities();
        let allFacilities = map(assignedCompanyFacilities, "facility");
        let facilitKeyById = keyBy(allFacilities, 'id');
        let facilityIds = compact(flattenDeep(map(fcs, fc => {
            if (fc.orgId == customerId) {
                return fc.activatedFacilityIds;
            }
        })));
        let facilities: any = [];
        forEach(facilityIds, id => {
            if (facilitKeyById[id]) {
                facilities.push(facilitKeyById[id]);
            }
        });
        return facilities;

    }
    getAssignedInvoiceAppCompanyIds() {
        let getAssignedInvoiceAppCompanyIds = session.getAssignedInvoiceAppCompanyIds();
        return getAssignedInvoiceAppCompanyIds;
    }

    getAssignedInvoiceCustomerIds() {
        let getAssignedInvoiceCustomerIds = session.getAssignedInvoiceCustomerIds();
        return getAssignedInvoiceCustomerIds;
    }

    removeFacilityParamAndFillTitleIdsWhenSearch(searchParams: any) {
        if (searchParams.facility) {
            delete searchParams.facility;
        }
        searchParams = this.getParamWithFillRelatedTitleIds(searchParams);
        return searchParams;
    }
    getCustomers() {
        return session.getUserRelatedCustomers();
    }

    getRelatedOrgsKeyByCustomerId() {
        let userInfo: any = session.getUserInfo();
        let relatedOrgsKeyByCustomerId = keyBy(userInfo.relatedOrganizations, 'relatedCustomerId');
        return relatedOrgsKeyByCustomerId;
    }

    getRelatedTitleIds(customerId: string) {
        let cId = customerId || this.getCustomerIdByUserSelect();
        let userInfo: any = session.getUserInfo();
        let relatedOrgsKeyByCustomerId = keyBy(userInfo.relatedOrganizations, 'relatedCustomerId');
        let reletionOrgs = relatedOrgsKeyByCustomerId[cId];
        if (reletionOrgs && compact(reletionOrgs.relatedTitleIds).length > 0) {
            return reletionOrgs.relatedTitleIds;
        }
        return [];
    }

    getParamWithFillRelatedTitleIds(param: any) {
        if (param.titleIds && param.titleIds.length > 0) {
            param.titleIds = param.titleIds;
        } else {
            let titleIds = this.getRelatedTitleIds(param.customerId);
            if (titleIds.length > 0) {
                param.titleIds = titleIds;
            } else {
                delete param.titleIds;
            }
        }
        return param;
    }
}