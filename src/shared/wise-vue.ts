import { Vue } from "vue-property-decorator";
import { Subscription } from "rxjs/Subscription";
import { map } from "lodash-es";
import session from './session';

export default class WiseVue extends Vue {

    unsubcribers: Subscription[] = [];

    beforeDestroy() {
        this.unsubcribers.forEach(sb => sb.unsubscribe());
    }

    setCustomerIdByUserSelect(customerId: string) {
        session.setCustomerIdByUserSelect(customerId);
    }

    getCustomerIdByUserSelect() {
        let customerId = session.getCustomerIdByUserSelect();
        if (!customerId) {
            customerId = this.getCustomerIds()[0];
        }
        return customerId;
    }

    setFacilityByUserSelect(facility: any) {
        session.setFacilityByUserSelect(facility);
    }

    getFacilityByUserSelect() {
        let facility = session.getFacilityByUserSelect();
        if (!facility) {
            facility = this.getAssignedCompanyFacilities()[0];
        }
        return facility;
    }

    getCustomerIds() {
        let customerIds = [];
        if (session.getUserRelatedCustomerId()) {
            customerIds = session.getUserRelatedCustomerId().split(',');
        }
        return customerIds;
    }

    getAssignedCompanyFacilities() {
        let assignedCompanyFacilities = session.getAssignedCompanyFacilities();
        let facilities = map(assignedCompanyFacilities, "facility");
        return facilities;
    }
}