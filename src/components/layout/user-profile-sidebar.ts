import WiseVue from "../../shared/wise-vue";
import { Component, Prop, Provide, Watch } from "vue-property-decorator";
import template from "./user-profile-sidebar.vue";
import session from '../../shared/session';
import errorHanlder from '../../shared/error-handler';
import OrganizationService from '../../services/organization-service';


@Component({
    mixins: [template]
})
export default class UserProfileSidebar extends WiseVue {


    userInfo: any = {};
    currentCompanyAndFacility: any = {};
    relatedCustomerName = "";

    get userName() {
        return this.userInfo.firstName + " " + this.userInfo.lastName;
    }

    get facilityName() {
        return this.currentCompanyAndFacility.facility ? this.currentCompanyAndFacility.facility.basic.name : "";
    }

    async mounted() {
        this.userInfo = await session.fetchUserInfo();
        this.currentCompanyAndFacility = session.getCurrentCompanyFacility();
        this.getUserRelatedCustomer();
    }

    private getUserRelatedCustomer() {
        OrganizationService.get(this.userInfo.relatedCustomerId).subscribe(
            org => {
                this.relatedCustomerName = org.basic.name;
            },
            err => {
                errorHanlder.handle(err);
            }
        );
    }
}
